import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_STORE_FILE = path.resolve(__dirname, 'templatesStore.json');
const META_GRAPH_VERSION = 'v20.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${META_GRAPH_VERSION}`;

export const STARTER_TEMPLATES = [
  {
    id: 'tpl_hello_world',
    name: 'hello_world',
    category: 'UTILITY',
    language: 'en_US',
    status: 'APPROVED',
    header_type: 'TEXT',
    header_content: 'DhiGrowth IT Services',
    body_text: 'Welcome and congratulations!! This message demonstrates your ability to send a WhatsApp message notification from the Cloud API, hosted by Meta. Thank you for taking the time to test with us.',
    footer_text: 'Tap an option to respond:',
    buttons: [],
    variables: [],
    syncedWithMeta: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl_hi',
    name: 'hi',
    category: 'MARKETING',
    language: 'en',
    status: 'APPROVED',
    header_type: 'TEXT',
    header_content: 'DhiGrowth IT Services',
    body_text: `Hello sri! 👋 Welcome to DhiGrowth IT Services.\n \nAre you looking to scale your business with custom App Development, AI Auto-Pilot Bots, or WhatsApp CRM Automation?\n \nTap below to connect with our team! 🚀\nTap an option to respond:`,
    footer_text: 'Tap an option to respond:',
    buttons: [
      { type: 'QUICK_REPLY', text: "Yes, I'm interested" },
      { type: 'QUICK_REPLY', text: 'Tell me more' }
    ],
    variables: [],
    syncedWithMeta: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl_welcome_greeting',
    name: 'welcome_greeting_v2',
    category: 'UTILITY',
    language: 'en_US',
    status: 'APPROVED',
    header_type: 'IMAGE',
    header_content: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&auto=format&fit=crop&q=80',
    body_text: 'Hello {{1}}! 👋 Welcome to DhiGrowth AI Suite. Your dedicated workspace concierge is ready to assist your team with omnichannel CRM, WhatsApp automation, and custom AI agents. Reply MENU at any time to explore services.',
    footer_text: 'DhiGrowth Business Partner • Official Meta Tech Provider',
    buttons: [
      { type: 'QUICK_REPLY', text: 'Book Demo' },
      { type: 'QUICK_REPLY', text: 'View Pricing' },
    ],
    variables: ['name'],
    syncedWithMeta: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl_summer_offer',
    name: 'flash_sale_promo_2026',
    category: 'MARKETING',
    language: 'en_US',
    status: 'APPROVED',
    header_type: 'IMAGE',
    header_content: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=80',
    body_text: 'Hi {{1}}! 🎉 Exclusive offer for {{2}} members: Get an instant {{3}} discount on our scaling plans this week only! Upgrade now to unlock unlimited WhatsApp Cloud API automation and priority AI support.',
    footer_text: 'Reply STOP to opt out of promotional messages',
    buttons: [
      { type: 'URL', text: 'Claim Offer', url: 'https://dhigrowth.com/pricing' },
      { type: 'QUICK_REPLY', text: 'Talk to Sales' },
    ],
    variables: ['name', 'membership_tier', 'discount_percent'],
    syncedWithMeta: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl_order_dispatch',
    name: 'order_status_update_v1',
    category: 'UTILITY',
    language: 'en_US',
    status: 'APPROVED',
    header_type: 'TEXT',
    header_content: 'Order Shipped 📦',
    body_text: 'Great news {{1}}! Your order #{{2}} has been packed and handed over to our delivery partner. Estimated delivery is {{3}}. Track your real-time status using the link below.',
    footer_text: 'Need help? Reply HELP to chat with an agent',
    buttons: [
      { type: 'URL', text: 'Track Order', url: 'https://dhigrowth.com/track/{{1}}' },
    ],
    variables: ['customer_name', 'order_id', 'delivery_date'],
    syncedWithMeta: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'tpl_event_reminder',
    name: 'vip_webinar_reminder_2026',
    category: 'MARKETING',
    language: 'en_US',
    status: 'APPROVED',
    header_type: 'IMAGE',
    header_content: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    body_text: 'Hey {{1}}, your live masterclass on {{2}} starts in {{3}} minutes! 🚀 Join top founders discovering how to automate customer support and 10x WhatsApp sales conversion.',
    footer_text: 'Hosted on Zoom • Live Q&A included',
    buttons: [
      { type: 'URL', text: 'Join Live Room', url: 'https://dhigrowth.com/live-room' },
      { type: 'QUICK_REPLY', text: 'Reschedule' },
    ],
    variables: ['first_name', 'topic', 'starts_in'],
    syncedWithMeta: true,
    updatedAt: new Date().toISOString(),
  },
];

let templatesStore = {
  workspaces: {},
};

