import { createClient } from '@supabase/supabase-js';

const getSupabase = () => {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

const DEFAULT_WORKSPACE_ID = process.env.VITE_DEFAULT_WORKSPACE_ID || 'b0000000-0000-0000-0000-000000000001';

const DHIGROWTH_WELCOME = `Hello! 👋 Welcome to **DhiGrowth IT Services**.

How can our AI Business Concierge help you today? 🤖

We help businesses with:
📱 **App Development**
🤖 **AI Business Solutions & Development**
💬 **WhatsApp CRM & Automation**
💻 **Custom IT Solutions**

Tell us what your business needs, and let’s build something powerful together! 🚀`;

export const generateAIResponse = async ({
  customerName,
  customerMessage,
  channelType = 'whatsapp',
  conversationHistory = [],
}) => {
  const query = customerMessage.trim().toLowerCase();

  // 1. Check custom configured templates from Supabase
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data: dbTemplates } = await supabase
        .from('templates')
        .select('*')
        .eq('workspace_id', DEFAULT_WORKSPACE_ID)
        .eq('status', 'approved');

      if (dbTemplates && dbTemplates.length > 0) {
        for (const tmpl of dbTemplates) {
          const triggers = (tmpl.footer_text || '')
            .split(',')
            .map((t) => t.trim().toLowerCase())
            .filter(Boolean);

          const isMatch = triggers.some((tr) => {
            if (query === tr) return true;
            if (query.startsWith(`${tr} `)) return true;
            if (query.endsWith(` ${tr}`)) return true;
            if (query.includes(` ${tr} `)) return true;
            return false;
          });

          if (isMatch) {
            console.log(`🎯 Matched Custom Template: "${tmpl.name}" for trigger in query: "${query}"`);
            return tmpl.body_text;
          }
        }
      }
    }
  } catch (err) {
    console.warn('[AIService] Note checking DB templates:', err.message);
  }

  // 2. Initial Greeting Detection Fallback
  if (
    query === 'hi' ||
    query === 'hello' ||
    query === 'hey' ||
    query === 'start' ||
    query === 'menu' ||
    query === 'help' ||
    query.startsWith('hi ') ||
    query.startsWith('hello ') ||
    query.startsWith('hey ')
  ) {
    return DHIGROWTH_WELCOME;
  }

  // 2. Check if Gemini API key exists
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `You are DhiGrowth AI Business Concierge, an expert IT consultant and sales agent for DhiGrowth IT Services on ${channelType}.
Customer Name: ${customerName || 'Valued Client'}
Customer Message: "${customerMessage}"

About DhiGrowth IT Services:
We provide:
📱 App Development (iOS, Android, Cross-platform, React Native, Flutter)
🤖 AI Business Solutions & Development (Custom AI agents, LLM integrations, automated workflows)
💬 WhatsApp CRM & Automation (Omnichannel messaging, Meta Cloud API, lead capture, 24/7 auto-pilot)
💻 Custom IT Solutions (Web development, cloud infrastructure, API integrations, enterprise software)

Guidelines:
1. Speak concisely, professionally, and warmly.
2. If customer asks about any of our services, give a tailored, punchy 2-3 sentence overview highlighting business benefits.
3. Invite them to share their project vision or book a quick strategy consultation.
4. Keep the response clean and formatted with emojis for WhatsApp.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (generatedText) {
        return generatedText.trim();
      }
    } catch (err) {
      console.warn('[AIService] Gemini API error, falling back to smart rules:', err);
    }
  }

  // 3. Smart Business Rules Engine Fallback
  if (query.includes('app') || query.includes('mobile') || query.includes('android') || query.includes('ios')) {
    return `📱 **DhiGrowth App Development**\n\nWe build sleek, scalable iOS & Android mobile apps tailored to your business operations and customer experience.\n\nWhat kind of app are you planning to build? Tell us your idea and let's bring it to life! 🚀`;
  }

  if (query.includes('ai') || query.includes('bot') || query.includes('automation') || query.includes('agent')) {
    return `🤖 **AI Business Solutions & Development**\n\nFrom autonomous AI customer concierges to workflow automations and custom LLM integrations, we help you reduce costs and run operations 24/7.\n\nWould you like a demo of how AI can automate your business tasks? ✨`;
  }

  if (query.includes('whatsapp') || query.includes('crm') || query.includes('marketing') || query.includes('broadcast')) {
    return `💬 **WhatsApp CRM & Automation**\n\nSupercharge your sales with official Meta WhatsApp Cloud API integration, broadcast campaigns, team inboxes, and AI auto-pilot replies.\n\nReady to convert leads faster on WhatsApp? Let's connect! 📈`;
  }

  if (query.includes('website') || query.includes('web') || query.includes('software') || query.includes('it solution')) {
    return `💻 **Custom IT & Software Solutions**\n\nWe engineer modern web applications, cloud backends, and robust enterprise software built for speed and security.\n\nShare your project requirements, and we'll prepare a custom roadmap for you! 🛠️`;
  }

  if (query.includes('price') || query.includes('cost') || query.includes('quote') || query.includes('rate')) {
    return `💼 Our project pricing is customized based on your business scope and requirements.\n\nFeel free to share brief details of your project, and our team will provide a tailored quote and roadmap! 🤝`;
  }

  // Default friendly concierge reply
  return `Thank you for reaching out, ${customerName || 'friend'}! 🙏\n\nOur **DhiGrowth IT Services** team has received your message: "${customerMessage}". An expert consultant will assist you shortly, or feel free to tell us more about your business needs! 🚀`;
};
