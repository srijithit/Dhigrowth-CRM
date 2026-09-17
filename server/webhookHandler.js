import { createClient } from '@supabase/supabase-js';
import { sendWhatsAppMessage, sendInstagramMessage, sendMessengerMessage } from './metaService.js';
import { generateAIResponse } from './aiService.js';
import { getTenantByPhoneNumberId } from './tenantMetaManager.js';
import { isManualMode } from './manualAgentStore.js';

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const getSupabase = () => {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://ttjtlqsfwaksyqrrutvv.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0anRscXNmd2Frc3lxcnJ1dHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkxMDM1ODIsImV4cCI6MjEwNDY3OTU4Mn0.FtIIhGCFzaQ5zjkjmHj1qABZ-kucDiArWHAgrg1i01Y';
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
};

const DEFAULT_WORKSPACE_ID = process.env.VITE_DEFAULT_WORKSPACE_ID || 'b0000000-0000-0000-0000-000000000001';

export const handleMetaVerification = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log(`[Webhook Verification] Path: ${req.path} | Mode: ${mode} | Token: "${token}"`);

  if (mode === 'subscribe' && challenge) {
    console.log('✅ [Webhook Verification] Meta Webhook verified successfully! Challenge returned.');
    return res.status(200).send(challenge);
  }

  if (!mode && !token) {
    return res.status(200).send('Dhigrowth CRM Webhook Gateway Online');
  }

  return res.status(403).send('Verification failed');
};

/**
 * Handle Inbound Webhooks from WhatsApp, Instagram, and Messenger (POST /webhook)
 */
export const handleInboundWebhook = async (req, res) => {
  const body = req.body;

  // Immediately acknowledge receipt with 200 OK as required by Meta within 20s
  res.status(200).send('EVENT_RECEIVED');

  if (!body || !body.object) {
    return;
  }

  try {
    // 1. WhatsApp Cloud API Message Processing
    if (body.object === 'whatsapp_business_account') {
      const entries = Array.isArray(body.entry) ? body.entry : [body.entry].filter(Boolean);

      for (const entry of entries) {
        const changes = Array.isArray(entry.changes) ? entry.changes : [entry.changes].filter(Boolean);

        for (const changeItem of changes) {
          const change = changeItem?.value;
          if (!change) continue;

          // Status updates (sent/delivered/read receipts)
          if (change.statuses && (!change.messages || change.messages.length === 0)) {
            await handleMessageStatusUpdates(change.statuses);
            continue;
          }

          const phoneNumberId =
            change.metadata?.phone_number_id ||
            process.env.META_WHATSAPP_PHONE_NUMBER_ID ||
            '1349867994870208';
          const matchedTenant = getTenantByPhoneNumberId(phoneNumberId);
          const tenantWorkspaceId = matchedTenant?.workspaceId || DEFAULT_WORKSPACE_ID;
          const tenantAccessToken =
            matchedTenant?.accessToken || process.env.META_WHATSAPP_ACCESS_TOKEN;

          const messages = Array.isArray(change.messages) ? change.messages : [];

          for (const message of messages) {
            const contactInfo =
              (change.contacts || []).find((c) => c.wa_id === message.from) || change.contacts?.[0];
            const senderPhone = message.from; // e.g. "919791471277"
            const customerName = contactInfo?.profile?.name || `Customer (+${senderPhone})`;
            const messageText =
              message.text?.body || (message.type !== 'text' ? `[${message.type} attachment]` : '');

            console.log(
              `\n📥 [Inbound WhatsApp] From: ${customerName} (+${senderPhone}) | Phone ID: ${phoneNumberId} | Workspace: ${tenantWorkspaceId}`
            );
            console.log(`💬 Message: "${messageText}"`);

            // Process message in Supabase & reply
            await processIncomingChatMessage({
              channelType: 'whatsapp',
              senderIdentifier: `+${senderPhone}`,
              customerName,
              messageText,
              externalMessageId: message.id,
              channelId: 'd0000000-0000-0000-0000-000000000001',
              workspaceId: tenantWorkspaceId,
              sendReply: async (replyText, imageUrl) => {
                return sendWhatsAppMessage({
                  phoneNumberId,
                  accessToken: tenantAccessToken,
                  recipientPhone: senderPhone,
                  text: replyText,
                  imageUrl,
                });
              },
            });
          }
        }
      }
    }

    // 2. Instagram Direct Messages
    else if (body.object === 'instagram') {
      const entry = body.entry?.[0];
      const messaging = entry?.messaging?.[0];

      if (messaging && messaging.message) {
        const senderId = messaging.sender.id;
        const messageText = messaging.message.text || '[Media Attachment]';

        console.log(`\n📥 [Inbound Instagram] From: IG_User_${senderId}`);
        console.log(`💬 Message: "${messageText}"`);

        await processIncomingChatMessage({
          channelType: 'instagram',
          senderIdentifier: `@ig_${senderId}`,
          customerName: `Instagram User`,
          messageText,
          externalMessageId: messaging.message.mid,
          channelId: 'd0000000-0000-0000-0000-000000000002',
          sendReply: async (replyText) => {
            return sendInstagramMessage({
              recipientId: senderId,
              text: replyText,
            });
          },
        });
      }
    }

    // 3. Facebook Messenger
    else if (body.object === 'page') {
      const entry = body.entry?.[0];
      const messaging = entry?.messaging?.[0];

      if (messaging && messaging.message) {
        const senderId = messaging.sender.id;
        const messageText = messaging.message.text || '[Media Attachment]';

        console.log(`\n📥 [Inbound Messenger] From: Messenger_User_${senderId}`);
        console.log(`💬 Message: "${messageText}"`);

        await processIncomingChatMessage({
          channelType: 'messenger',
          senderIdentifier: `fb_${senderId}`,
          customerName: `Facebook User`,
          messageText,
          externalMessageId: messaging.message.mid,
          channelId: 'd0000000-0000-0000-0000-000000000003',
          sendReply: async (replyText) => {
            return sendMessengerMessage({
              recipientId: senderId,
              text: replyText,
            });
          },
        });
      }
    }
  } catch (err) {
    console.error('Error handling webhook event:', err);
  }
};