export function initTemplateStore() {
  try {
    if (fs.existsSync(TEMPLATES_STORE_FILE)) {
      const data = JSON.parse(fs.readFileSync(TEMPLATES_STORE_FILE, 'utf-8'));
      templatesStore = { workspaces: data.workspaces || {} };
      console.log(`📋 [TemplateService] Loaded templates for ${Object.keys(templatesStore.workspaces).length} workspaces`);
      return;
    }

    // Initialize default workspace with starter templates
    templatesStore.workspaces['b0000000-0000-0000-0000-000000000001'] = [...STARTER_TEMPLATES];
    saveTemplatesToDisk();
    console.log('📋 [TemplateService] Seeded default Meta templates store');
  } catch (err) {
    console.warn('[TemplateService] Init error:', err.message);
  }
}

function saveTemplatesToDisk() {
  try {
    fs.writeFileSync(TEMPLATES_STORE_FILE, JSON.stringify(templatesStore, null, 2), 'utf-8');
  } catch (err) {
    console.error('[TemplateService] Save error:', err.message);
  }
}

/**
 * Get all templates for a workspace (cached or merged with starter templates)
 */
export function getWorkspaceTemplates(workspaceId = 'b0000000-0000-0000-0000-000000000001') {
  if (!Array.isArray(templatesStore.workspaces[workspaceId])) {
    templatesStore.workspaces[workspaceId] = workspaceId === 'b0000000-0000-0000-0000-000000000001' ? [...STARTER_TEMPLATES] : [];
    saveTemplatesToDisk();
  }
  return templatesStore.workspaces[workspaceId];
}

/**
 * Sync templates from official Meta Graph API (WABA)
 */
export async function syncMetaTemplates({ workspaceId, wabaId, accessToken }) {
  const targetWabaId = wabaId || process.env.META_WHATSAPP_WABA_ID;
  const token = accessToken || process.env.META_WHATSAPP_ACCESS_TOKEN;

  const currentLocal = getWorkspaceTemplates(workspaceId);

  if (!targetWabaId || !token) {
    console.log('[TemplateService] WABA credentials missing. Using local approved templates store.');
    return {
      success: true,
      syncedCount: currentLocal.length,
      templates: currentLocal,
      isSimulation: true,
      message: 'Synced from local workspace cache (Provide Meta WABA credentials for direct Meta API live sync).',
    };
  }

  try {
    const url = `${GRAPH_BASE_URL}/${targetWabaId}/message_templates?fields=name,status,category,language,components,id&limit=100`;
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.warn('[TemplateService] Meta API returned non-200:', data);
      return {
        success: true,
        syncedCount: currentLocal.length,
        templates: currentLocal,
        isSimulation: true,
        metaError: data.error?.message,
        message: 'Could not reach Meta WABA endpoint. Preserving local approved templates.',
      };
    }

    const metaTemplates = (data.data || []).map((m) => {
      let headerType = 'NONE';
      let headerContent = null;
      let bodyText = '';
      let footerText = '';
      const buttons = [];

      (m.components || []).forEach((c) => {
        if (c.type === 'HEADER') {
          headerType = c.format || 'TEXT';
          headerContent = c.text || null;
        } else if (c.type === 'BODY') {
          bodyText = c.text || '';
        } else if (c.type === 'FOOTER') {
          footerText = c.text || '';
        } else if (c.type === 'BUTTONS') {
          (c.buttons || []).forEach((b) => {
            buttons.push({
              type: b.type,
              text: b.text,
              url: b.url,
              phone_number: b.phone_number,
            });
          });
        }
      });

      // Extract variables {{1}}, {{2}}, etc.
      const varMatches = bodyText.match(/\{\{(\d+)\}\}/g) || [];
      const variables = varMatches.map((v) => `var_${v.replace(/[{}]/g, '')}`);

      return {
        id: m.id || `meta_${m.name}`,
        name: m.name,
        category: m.category || 'UTILITY',
        language: m.language || 'en_US',
        status: m.status || 'APPROVED',
        header_type: headerType,
        header_content: headerContent,
        body_text: bodyText,
        footer_text: footerText,
        buttons,
        variables,
        syncedWithMeta: true,
        updatedAt: new Date().toISOString(),
      };
    });

    // Merge metaTemplates with existing ones, updating existing matching names
    const merged = [...metaTemplates];
    currentLocal.forEach((loc) => {
      if (!merged.some((m) => m.name === loc.name)) {
        merged.push(loc);
      }
    });

    templatesStore.workspaces[workspaceId] = merged;
    saveTemplatesToDisk();

    return {
      success: true,
      syncedCount: merged.length,
      templates: merged,
      isSimulation: false,
      message: `Successfully synced ${metaTemplates.length} official templates from Meta WABA!`,
    };
  } catch (err) {
    console.error('[TemplateService] Live sync exception:', err.message);
    return {
      success: true,
      syncedCount: currentLocal.length,
      templates: currentLocal,
      isSimulation: true,
      message: `Local cache loaded (${err.message})`,
    };
  }
}

/**
 * Create a new official Meta message template
 */
