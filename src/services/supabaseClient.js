import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-key')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Default Seed Workspace ID (Sri's Workspace)
export const DEFAULT_WORKSPACE_ID = 
  import.meta.env.VITE_DEFAULT_WORKSPACE_ID || 'b0000000-0000-0000-0000-000000000001';


/**
 * Data service methods partitioned strictly by workspace_id
 */

// 1. Fetch Contacts
export const getContacts = async (workspaceId = DEFAULT_WORKSPACE_ID) => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching contacts:', error);
    return null;
  }
  return data;
};

// 1b. Create New Contact in Database
export const createContact = async ({
  workspaceId = DEFAULT_WORKSPACE_ID,
  fullName,
  phoneNumber,
  email = null,
  leadStage = 'Discovery',
  leadScore = 60,
  source = 'manual_crm',
  city = 'Mumbai, IN',
  dealValue = '₹2,499',
  tag = 'Interested',
}) => {
  if (!supabase) return null;

  // Insert Contact
  const { data: contact, error: contactErr } = await supabase
    .from('contacts')
    .insert([
      {
        workspace_id: workspaceId,
        full_name: fullName,
        phone_number: phoneNumber,
        email: email || null,
        lead_stage: leadStage,
        lead_score: leadScore,
        source: source,
        custom_attributes: {
          city,
          dealValue,
          tag,
        },
      },
    ])
    .select()
    .single();

  if (contactErr) {
    console.error('Error creating contact:', contactErr);
    throw contactErr;
  }

  // Create corresponding conversation thread in database
  const { data: conv, error: convErr } = await supabase
    .from('conversations')
    .insert([
      {
        workspace_id: workspaceId,
        contact_id: contact.id,
        channel_id: 'd0000000-0000-0000-0000-000000000001',
        channel_type: 'whatsapp',
        status: 'open',
        unread_count: 0,
        last_message_text: `Contact created for ${fullName}`,
        last_message_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  return { contact, conversation: conv };
};

// 1c. Delete Contact from Database
export const deleteContact = async (contactId, workspaceId = DEFAULT_WORKSPACE_ID, phoneNumber = null) => {
  if (!supabase) return false;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(contactId);

  let query = supabase.from('contacts').delete().eq('workspace_id', workspaceId);

  if (isUuid) {
    query = query.eq('id', contactId);
  } else if (phoneNumber) {
    const clean = phoneNumber.replace(/[^0-9]/g, '').slice(-10);
    query = query.ilike('phone_number', `%${clean}%`);
  } else {
    console.log('Skipping Supabase delete for non-UUID local mock id with no phone:', contactId);
    return true;
  }

  const { error } = await query;

  if (error) {
    console.error('Error deleting contact from database:', error);
    throw error;
  }
  return true;
};

// 1d. Update Contact in Database
export const updateContact = async (contactId, updates, workspaceId = DEFAULT_WORKSPACE_ID, phoneNumber = null) => {
  if (!supabase) return null;

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(contactId);

  const dbUpdates = {
    updated_at: new Date().toISOString(),
  };

  if (updates.fullName || updates.name) dbUpdates.full_name = updates.fullName || updates.name;
  if (updates.phoneNumber || updates.phone) dbUpdates.phone_number = updates.phoneNumber || updates.phone;
  if (updates.email !== undefined) dbUpdates.email = updates.email || null;
  if (updates.leadStage || updates.tag) dbUpdates.lead_stage = updates.leadStage || updates.tag;
  if (updates.custom_attributes) dbUpdates.custom_attributes = updates.custom_attributes;

  let query = supabase.from('contacts').update(dbUpdates).eq('workspace_id', workspaceId);

  if (isUuid) {
    query = query.eq('id', contactId);
  } else if (phoneNumber) {
    const clean = phoneNumber.replace(/[^0-9]/g, '').slice(-10);
    query = query.ilike('phone_number', `%${clean}%`);
  } else {
    console.log('Skipping Supabase update for non-UUID local mock id with no phone:', contactId);
    return null;
  }

  const { data, error } = await query.select().single();
  if (error) {
    console.error('Error updating contact in database:', error);
    throw error;
  }
  return data;
};


// 2. Fetch Connected Channels
export const getChannels = async (workspaceId = DEFAULT_WORKSPACE_ID) => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('channels')
    .select('*')
    .eq('workspace_id', workspaceId);
  if (error) {
    console.error('Error fetching channels:', error);
    return null;
  }
  return data;
};

// 3. Fetch Conversations
export const getConversations = async (workspaceId = DEFAULT_WORKSPACE_ID) => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('conversations')
    .select('id, contact_id, channel_id, channel_type, status, last_message_text, last_message_at, unread_count')
    .eq('workspace_id', workspaceId)
    .order('last_message_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
  return data || [];
};

// 4. Fetch Messages for a specific conversation
export const getMessages = async (conversationId) => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('sent_at', { ascending: true });
  if (error) {
    console.error('Error fetching messages:', error);
    return null;
  }
  return data;
};

// 4b. Fetch all Messages for the workspace
export const getWorkspaceMessages = async (workspaceId = DEFAULT_WORKSPACE_ID) => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('sent_at', { ascending: true });
  if (error) {
    console.error('Error fetching workspace messages:', error);
    return [];
  }
  return data || [];
};