/**
 * Shared Core: Store Contact -> Conversation -> Inbound Message -> Trigger AI -> Store Outbound Reply
 */
async function processIncomingChatMessage({
  channelType,
  senderIdentifier,
  customerName,
  messageText,
  externalMessageId,
  channelId,
  workspaceId = DEFAULT_WORKSPACE_ID,
  sendReply,
}) {
  const effectiveWorkspaceId = workspaceId || DEFAULT_WORKSPACE_ID;
  const supabase = getSupabase();
  if (!supabase) {
    console.warn('[WebhookHandler] Supabase not connected. Skipping database write.');
    return;
  }

  try {
    // 1. Find or create Contact
    let contactId;
    const cleanDigits = senderIdentifier.replace(/[^0-9]/g, '').slice(-10);
    const { data: contactsList } = await supabase
      .from('contacts')
      .select('id, full_name, phone_number')
      .eq('workspace_id', effectiveWorkspaceId)
      .ilike('phone_number', `%${cleanDigits}%`)
      .limit(1);

    const existingContact = contactsList?.[0] || null;

    if (existingContact) {
      contactId = existingContact.id;
    } else {
      const { data: newContact, error: cErr } = await supabase
        .from('contacts')
        .insert([
          {
            workspace_id: effectiveWorkspaceId,
            phone_number: senderIdentifier,
            full_name: customerName,
            lead_stage: 'Discovery',
            lead_score: 50,
            source: `${channelType}_webhook`,
          },
        ])
        .select()
        .single();

      if (cErr) {
        console.error('Error creating contact:', cErr);
        return;
      }
      contactId = newContact.id;
      console.log(`👤 Created new lead: ${customerName} (${contactId}) in workspace ${effectiveWorkspaceId}`);
    }

    // 2. Find or create Conversation
    let conversationId;
    const { data: convsList } = await supabase
      .from('conversations')
      .select('id, status')
      .eq('workspace_id', effectiveWorkspaceId)
      .eq('contact_id', contactId)
      .eq('channel_type', channelType)
      .limit(1);

    const existingConv = convsList?.[0] || null;

    if (existingConv) {
      conversationId = existingConv.id;
    } else {
      const { data: newConv, error: cvErr } = await supabase
        .from('conversations')
        .insert([
          {
            workspace_id: effectiveWorkspaceId,
            contact_id: contactId,
            channel_id: channelId,
            channel_type: channelType,
            status: 'bot_active',
            unread_count: 1,
            last_message_text: messageText,
            last_message_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (cvErr) {
        console.error('Error creating conversation:', cvErr);
        return;
      }
      conversationId = newConv.id;
    }

    // 3. Record Inbound Message in Supabase
    const { error: msgErr } = await supabase.from('messages').insert([
      {
        workspace_id: effectiveWorkspaceId,
        conversation_id: conversationId,
        channel_id: channelId,
        direction: 'inbound',
        ai_generated: false,
        type: 'text',
        content: messageText,
        status: 'read',
        external_message_id: externalMessageId,
      },
    ]);

    if (msgErr) {
      console.error('Error inserting inbound message:', msgErr);
    } else {
      console.log('✅ Inbound message recorded in Supabase.');
    }

    // Update conversation last_message_text and last_message_at
    await supabase
      .from('conversations')
      .update({
        last_message_text: messageText,
        last_message_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    // 3.5 Fetch recent conversation history for rich multi-turn context
    let conversationHistory = [];
    try {
      const { data: pastMsgs } = await supabase
        .from('messages')
        .select('direction, content, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(8);

      if (pastMsgs && pastMsgs.length > 0) {
        conversationHistory = pastMsgs
          .reverse()
          .map((m) => ({
            role: m.direction === 'inbound' ? 'user' : 'assistant',
            content: m.content,
          }));
      }
    } catch (histErr) {
      console.warn('[WebhookHandler] Could not load message history:', histErr.message);
    }

    // 3.9 Check if conversation or contact phone is in Human / Manual Agent mode
    const isManualByStore = isManualMode({ phone: senderIdentifier, conversationId });
    const isManualByConvStatus = existingConv && (existingConv.status === 'human_agent' || existingConv.status === 'manual' || existingConv.status === 'agent');

    if (isManualByStore || isManualByConvStatus) {
      console.log(`👤 [WebhookHandler] Conversation ${conversationId} / Contact ${senderIdentifier} is assigned to Manual Agent (store=${isManualByStore}, status=${existingConv?.status}). AI auto-reply is COMPLETELY DISABLED.`);
      return;
    }

    // 4. Generate AI Concierge Response
    console.log('🤖 Dhigrowth AI Concierge is generating response with history context...');
    const aiResult = await generateAIResponse({
      customerName,
      customerMessage: messageText,
      channelType,
      conversationHistory,
    });

    const aiResponseText = typeof aiResult === 'object' && aiResult.reply ? aiResult.reply : String(aiResult);
    const aiImageUrl = typeof aiResult === 'object' && aiResult.imageUrl ? aiResult.imageUrl : null;

    console.log(`💬 AI Reply: "${aiResponseText.slice(0, 80)}..." ${aiImageUrl ? `(Image: ${aiImageUrl})` : ''}`);

    // 5. Dispatch reply via Meta Graph API
    if (sendReply) {
      try {
        await sendReply(aiResponseText, aiImageUrl);
        console.log(`📤 Outbound reply dispatched via Meta ${channelType.toUpperCase()} API.`);
      } catch (err) {
        console.warn(`[WebhookHandler] Could not dispatch live outbound reply:`, err.message);
      }
    }

    // 6. Record AI Outbound Message in Supabase
    await supabase.from('messages').insert([
      {
        workspace_id: effectiveWorkspaceId,
        conversation_id: conversationId,
        channel_id: channelId,
        direction: 'outbound',
        ai_generated: true,
        type: aiImageUrl ? 'image' : 'text',
        content: aiResponseText,
        media_url: aiImageUrl || null,
        status: 'delivered',
      },
    ]);

    // 7. Update Conversation last_message
    await supabase
      .from('conversations')
      .update({
        last_message_text: aiResponseText,
        last_message_at: new Date().toISOString(),
        unread_count: 0,
      })
      .eq('id', conversationId);

    console.log('✨ Live Dashboard updated via Supabase Realtime!\n');
  } catch (error) {
    console.error('Error in processIncomingChatMessage:', error);
  }
}

/**
 * Handle delivery & read receipts from Meta
 */
async function handleMessageStatusUpdates(statuses) {
  const supabase = getSupabase();
  if (!supabase || !statuses) return;
  for (const st of statuses) {
    const status = st.status; // 'delivered', 'read', 'failed'
    const externalId = st.id;
    if (externalId && status) {
      await supabase
        .from('messages')
        .update({ status })
        .eq('external_message_id', externalId);
    }
  }
}
