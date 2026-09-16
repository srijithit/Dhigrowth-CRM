import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AI_CONFIG_FILE = path.resolve(__dirname, 'aiConfig.json');

const getSupabase = () => {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
};

const DEFAULT_WORKSPACE_ID = process.env.VITE_DEFAULT_WORKSPACE_ID || 'b0000000-0000-0000-0000-000000000001';

export const DEFAULT_SYSTEM_PROMPT = `You are DhiGrowth AI Business Concierge, an expert IT consultant and sales concierge for DhiGrowth IT Services on WhatsApp.

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
4. Keep the response clean and nicely formatted with emojis for WhatsApp.`;

const DHIGROWTH_WELCOME = `Hello! 👋 Welcome to **DhiGrowth IT Services**.

How can our AI Business Concierge help you today? 🤖

We help businesses with:
📱 **App Development**
🤖 **AI Business Solutions & Development**
💬 **WhatsApp CRM & Automation**
💻 **Custom IT Solutions**

Tell us what your business needs, and let's build something powerful together! 🚀`;

// Read current active AI configuration (saved JSON config > environment variables)
export const getActiveAiConfig = () => {
  let fileConfig = {};
  try {
    if (fs.existsSync(AI_CONFIG_FILE)) {
      fileConfig = JSON.parse(fs.readFileSync(AI_CONFIG_FILE, 'utf-8'));
    }
  } catch (err) {
    console.warn('[AIService] Could not read aiConfig.json:', err.message);
  }

  // Priority: Saved JSON config > process.env
  const provider = fileConfig.provider || process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY ? 'gemini' : process.env.OPENAI_API_KEY ? 'openai' : process.env.GROQ_API_KEY ? 'groq' : 'gemini');

  let apiKey = fileConfig.apiKey;
  if (!apiKey) {
    if (provider === 'openai') apiKey = process.env.OPENAI_API_KEY;
    else if (provider === 'groq') apiKey = process.env.GROQ_API_KEY;
    else if (provider === 'deepseek') apiKey = process.env.DEEPSEEK_API_KEY;
    else apiKey = process.env.GEMINI_API_KEY;
  }

  const model = fileConfig.model || process.env.AI_MODEL || (
    provider === 'openai' ? 'gpt-4o-mini' :
    provider === 'groq' ? 'llama-3.3-70b-versatile' :
    provider === 'deepseek' ? 'deepseek-chat' :
    'gemini-2.5-flash'
  );

  const systemPrompt = fileConfig.systemPrompt || process.env.AI_SYSTEM_PROMPT || DEFAULT_SYSTEM_PROMPT;

  return {
    provider,
    apiKey: apiKey ? String(apiKey).trim() : '',
    model,
    systemPrompt,
    hasKey: Boolean(apiKey),
    maskedKey: apiKey ? `${apiKey.slice(0, 7)}...${apiKey.slice(-4)}` : '',
    updatedAt: fileConfig.updatedAt || null,
  };
};

export const saveActiveAiConfig = (newConfig) => {
  const existing = getActiveAiConfig();
  const merged = {
    provider: newConfig.provider || existing.provider || 'gemini',
    apiKey: newConfig.apiKey !== undefined ? String(newConfig.apiKey).trim() : existing.apiKey,
    model: newConfig.model || existing.model,
    systemPrompt: newConfig.systemPrompt || existing.systemPrompt || DEFAULT_SYSTEM_PROMPT,
    updatedBy: newConfig.updatedBy || 'user',
    updatedAt: new Date().toISOString(),
  };

  fs.writeFileSync(AI_CONFIG_FILE, JSON.stringify(merged, null, 2), 'utf-8');

  // Update process.env in memory
  if (merged.provider === 'openai') process.env.OPENAI_API_KEY = merged.apiKey;
  else if (merged.provider === 'groq') process.env.GROQ_API_KEY = merged.apiKey;
  else if (merged.provider === 'deepseek') process.env.DEEPSEEK_API_KEY = merged.apiKey;
  else process.env.GEMINI_API_KEY = merged.apiKey;

  process.env.AI_PROVIDER = merged.provider;
  process.env.AI_MODEL = merged.model;

  console.log(`✅ [AIService] Saved live AI config: Provider=${merged.provider}, Model=${merged.model}`);
  return merged;
};

