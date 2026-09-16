import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { handleMetaVerification, handleInboundWebhook } from './webhookHandler.js';
import {
  invoices,
  createAndSendInvoice,
  markInvoicePaid,
  renderCheckoutHtml,
  broadcastDueInvoicesToAll,
} from './invoiceService.js';
import { generateInvoicePdf } from './invoicePdfGenerator.js';
import {
  getActiveAiConfig,
  saveActiveAiConfig,
  testAiConnection,
  generateAIResponse,
  DEFAULT_SYSTEM_PROMPT,
} from './aiService.js';
import {
  getTenantMetaConfig,
  saveTenantMetaConfig,
  getTenantByPhoneNumberId,
} from './tenantMetaManager.js';
import {
  SAAS_PLANS,
  getWorkspaceSubscription,
  createCheckoutSession,
  activateWorkspaceSubscription,
  cancelSubscription,
} from './billingService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const META_CONFIG_FILE = path.resolve(__dirname, 'metaConfig.json');

// Helper to load meta config dynamically
function loadMetaConfig() {
  try {
    if (fs.existsSync(META_CONFIG_FILE)) {
      const data = JSON.parse(fs.readFileSync(META_CONFIG_FILE, 'utf-8'));
      if (data.phoneNumberId) process.env.META_WHATSAPP_PHONE_NUMBER_ID = data.phoneNumberId;
      if (data.accessToken) {
        process.env.META_WHATSAPP_ACCESS_TOKEN = data.accessToken;
        process.env.META_INSTAGRAM_ACCESS_TOKEN = data.accessToken;
      }
      if (data.wabaId) process.env.META_WHATSAPP_WABA_ID = data.wabaId;
      if (data.verifyToken) process.env.META_WHATSAPP_VERIFY_TOKEN = data.verifyToken;
      console.log('🔄 [MetaConfig] Loaded dynamic Meta credentials from metaConfig.json');
    }
  } catch (err) {
    console.warn('[MetaConfig] Error reading metaConfig.json:', err.message);
  }
}
loadMetaConfig();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// 1. Health check & Diagnostics
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Dhigrowth CRM Omnichannel Webhook Gateway',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    channels: ['whatsapp', 'instagram', 'messenger', 'line'],
    supabaseConnected: Boolean(process.env.VITE_SUPABASE_URL),
    verifyTokenConfigured: Boolean(process.env.META_WHATSAPP_VERIFY_TOKEN),
  });
});

// 2. Meta Webhook Handshake (GET /, /webhook, /api/webhook)
app.get('/webhook', handleMetaVerification);
app.get('/', handleMetaVerification);
app.get('/api/webhook', handleMetaVerification);

// 3. Meta Webhook Inbound Message Receiver (POST /, /webhook, /api/webhook)
app.post('/webhook', handleInboundWebhook);
app.post('/', handleInboundWebhook);
app.post('/api/webhook', handleInboundWebhook);

// 4. Test Inbound Simulator Endpoint (Allows instant testing without Meta tunnel)
app.post('/api/test-inbound', async (req, res) => {
  const {
    phone = '919791471277',
    name = 'Priya Sharma',
    message = 'Hi, can I place a COD order for the King Size Linen bedcover?',
    channel = 'whatsapp',
  } = req.body;

  let simulatedPayload;

  if (channel === 'whatsapp') {
    simulatedPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
          changes: [
            {
              value: {
                messaging_product: 'whatsapp',
                metadata: {
                  display_phone_number: '16505551111',
                  phone_number_id: process.env.META_WHATSAPP_PHONE_NUMBER_ID || '1349867994870208',
                },
                contacts: [{ profile: { name }, wa_id: phone }],
                messages: [
                  {
                    from: phone,
                    id: `wamid.SIMULATED_${Date.now()}`,
                    timestamp: Math.floor(Date.now() / 1000).toString(),
                    type: 'text',
                    text: { body: message },
                  },
                ],
              },
              field: 'messages',
            },
          ],
        },
      ],
    };
  } else {
    simulatedPayload = {
      object: channel === 'instagram' ? 'instagram' : 'page',
      entry: [
        {
          id: 'TEST_ACCOUNT_ID',
          messaging: [
            {
              sender: { id: phone },
              recipient: { id: 'TEST_PAGE' },
              timestamp: Date.now(),
              message: {
                mid: `mid.SIMULATED_${Date.now()}`,
                text: message,
              },
            },
          ],
        },
      ],
    };
  }

  // Pass to the inbound webhook handler
  req.body = simulatedPayload;
  await handleInboundWebhook(req, res);
});