// 5. Send an outbound message
export const sendChatMessage = async ({
  workspaceId = DEFAULT_WORKSPACE_ID,
  conversationId,
  channelId,
  senderType = 'agent',
  content,
  type = 'text',
}) => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        workspace_id: workspaceId,
        conversation_id: conversationId,
        channel_id: channelId,
        direction: 'outbound',
        ai_generated: senderType === 'ai',
        type,
        content,
        status: 'sent',
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error sending message:', error);
    return null;
  }

  // Update conversation last_message_at
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);

  return data;
};

// 6. Fetch Wallet Balance & Transaction History
export const getWalletData = async (workspaceId = DEFAULT_WORKSPACE_ID) => {
  if (!supabase) return null;
  const { data: wallet, error: walletErr } = await supabase
    .from('wallet_accounts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .single();

  if (walletErr) {
    console.error('Error fetching wallet:', walletErr);
    return null;
  }

  const { data: transactions, error: txErr } = await supabase
    .from('wallet_transactions')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
    .limit(20);

  return {
    wallet,
    transactions: transactions || [],
  };
};

// 7. Subscribe to real-time inbound messages (WhatsApp / Instagram / LINE)
export const subscribeToNewMessages = (workspaceId, onNewMessage) => {
  if (!supabase) return null;

  return supabase
    .channel('realtime_messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `workspace_id=eq.${workspaceId}`,
      },
      (payload) => {
        if (onNewMessage) onNewMessage(payload.new);
      }
    )
    .subscribe();
};

// 8. Templates & Auto-Replies
export const getTemplates = async (workspaceId = DEFAULT_WORKSPACE_ID) => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: true });
  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }
  return data || [];
};

export const createTemplate = async ({
  name,
  body_text,
  footer_text = '',
  category = 'utility',
  status = 'approved',
  workspaceId = DEFAULT_WORKSPACE_ID,
}) => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('templates')
    .insert([
      {
        workspace_id: workspaceId,
        name,
        category,
        language: 'en_US',
        status,
        body_text,
        footer_text,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating template:', error);
    throw error;
  }
  return data;
};

export const updateTemplate = async (templateId, updates) => {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('templates')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', templateId)
    .select()
    .single();

  if (error) {
    console.error('Error updating template:', error);
    throw error;
  }
  return data;
};

export const deleteTemplate = async (templateId) => {
  if (!supabase) return false;
  const { error } = await supabase
    .from('templates')
    .delete()
    .eq('id', templateId);

  if (error) {
    console.error('Error deleting template:', error);
    throw error;
  }
  return true;
};