export async function createMetaTemplate({
  workspaceId = 'b0000000-0000-0000-0000-000000000001',
  wabaId,
  accessToken,
  name,
  category = 'UTILITY',
  language = 'en_US',
  headerType = 'NONE',
  headerText,
  headerImageUrl,
  bodyText,
  footerText,
  buttons = [],
}) {
  // Normalize template name (Meta requires lowercase snake_case)
  const cleanName = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, '_');

  const components = [];

  // Header component
  if (headerType === 'IMAGE') {
    components.push({
      type: 'HEADER',
      format: 'IMAGE',
      example: {
        header_handle: [headerImageUrl || 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800'],
      },
    });
  } else if (headerType === 'TEXT' && headerText) {
    components.push({
      type: 'HEADER',
      format: 'TEXT',
      text: headerText,
    });
  }

  // Body component with variable examples if needed
  const bodyComponent = {
    type: 'BODY',
    text: bodyText,
  };

  const varMatches = bodyText.match(/\{\{(\d+)\}\}/g) || [];
  if (varMatches.length > 0) {
    bodyComponent.example = {
      body_text: [varMatches.map((_, i) => `SampleValue${i + 1}`)],
    };
  }
  components.push(bodyComponent);

  // Footer component
  if (footerText && footerText.trim()) {
    components.push({
      type: 'FOOTER',
      text: footerText.trim(),
    });
  }

  // Buttons component
  if (buttons && buttons.length > 0) {
    const formattedButtons = buttons.map((b) => {
      if (b.type === 'URL') {
        return { type: 'URL', text: b.text, url: b.url };
      }
      if (b.type === 'PHONE_NUMBER') {
        return { type: 'PHONE_NUMBER', text: b.text, phone_number: b.phone_number };
      }
      return { type: 'QUICK_REPLY', text: b.text };
    });
    components.push({
      type: 'BUTTONS',
      buttons: formattedButtons,
    });
  }

  const newTemplate = {
    id: `tpl_${cleanName}_${Date.now()}`,
    name: cleanName,
    category: category.toUpperCase(),
    language,
    status: 'APPROVED', // Default to APPROVED in our suite, Meta will review asynchronously
    header_type: headerType,
    header_content: headerType === 'IMAGE' ? (headerImageUrl || '') : (headerText || null),
    body_text: bodyText,
    footer_text: footerText || '',
    buttons: buttons || [],
    variables: varMatches.map((v) => `var_${v.replace(/[{}]/g, '')}`),
    syncedWithMeta: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Attempt live registration on Meta Graph API if credentials are provided
  const targetWabaId = wabaId || process.env.META_WHATSAPP_WABA_ID;
  const token = accessToken || process.env.META_WHATSAPP_ACCESS_TOKEN;

  if (targetWabaId && token) {
    try {
      const metaPayload = {
        name: cleanName,
        category: category.toUpperCase(),
        language,
        components,
      };

      const res = await fetch(`${GRAPH_BASE_URL}/${targetWabaId}/message_templates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metaPayload),
      });

      const data = await res.json();
      if (res.ok) {
        newTemplate.id = data.id || newTemplate.id;
        newTemplate.status = data.status || 'PENDING';
        newTemplate.syncedWithMeta = true;
        console.log(`✅ [TemplateService] Registered official template "${cleanName}" with Meta! ID: ${data.id}`);
      } else {
        console.warn(`⚠️ [TemplateService] Meta template creation note: ${data.error?.message}. Stored in workspace suite.`);
      }
    } catch (err) {
      console.warn('[TemplateService] Meta registration network error:', err.message);
    }
  }

  // Save to workspace store
  if (!Array.isArray(templatesStore.workspaces[workspaceId])) {
    templatesStore.workspaces[workspaceId] = [];
  }

  templatesStore.workspaces[workspaceId].unshift(newTemplate);
  saveTemplatesToDisk();

  return newTemplate;
}

/**
 * Delete a template
 */
export async function deleteMetaTemplate({ workspaceId, name, templateId, wabaId, accessToken }) {
  if (!Array.isArray(templatesStore.workspaces[workspaceId])) {
    templatesStore.workspaces[workspaceId] = [];
  }

  const initialLen = templatesStore.workspaces[workspaceId].length;
  templatesStore.workspaces[workspaceId] = templatesStore.workspaces[workspaceId].filter(
    (t) => t.id !== templateId && t.name !== name
  );
  saveTemplatesToDisk();

  // Try deleting on Meta Graph API
  const targetWabaId = wabaId || process.env.META_WHATSAPP_WABA_ID;
  const token = accessToken || process.env.META_WHATSAPP_ACCESS_TOKEN;

  if (targetWabaId && token && name) {
    try {
      await fetch(`${GRAPH_BASE_URL}/${targetWabaId}/message_templates?name=${encodeURIComponent(name)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
    } catch (err) {
      console.warn('[TemplateService] Meta delete note:', err.message);
    }
  }

  return { success: true, removedCount: initialLen - templatesStore.workspaces[workspaceId].length };
}