// 5. Manual Message Dispatch Endpoint (Dispatches live to WhatsApp/IG + logs in Supabase)
app.post('/api/send-manual-message', async (req, res) => {
  try {
    const {
      recipientPhone,
      text,
      conversationId = 'c1000000-0000-0000-0000-000000000001',
      channelId = 'd0000000-0000-0000-0000-000000000001',
      channelType = 'whatsapp',
      phoneNumberId,
      accessToken,
      workspaceId,
      userId,
      username,
    } = req.body;

    if (!recipientPhone || !text) {
      return res.status(400).json({ error: 'recipientPhone and text are required' });
    }

    console.log(`\n📤 [Manual Agent Send] Recipient: ${recipientPhone} | Channel: ${channelType} | Workspace: ${workspaceId || 'default'}`);
    console.log(`💬 Content: "${text}"`);

    // 1. Dispatch via Meta Graph API using tenant-specific credentials
    let metaResult = null;
    const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');

    if (channelType === 'whatsapp') {
      let sendPhoneId = phoneNumberId;
      let sendToken = accessToken;

      if (!sendPhoneId || !sendToken) {
        const tenantConfig = getTenantMetaConfig({ workspaceId, userId, username });
        sendPhoneId = sendPhoneId || tenantConfig.phoneNumberId;
        sendToken = sendToken || tenantConfig.accessToken;
      }

      sendPhoneId = sendPhoneId || process.env.META_WHATSAPP_PHONE_NUMBER_ID;
      sendToken = sendToken || process.env.META_WHATSAPP_ACCESS_TOKEN;

      if (sendPhoneId && sendToken) {
        const response = await fetch(
          `https://graph.facebook.com/v20.0/${sendPhoneId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sendToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: cleanPhone,
              type: 'text',
              text: { preview_url: false, body: text },
            }),
          }
        );

        metaResult = await response.json();
        if (!response.ok) {
          console.error('[Manual Send] Meta API error:', metaResult);
        } else {
          console.log('✅ Dispatched successfully to WhatsApp phone via Phone ID:', sendPhoneId, 'Meta ID:', metaResult.messages?.[0]?.id);
        }
      } else {
        console.warn(`[Manual Send] Meta WhatsApp not configured for user/workspace (${workspaceId || userId}). Running in simulated support mode.`);
      }
    }

    // 2. Log in Supabase under this tenant's workspace
    const effectiveWorkspaceId = workspaceId || process.env.VITE_DEFAULT_WORKSPACE_ID || 'b0000000-0000-0000-0000-000000000001';
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(supabaseUrl, supabaseAnonKey);

      await supabase.from('messages').insert([
        {
          workspace_id: effectiveWorkspaceId,
          conversation_id: conversationId,
          channel_id: channelId,
          direction: 'outbound',
          ai_generated: false, // Explicitly tagged as Human Support Agent
          type: 'text',
          content: text,
          status: metaResult?.messages?.[0]?.id ? 'sent' : 'delivered',
          external_message_id: metaResult?.messages?.[0]?.id || null,
        },
      ]);

      await supabase
        .from('conversations')
        .update({
          last_message_text: text,
          last_message_at: new Date().toISOString(),
        })
        .eq('id', conversationId);
    }

    res.json({
      success: true,
      metaResult,
      deliveredToWhatsApp: Boolean(metaResult?.messages?.[0]?.id),
      errorDetails: metaResult?.error
        ? {
            message: metaResult.error.message,
            code: metaResult.error.code,
            details: metaResult.error.error_data?.details || metaResult.error.message,
          }
        : null,
    });
  } catch (err) {
    console.error('Error dispatching manual message:', err);
    res.status(500).json({ error: err.message });
  }
});

// 6. Real-Time Translation Endpoint (Google Translate API)
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLang = 'hi' } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text is required for translation' });
    }

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text.trim())}`;
    const response = await fetch(url);
    const data = await response.json();
    const translatedText = data[0].map((s) => s[0]).join('');

    console.log(`🌐 [Translate] (${targetLang}) "${text}" -> "${translatedText}"`);

    res.json({
      success: true,
      originalText: text,
      translatedText,
      targetLang,
    });
  } catch (err) {
    console.error('[Translation Error]:', err);
    res.status(500).json({ error: 'Translation failed', message: err.message });
  }
});

// 7. Invoices & WhatsApp PDF Dispatch System
// 7.1 Create & Dispatch Invoice Due PDF to WhatsApp
app.post('/api/invoices/create-and-send', async (req, res) => {
  try {
    const {
      customerName,
      phone,
      email,
      city,
      description,
      amount,
      conversationId,
    } = req.body;

    if (!phone) {
      return res.status(400).json({ error: 'Customer phone number is required' });
    }

    const baseUrl = (process.env.RENDER_EXTERNAL_URL || process.env.VITE_BACKEND_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');
    const result = await createAndSendInvoice({
      customerName,
      phone,
      email,
      city,
      description,
      amount,
      conversationId,
      baseUrl,
    });

    res.json({
      success: true,
      invoice: result.invoice,
      metaResult: result.metaResult,
    });
  } catch (err) {
    console.error('[Create & Send Invoice Route Error]:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7.1.1 Broadcast Payment Due Invoice PDFs to All Contacts
app.post('/api/invoices/broadcast-due-to-all', async (req, res) => {
  try {
    const { contacts, description, amount, messageTemplate } = req.body || {};
    const baseUrl = (process.env.RENDER_EXTERNAL_URL || process.env.VITE_BACKEND_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');

    console.log(`📡 [Broadcast API Request] Base URL: ${baseUrl} | Amount: ${amount || 2499} | HasCustomTemplate: ${Boolean(messageTemplate)}`);

    const summary = await broadcastDueInvoicesToAll({
      contacts,
      description,
      amount,
      messageTemplate,
      baseUrl,
    });

    res.json({
      success: true,
      summary,
    });
  } catch (err) {
    console.error('[Broadcast Invoices Route Error]:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7.2 Get dynamic Invoice / Receipt PDF
app.get('/api/invoices/:id/pdf', async (req, res) => {
  try {
    const invoiceId = req.params.id;
    let invoice = invoices.get(invoiceId);

    if (!invoice) {
      // Create a fallback sample invoice for viewing
      invoice = {
        id: invoiceId,
        customerName: 'Valued Client',
        phone: '+91 97914 71277',
        email: 'client@example.com',
        city: 'India',
        description: 'DhiGrowth IT Business Services & WhatsApp CRM',
        amount: 2499,
        status: 'due',
        paymentLink: `${req.protocol}://${req.get('host')}/invoices/${invoiceId}/pay`,
      };
      invoices.set(invoiceId, invoice);
    }

    const pdfBuffer = await generateInvoicePdf(invoice);
    const filename = `${invoice.status === 'paid' ? 'Receipt' : 'Invoice'}_${invoice.id}.pdf`;

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (err) {
    console.error('[Serve Invoice PDF Error]:', err);
    res.status(500).send('Error rendering PDF: ' + err.message);
  }
});

// 7.3 Serve Hosted Payment Checkout Page
app.get('/invoices/:id/pay', (req, res) => {
  const invoiceId = req.params.id;
  let invoice = invoices.get(invoiceId);

  if (!invoice) {
    // If not found in memory, create a sensible default instance
    invoice = {
      id: invoiceId,
      customerName: 'Valued Client',
      phone: '+91 97914 71277',
      email: 'client@example.com',
      city: 'India',
      description: 'DhiGrowth IT Services & WhatsApp CRM Automation',
      amount: 2499,
      status: 'due',
      paymentLink: `${req.protocol}://${req.get('host')}/invoices/${invoiceId}/pay`,
    };
    invoices.set(invoiceId, invoice);
  }

  const html = renderCheckoutHtml(invoice);
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

// 7.4 Mark Invoice as Paid & Dispatch Paid Receipt PDF to WhatsApp
app.post('/api/invoices/:id/pay', async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const { paymentMethod = 'UPI / Online Checkout', transactionId } = req.body;

    // Ensure invoice exists
    if (!invoices.has(invoiceId)) {
      invoices.set(invoiceId, {
        id: invoiceId,
        customerName: 'Valued Client',
        phone: '919791471277',
        email: 'client@example.com',
        city: 'India',
        description: 'DhiGrowth IT Services',
        amount: 2499,
        status: 'due',
        paymentLink: `${req.protocol}://${req.get('host')}/invoices/${invoiceId}/pay`,
      });
    }

    const result = await markInvoicePaid(invoiceId, {
      paymentMethod,
      transactionId,
    });

    res.json({
      success: true,
      invoice: result.invoice,
      metaResult: result.metaResult,
      alreadyPaid: result.alreadyPaid || false,
    });
  } catch (err) {
    console.error('[Mark Paid Route Error]:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/invoices/:id/mark-paid', async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const {
      paymentMethod = 'Manual CRM Confirmation',
      transactionId,
      customerName,
      phone,
      email,
      city,
      description,
      amount,
      conversationId,
    } = req.body || {};

    const baseUrl = (process.env.RENDER_EXTERNAL_URL || process.env.VITE_BACKEND_URL || `${req.protocol}://${req.get('host')}`).replace(/\/+$/, '');

    const result = await markInvoicePaid(invoiceId, {
      paymentMethod,
      transactionId,
      customerName,
      phone,
      email,
      city,
      description,
      amount,
      conversationId,
      baseUrl,
    });

    res.json({
      success: true,
      invoice: result.invoice,
      metaResult: result.metaResult,
      alreadyPaid: result.alreadyPaid || false,
    });
  } catch (err) {
    console.error('[Manual Mark Paid Route Error]:', err);
    res.status(500).json({ error: err.message });
  }
});

// 7.5 Get Invoice details JSON
app.get('/api/invoices/:id', (req, res) => {
  const invoice = invoices.get(req.params.id);
  if (!invoice) {
    return res.status(404).json({ error: 'Invoice not found' });
  }
  res.json({ invoice });
});// 8. Meta Configuration APIs - Multi-Tenant & Per-User Isolated
app.get('/api/meta-config', (req, res) => {
  const { workspaceId, userId, username, slug } = req.query || {};
  const config = getTenantMetaConfig({ workspaceId, userId, username, slug });
  res.json(config);
});

app.post('/api/meta-config', async (req, res) => {
  try {
    const {
      phoneNumberId,
      accessToken,
      wabaId,
      verifyToken,
      workspaceId,
      userId,
      username,
      slug,
      updatedBy = 'User',
    } = req.body || {};

    let supabaseClient = null;
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
    if (supabaseUrl && supabaseAnonKey) {
      const { createClient } = await import('@supabase/supabase-js');
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }

    const saved = await saveTenantMetaConfig({
      workspaceId,
      userId: userId || username || slug || updatedBy,
      username: username || updatedBy,
      slug,
      phoneNumberId,
      accessToken,
      wabaId,
      verifyToken,
      updatedBy,
      supabaseClient,
    });

    res.json({
      success: true,
      message: `Meta WhatsApp credentials updated for "${updatedBy}"!`,
      config: saved,
    });
  } catch (err) {
    console.error('[MetaConfig Save Error]:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/meta-config/test', async (req, res) => {
  try {
    let {
      phoneNumberId,
      accessToken,
      workspaceId,
      userId,
      username,
      slug,
    } = req.body || {};

    if (!phoneNumberId || !accessToken) {
      const userConfig = getTenantMetaConfig({ workspaceId, userId, username, slug });
      phoneNumberId = phoneNumberId || userConfig.phoneNumberId;
      accessToken = accessToken || userConfig.accessToken;
    }

    phoneNumberId = phoneNumberId || process.env.META_WHATSAPP_PHONE_NUMBER_ID;
    accessToken = accessToken || process.env.META_WHATSAPP_ACCESS_TOKEN;

    if (!phoneNumberId || !accessToken) {
      return res.status(400).json({
        success: false,
        error: 'Phone Number ID and Meta Access Token are required to test connection.',
      });
    }

    const testUrl = `https://graph.facebook.com/v20.0/${phoneNumberId}?access_token=${accessToken}`;
    const metaRes = await fetch(testUrl);
    const metaData = await metaRes.json();

    if (!metaRes.ok) {
      return res.status(400).json({
        success: false,
        error: metaData.error?.message || 'Meta API returned an error',
        details: metaData,
      });
    }

    res.json({
      success: true,
      data: metaData,
      message: `Connected successfully to Meta WhatsApp! Verified Name/Number: ${metaData.verified_name || metaData.display_phone_number || metaData.id}`,
    });
  } catch (err) {
    console.error('[MetaConfig Test Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 9. AI API Engine Configuration Endpoints (User-Side)
app.get('/api/ai-config', (req, res) => {
  try {
    const config = getActiveAiConfig();
    res.json({
      success: true,
      config,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/ai-config', (req, res) => {
  try {
    const { provider, apiKey, model, systemPrompt, updatedBy = 'user' } = req.body || {};
    const saved = saveActiveAiConfig({ provider, apiKey, model, systemPrompt, updatedBy });
    res.json({
      success: true,
      message: `AI Engine updated successfully to ${saved.provider.toUpperCase()} (${saved.model})!`,
      config: {
        provider: saved.provider,
        model: saved.model,
        hasKey: Boolean(saved.apiKey),
        maskedKey: saved.apiKey ? `${saved.apiKey.slice(0, 7)}...${saved.apiKey.slice(-4)}` : '',
        systemPrompt: saved.systemPrompt,
        updatedAt: saved.updatedAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/ai-config/test', async (req, res) => {
  try {
    const { provider, apiKey, model, testPrompt } = req.body || {};
    const result = await testAiConnection({ provider, apiKey, model, testPrompt });
    res.json({
      success: true,
      data: result,
      message: `Connected successfully to ${result.provider.toUpperCase()} (${result.model}) in ${result.latencyMs}ms!`,
    });
  } catch (err) {
    console.error('[AI Test Error]:', err.message);
    res.status(400).json({ success: false, error: err.message });
  }
});

// 9.1 Generate Dynamic AI Response On-Demand
const handleAiGenerate = async (req, res) => {
  try {
    const { customerMessage, customerName = 'Valued Client', channelType = 'whatsapp' } = req.body || {};
    if (!customerMessage) {
      return res.status(400).json({ success: false, error: 'customerMessage is required' });
    }
    const result = await generateAIResponse({
      customerName,
      customerMessage,
      channelType,
    });
    const replyText = typeof result === 'object' && result.reply ? result.reply : String(result);
    const imageUrl = typeof result === 'object' && result.imageUrl ? result.imageUrl : null;
    res.json({ success: true, reply: replyText, imageUrl });
  } catch (err) {
    console.error('[AI Generate Route Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

app.post('/api/ai/generate', handleAiGenerate);
app.post('/api/ai-config/generate', handleAiGenerate);

// 10. Multi-Tenant Directory Cloud Persistence Endpoints
const TENANTS_FILE = path.resolve(__dirname, 'tenants.json');

function loadTenants() {
  try {
    if (fs.existsSync(TENANTS_FILE)) {
      const raw = fs.readFileSync(TENANTS_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.warn('[Tenants] Error reading tenants.json:', err.message);
  }
  return [
    {
      id: 'b0000000-0000-0000-0000-000000000001',
      workspaceId: 'b0000000-0000-0000-0000-000000000001',
      name: 'Sri',
      username: 'sri',
      email: 'sri@dhigrowth.com',
      companyName: 'Dhigrowth CRM',
      slug: 'sri',
      role: 'Dhigrowth CRM User',
      plan: 'Enterprise Scale',
      isAdmin: false,
      isExternalClient: false,
      password: 'dhigrowth2026',
      permissions: { sendDueToAll: true, teamInbox: true, metaKeys: true, aiStudio: true, fileManager: true, invoicing: true },
      status: 'active',
      createdAt: '2026-09-10T00:00:00.000Z',
    },
  ];
}

function saveTenants(tenantsList) {
  try {
    fs.writeFileSync(TENANTS_FILE, JSON.stringify(tenantsList, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[Tenants] Error saving tenants.json:', err.message);
    return false;
  }
}

app.get('/api/tenants', (req, res) => {
  try {
    const list = loadTenants();
    res.json({ success: true, tenants: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/tenants', (req, res) => {
  try {
    const newTenant = req.body;
    if (!newTenant || !newTenant.username) {
      return res.status(400).json({ success: false, error: 'Tenant username is required' });
    }
    const list = loadTenants();
    const existingIndex = list.findIndex(
      (t) => t.id === newTenant.id || t.username?.toLowerCase() === newTenant.username?.toLowerCase()
    );
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...newTenant };
    } else {
      list.push(newTenant);
    }
    saveTenants(list);
    res.json({ success: true, message: `Tenant "${newTenant.name}" saved!`, tenant: newTenant });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/tenants/:id', (req, res) => {
  try {
    const { id } = req.params;
    let list = loadTenants();
    list = list.filter((t) => t.id !== id && t.workspaceId !== id && t.username !== id);
    saveTenants(list);
    res.json({ success: true, message: 'Tenant removed from cloud directory' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 11. SaaS Subscription & Billing Endpoints (Stripe / Razorpay)
app.get('/api/billing/plans', (req, res) => {
  res.json({ success: true, plans: SAAS_PLANS });
});

app.get('/api/billing/subscription', (req, res) => {
  try {
    const { workspaceId } = req.query;
    const subscription = getWorkspaceSubscription(workspaceId);
    res.json({ success: true, subscription });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/billing/create-checkout', async (req, res) => {
  try {
    const {
      workspaceId,
      userId,
      customerEmail,
      planId,
      billingCycle,
      provider,
      billingDetails,
    } = req.body || {};

    const session = await createCheckoutSession({
      workspaceId,
      userId,
      customerEmail,
      planId,
      billingCycle,
      provider,
      billingDetails,
    });

    res.json({ success: true, ...session });
  } catch (err) {
    console.error('[Billing Checkout Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/billing/verify-payment', (req, res) => {
  try {
    const {
      workspaceId,
      planId,
      billingCycle,
      provider,
      paymentId,
      orderId,
      billingDetails,
      amount,
      currency,
    } = req.body || {};

    const result = activateWorkspaceSubscription({
      workspaceId,
      planId,
      billingCycle,
      provider,
      paymentId,
      orderId,
      billingDetails,
      amount,
      currency,
    });

    res.json(result);
  } catch (err) {
    console.error('[Billing Verify Error]:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/billing/cancel', (req, res) => {
  try {
    const { workspaceId } = req.body || {};
    const result = cancelSubscription(workspaceId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n================================================================`);
  console.log(`🚀 Dhigrowth CRM Meta Webhook Server running on port ${PORT}`);
  console.log(`🔗 Webhook URL: http://localhost:${PORT}/webhook`);
  console.log(`🔐 Verify Token: "${process.env.META_WHATSAPP_VERIFY_TOKEN || 'dhigrowth_webhook_secret_2026'}"`);
  console.log(`⚡ Health Check: http://localhost:${PORT}/health`);
  console.log(`================================================================\n`);
});
