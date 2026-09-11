/**
 * Meta Graph API Service for WhatsApp Cloud API, Instagram DM & Messenger
 */

const META_GRAPH_VERSION = 'v20.0';
const GRAPH_BASE_URL = `https://graph.facebook.com/${META_GRAPH_VERSION}`;

/**
 * Send an outbound WhatsApp text message via Meta WhatsApp Cloud API
 */
export const sendWhatsAppMessage = async ({
  phoneNumberId,
  accessToken,
  recipientPhone,
  text,
}) => {
  const token = accessToken || process.env.META_WHATSAPP_ACCESS_TOKEN;
  const phoneId = phoneNumberId || process.env.META_WHATSAPP_PHONE_NUMBER_ID;

  if (!token || !phoneId) {
    console.warn('[MetaService] WhatsApp API credentials missing. Running in simulation mode.');
    return {
      simulated: true,
      recipient: recipientPhone,
      text,
      timestamp: new Date().toISOString(),
    };
  }

  // Sanitize phone number (strip + and spaces)
  const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');

  const response = await fetch(`${GRAPH_BASE_URL}/${phoneId}/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'text',
      text: {
        preview_url: false,
        body: text,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('[MetaService] WhatsApp send error:', data);
    throw new Error(data.error?.message || 'Failed to send WhatsApp message');
  }

  return data;
};

/**
 * Send an outbound Instagram Direct Message
 */
export const sendInstagramMessage = async ({
  accessToken,
  recipientId,
  text,
}) => {
  const token = accessToken || process.env.META_INSTAGRAM_ACCESS_TOKEN || process.env.META_WHATSAPP_ACCESS_TOKEN;

  if (!token) {
    console.warn('[MetaService] Instagram API credentials missing. Running in simulation mode.');
    return { simulated: true, recipient: recipientId, text };
  }

  const response = await fetch(`${GRAPH_BASE_URL}/me/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('[MetaService] Instagram send error:', data);
    throw new Error(data.error?.message || 'Failed to send Instagram message');
  }

  return data;
};

/**
 * Send an outbound Facebook Messenger message
 */
export const sendMessengerMessage = async ({
  accessToken,
  recipientId,
  text,
}) => {
  const token = accessToken || process.env.META_MESSENGER_ACCESS_TOKEN || process.env.META_WHATSAPP_ACCESS_TOKEN;

  if (!token) {
    console.warn('[MetaService] Messenger API credentials missing. Running in simulation mode.');
    return { simulated: true, recipient: recipientId, text };
  }

  const response = await fetch(`${GRAPH_BASE_URL}/me/messages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error('[MetaService] Messenger send error:', data);
    throw new Error(data.error?.message || 'Failed to send Messenger message');
  }

  return data;
};