// Dispatch AI completion request to specific provider
async function callAiProvider({ provider, apiKey, model, systemPrompt, userMessage }) {
  const startTime = Date.now();

  if (provider === 'gemini') {
    // Google Gemini API
    const targetModel = model || 'gemini-2.5-flash';
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemPrompt}\n\nCustomer Message: "${userMessage}"`,
              },
            ],
          },
        ],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || `Gemini API error (${res.status})`);
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) throw new Error('Gemini returned an empty response.');

    return {
      reply: reply.trim(),
      latencyMs: Date.now() - startTime,
      provider: 'gemini',
      model: targetModel,
    };
  }

  if (provider === 'openai' || provider === 'groq' || provider === 'deepseek') {
    let endpoint = 'https://api.openai.com/v1/chat/completions';
    let defaultModel = 'gpt-4o-mini';

    if (provider === 'groq') {
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
      defaultModel = 'llama-3.3-70b-versatile';
    } else if (provider === 'deepseek') {
      endpoint = 'https://api.deepseek.com/chat/completions';
      defaultModel = 'deepseek-chat';
    }

    const targetModel = model || defaultModel;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error?.message || `${provider.toUpperCase()} API error (${res.status})`);
    }

    const reply = data.choices?.[0]?.message?.content;
    if (!reply) throw new Error(`${provider.toUpperCase()} returned an empty response.`);

    return {
      reply: reply.trim(),
      latencyMs: Date.now() - startTime,
      provider,
      model: targetModel,
    };
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

// Test live connection with a given key & provider
export const testAiConnection = async ({ provider, apiKey, model, testPrompt }) => {
  const active = getActiveAiConfig();
  const effProvider = provider || active.provider || 'gemini';
  const effApiKey = apiKey || active.apiKey;
  const effModel = model || active.model;
  const effPrompt = testPrompt || 'Hello! Are you online and ready to assist our WhatsApp customers?';

  if (!effApiKey) {
    throw new Error(`No API key provided for ${effProvider.toUpperCase()}. Please enter your API key.`);
  }

  return await callAiProvider({
    provider: effProvider,
    apiKey: effApiKey,
    model: effModel,
    systemPrompt: active.systemPrompt || DEFAULT_SYSTEM_PROMPT,
    userMessage: effPrompt,
  });
};

// Main generator used by webhook handler
export const generateAIResponse = async ({
  customerName,
  customerMessage,
  channelType = 'whatsapp',
  conversationHistory = [],
}) => {
  const query = customerMessage?.trim().toLowerCase() || '';

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

  // 2. Initial Greeting Detection
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

  // 3. Live AI Execution (Gemini / OpenAI / Groq / DeepSeek)
  const activeAi = getActiveAiConfig();
  if (activeAi.hasKey) {
    try {
      console.log(`🤖 Invoking Live AI (${activeAi.provider.toUpperCase()} / ${activeAi.model}) for: "${customerMessage}"`);
      const result = await callAiProvider({
        provider: activeAi.provider,
        apiKey: activeAi.apiKey,
        model: activeAi.model,
        systemPrompt: activeAi.systemPrompt,
        userMessage: `Customer Name: ${customerName || 'Valued Client'}\nChannel: ${channelType}\nCustomer Message: "${customerMessage}"`,
      });

      if (result.reply) {
        console.log(`✨ AI Response received in ${result.latencyMs}ms from ${result.provider}: "${result.reply.slice(0, 60)}..."`);
        return result.reply;
      }
    } catch (err) {
      console.warn(`[AIService] Live AI generation failed (${activeAi.provider}):`, err.message);
      console.log('Falling back to smart business rules engine...');
    }
  }

  // 4. Smart Business Rules Engine Fallback
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
