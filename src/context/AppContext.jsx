import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import bcrypt from 'bcryptjs';
import {
  isSupabaseConfigured,
  getWalletData,
  getContacts,
  getConversations,
  getWorkspaceMessages,
  getChannels,
  getMessages,
  createContact as createDbContact,
  updateContact as updateDbContact,
  deleteContact as deleteDbContact,
  sendChatMessage,
  subscribeToNewMessages,
  DEFAULT_WORKSPACE_ID,
} from '../services/supabaseClient';
import { BACKEND_URL } from '../services/apiConfig';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & Theme State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isUsageModalOpen, setIsUsageModalOpen] = useState(false);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [isBroadcastDueModalOpen, setIsBroadcastDueModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // User & Wallet State
  const [credits, setCredits] = useState(0.00);
  const [phoneNumber, setPhoneNumber] = useState('9791471277');
  const [countryCode, setCountryCode] = useState('IN +91');
  const [hasClaimedBonus, setHasClaimedBonus] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('Business');
  const [daysRemaining, setDaysRemaining] = useState(6);

  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dhigrowth_auth_session') || sessionStorage.getItem('dhigrowth_auth_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(currentUser);

  // Meta Cloud API Configuration State
  const [metaConfig, setMetaConfig] = useState({
    phoneNumberId: '1349867994870208',
    wabaId: '2288734648550898',
    accessToken: '',
    verifyToken: 'dhigrowth_webhook_secret_2026',
  });
  const [isMetaLoading, setIsMetaLoading] = useState(false);

  const fetchMetaConfig = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/meta-config`);
      if (res.ok) {
        const data = await res.json();
        setMetaConfig(data);
      }
    } catch (err) {
      console.warn('[AppContext] Could not fetch meta config from server:', err);
    }
  };

  const saveMetaConfig = async (newConfig) => {
    setIsMetaLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/meta-config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newConfig,
          updatedBy: currentUser?.username || 'kiki',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save Meta configuration');

      setMetaConfig((prev) => ({
        ...prev,
        ...newConfig,
      }));
      showToast('🎉 Meta WhatsApp credentials saved & active!', 'success');
      return data;
    } catch (err) {
      showToast(err.message, 'error');
      throw err;
    } finally {
      setIsMetaLoading(false);
    }
  };

  const testMetaConfig = async (configToTest) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/meta-config/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configToTest || {}),
      });
      const data = await res.json();
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchMetaConfig();
  }, []);

  // Bcrypt hashed passwords for secure authentication (Cost Factor: 10)
  const USER_PASSWORD_HASHES = {
    admin: '$2b$10$pXOt6.GRAajCsYXj1nAI4umTXtdKYfVzxr5f8sZeedXag/b5vZ.zO', // DhiGrowth@admin
    sri: '$2b$10$5ZDjuHTdcawqR3JfLwxc6uckYA9dVEQDZ0J9Lhv4W28Se8hmoyiXy', // dhigrowth2026
    kiki: [
      '$2b$10$9GRXc/Yq5N.PUsjUOQitGuxAHOQttXJBV/x6WUBLPA./rhRs8.QBG', // kiki123
      '$2b$10$sUBNkFJ1ooejU8FVDVAhje5qd4dg1kWf2XKaQyu4bNyvT1GK7fWza', // kiki2026
    ],
  };

  const login = async ({ username, password, remember = true }) => {
    const cleanUser = username?.trim().toLowerCase();
    const cleanPass = password?.trim();

    let savedCreds = null;
    try {
      const raw = localStorage.getItem('dhigrowth_auth_credentials');
      if (raw) savedCreds = JSON.parse(raw);
    } catch {}

    const isKiki = cleanUser === 'kiki' || cleanUser === 'kiki@dhigrowth.com';
    const isValidKiki =
      isKiki &&
      Boolean(cleanPass) &&
      USER_PASSWORD_HASHES.kiki.some((hash) => {
        try {
          return bcrypt.compareSync(cleanPass, hash);
        } catch {
          return false;
        }
      });

    const isSri = cleanUser === 'sri' || cleanUser === 'sri@dhigrowth.com';
    const isValidSri =
      isSri &&
      Boolean(cleanPass) &&
      (() => {
        try {
          return bcrypt.compareSync(cleanPass, USER_PASSWORD_HASHES.sri);
        } catch {
          return false;
        }
      })();

    const isAdmin = cleanUser === 'admin' || cleanUser === 'admin@dhigrowth.com';
    const isValidAdmin =
      isAdmin &&
      Boolean(cleanPass) &&
      (() => {
        try {
          return bcrypt.compareSync(cleanPass, USER_PASSWORD_HASHES.admin);
        } catch {
          return false;
        }
      })();

    const isValidCustom = 
      savedCreds &&
      (cleanUser === savedCreds.username?.toLowerCase() || cleanUser === savedCreds.email?.toLowerCase()) &&
      Boolean(cleanPass) &&
      (savedCreds.passwordHash
        ? (() => {
            try {
              return bcrypt.compareSync(cleanPass, savedCreds.passwordHash);
            } catch {
              return false;
            }
          })()
        : cleanPass === savedCreds.password);

    if (!isValidAdmin && !isValidSri && !isValidCustom && !isValidKiki) {
      throw new Error('Invalid username or password. Please try again.');
    }

    let session;
    if (isValidKiki) {
      session = {
        username: 'kiki',
        name: 'Kiki',
        email: 'kiki@client-org.com',
        role: 'External Client (BYOK)',
        isExternalClient: true,
        isAdmin: false,
        organization: "Kiki's Client Workspace",
        token: `client_kiki_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        loginAt: new Date().toISOString(),
      };
    } else if (cleanUser === 'sri') {
      session = {
        username: 'sri',
        name: 'Sri',
        email: 'sri@dhigrowth.com',
        role: 'Dhigrowth CRM User',
        isExternalClient: false,
        isAdmin: false,
        organization: 'Dhigrowth CRM',
        token: `dhi_sri_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        loginAt: new Date().toISOString(),
      };
    } else {
      session = {
        username: 'admin',
        name: 'Administrator',
        email: 'admin@dhigrowth.com',
        role: 'Super Administrator',
        isExternalClient: false,
        isAdmin: true,
        organization: 'Dhigrowth CRM & Master Operations',
        token: `dhi_admin_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
        loginAt: new Date().toISOString(),
      };
    }

    setCurrentUser(session);
    if (remember) {
      localStorage.setItem('dhigrowth_auth_session', JSON.stringify(session));
    } else {
      sessionStorage.setItem('dhigrowth_auth_session', JSON.stringify(session));
    }

    showToast(`Welcome back, ${session.name}! 👋`, 'success');
    return session;
  };

  // Admin Profile Switching State: Admin can switch between 'sri' (CRM User) and 'kiki' (Separate Client)
  const [adminViewProfile, setAdminViewProfile] = useState('sri'); // 'sri' | 'kiki'

  const switchAdminProfile = (profileName) => {
    if (profileName !== 'sri' && profileName !== 'kiki') return;
    setAdminViewProfile(profileName);
    showToast(
      `Viewing ${profileName === 'sri' ? 'Sri (Dhigrowth CRM User)' : 'Kiki (Separate Client)'}`,
      'info'
    );
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('dhigrowth_auth_session');
      sessionStorage.removeItem('dhigrowth_auth_session');
    } catch {}
    showToast('Signed out of workspace', 'info');
  };


  // Channels Connection State
  const [channels, setChannels] = useState({
    whatsapp: { connected: false, detail: 'Not connected' },
    instagram: { connected: false, detail: 'Not connected' },
    messenger: { connected: false, detail: 'Not connected' },
  });

  const connectChannel = (channelKey, detail) => {
    setChannels((prev) => ({
      ...prev,
      [channelKey]: { connected: true, detail: detail || 'Connected' },
    }));
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    showToast(`🎉 ${channelKey.toUpperCase()} connected successfully!`, 'success');
  };

  const disconnectChannel = (channelKey) => {
    setChannels((prev) => ({
      ...prev,
      [channelKey]: { connected: false, detail: 'Not connected' },
    }));
    showToast(`${channelKey.toUpperCase()} disconnected`, 'info');
  };

  // Metrics Data
  const [metrics, setMetrics] = useState({
    messagesHandled: 42,
    aiSpend30d: 0.21,
    totalLeads: 18,
    openRate: 99.1,
    replyRate: 34.8,
    aiResolutionRate: 88.4,
    avgResponseLatency: '3.2s',
  });

  // Chats List for Shared Inbox
  const [chats, setChats] = useState(() => {
    if (isSupabaseConfigured) return [];
    return [
      {
        id: 'c1',
        contactName: 'Priya Sharma',
        avatar: null,
        phone: '+91 97914 71277',
        channel: 'whatsapp',
        tag: 'Hot',
        city: 'Mumbai, IN',
        lastSeen: '2m ago',
        unreadCount: 1,
        aiHandled: true,
        dealValue: '₹2,499',
        attributes: {
          budget: '₹2,000 - ₹3,500',
          product: 'Organic Linen Bedcover 90x72',
          intent: 'COD Order Confirmation',
          city: 'Mumbai',
        },
        notes: [
          { id: 'n1', author: 'Agent Sarah', text: 'Customer asked for express BlueDart shipping to Bandra West.', time: '10m ago' }
        ],
        messages: [
          { id: 'm1', sender: 'user', text: 'Hi, do you have the king size organic linen bedcover in beige?', time: '10:24 AM' },
          { id: 'm2', sender: 'ai', text: 'Hello Priya! 👋 Yes, our Premium King Size Linen Cover (Beige · 90"×72") is in stock and ready to ship today.\n\nPrice is ₹2,499 with complimentary express delivery and Cash on Delivery available.', time: '10:24 AM' },
          { id: 'm3', sender: 'user', text: 'Great! Can you confirm if matching pillowcases come with it?', time: '10:27 AM' },
          { id: 'm4', sender: 'ai', text: 'Yes, 2 matching flange pillowcases are included! Would you like me to reserve one for you with code LAUNCH10 for 10% off?', time: '10:27 AM' },
          { id: 'm5', sender: 'user', text: 'Yes please, add COD to Bandra West address.', time: '10:30 AM' },
        ],
      },
      {
        id: 'c2',
        contactName: 'David Miller',
        avatar: null,
        phone: '+1 (415) 890-2134',
        channel: 'instagram',
        tag: 'Interested',
        city: 'San Francisco, USA',
        lastSeen: '14m ago',
        unreadCount: 0,
        aiHandled: true,
        dealValue: '$1,200',
        attributes: {
          budget: '$1,000+',
          product: 'Shopify CAPI Webhook integration',
          intent: 'SaaS Integration',
          city: 'San Francisco',
        },
        notes: [],
        messages: [
          { id: 'm201', sender: 'user', text: 'Saw your reel about Meta CAPI integration. Can we trigger events from Shopify webhooks directly?', time: '09:40 AM' },
          { id: 'm202', sender: 'ai', text: 'Hey David! 🚀 Absolutely. Whenever a cart is abandoned or purchase is completed, Sendiee posts events directly to Meta Conversions API with 9.8/10 match quality.', time: '09:40 AM' },
        ],
      },
      {
        id: 'c3',
        contactName: 'Tariq Al-Mansoor',
        avatar: null,
        phone: '+971 50 234 9812',
        channel: 'whatsapp',
        tag: 'Converted',
        city: 'Dubai, UAE',
        lastSeen: '1h ago',
        unreadCount: 0,
        aiHandled: false,
        dealValue: '$4,800',
        attributes: {
          budget: '$5,000/mo',
          product: 'Enterprise Meta Partner WABA',
          intent: 'Annual Paid Subscription',
          city: 'Dubai',
        },
        notes: [],
        messages: [
          { id: 'm301', sender: 'user', text: 'Invoice paid via wire transfer. When will our WABA green tick be live?', time: '08:15 AM' },
          { id: 'm302', sender: 'agent', text: 'Thank you Tariq! We have submitted your official Meta business verification documents. Meta typically reviews official Green Tick badges within 24-48 hours.', time: '08:20 AM' },
        ],
      },
    ];
  });

  const [activeChatId, setActiveChatId] = useState(isSupabaseConfigured ? null : 'c1');

  // Campaigns List
  const [campaigns, setCampaigns] = useState([
    {
      id: 'camp-1',
      name: 'Diwali Flash Sale 25% VIP Broadcast',
      channel: 'WhatsApp',
      template: 'festive_discount_v3',
      status: 'Active',
      audience: 'Hot Leads & VIPs (2,840 contacts)',
      sent: 2840,
      delivered: 2802,
      read: 2710,
      replied: 894,
      conversions: 312,
      revenue: '$14,280',
      roas: '776x',
    },
    {
      id: 'camp-2',
      name: 'Abandoned Cart 1h Recovery Drip',
      channel: 'WhatsApp + IG',
      template: 'cart_recovery_dynamic',
      status: 'Automated Drip',
      audience: 'Shopify Trigger (Real-time)',
      sent: 1420,
      delivered: 1400,
      read: 1362,
      replied: 480,
      conversions: 218,
      revenue: '$9,810',
      roas: '1066x',
    },
  ]);

  // AI Configuration State
  const [aiConfig, setAiConfig] = useState({
    model: 'Gemini 2.5 Flash',
    temperature: 0.3,
    systemPrompt: `You are DhiGrowth's elite AI Business Concierge for Meta channels (WhatsApp, Instagram, Messenger).
- Speak professionally, warmly, and concisely.
- Welcome clients to DhiGrowth IT Services.
- Help businesses with App Development, AI Business Solutions, WhatsApp CRM & Automation, and Custom IT Solutions.`,
    autoTagLeads: true,
    multimodalVision: true,
  });

  // Knowledge Base Documents
  const [knowledgeBase, setKnowledgeBase] = useState([
    { id: 'kb-1', title: 'Product Catalog & Pricing 2026', category: 'Catalog', tokens: '4,280 tokens', lastSync: '2h ago' },
    { id: 'kb-2', title: 'Shipping, Returns & COD Policies', category: 'Policy FAQ', tokens: '1,850 tokens', lastSync: 'Yesterday' },
  ]);

  // Sync live state with Supabase cloud database
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;

    const syncCloudData = async () => {
      try {
        // 1. Fetch live wallet balance
        const walletResult = await getWalletData(DEFAULT_WORKSPACE_ID);
        if (walletResult?.wallet && isMounted) {
          const balance = parseFloat(walletResult.wallet.balance_usd) || 0;
          setCredits(balance);
          if (balance >= 5.0) setHasClaimedBonus(true);
        }

        // 2. Fetch live channels status
        const channelsResult = await getChannels(DEFAULT_WORKSPACE_ID);
        if (channelsResult && channelsResult.length > 0 && isMounted) {
          const updated = { ...channels };
          channelsResult.forEach((ch) => {
            if (updated[ch.type]) {
              updated[ch.type] = {
                connected: ch.is_connected,
                detail: ch.display_name || ch.identifier,
              };
            }
          });
          setChannels(updated);
        }

        // 3. Fetch live contacts, conversations, and messages
        const [contactsResult, convsResult, msgsResult] = await Promise.all([
          getContacts(DEFAULT_WORKSPACE_ID),
          getConversations(DEFAULT_WORKSPACE_ID),
          getWorkspaceMessages(DEFAULT_WORKSPACE_ID),
        ]);

        if (contactsResult && isMounted) {
          setMetrics((prev) => ({
            ...prev,
            totalLeads: contactsResult.length,
          }));

          // Create map of contact_id -> conversation_id
          const contactToConvMap = {};
          (convsResult || []).forEach((cv) => {
            const cId = cv.contact_id;
            if (cId) {
              contactToConvMap[cId] = cv.id;
            }
          });

          // Group messages by conversation_id
          const convMessagesMap = {};
          (msgsResult || []).forEach((m) => {
            if (!convMessagesMap[m.conversation_id]) {
              convMessagesMap[m.conversation_id] = [];
            }
            convMessagesMap[m.conversation_id].push({
              id: m.id,
              sender: m.ai_generated ? 'ai' : m.direction === 'inbound' ? 'user' : 'agent',
              text: m.content,
              time: new Date(m.sent_at || m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
          });

          const dbChats = contactsResult.map((c) => {
            const conversationId = contactToConvMap[c.id] || null;
            const contactMsgs = conversationId && convMessagesMap[conversationId]?.length > 0
              ? convMessagesMap[conversationId]
              : [
                  {
                    id: `init-${c.id}`,
                    sender: 'ai',
                    text: `Hello! 👋 Welcome to **DhiGrowth IT Services**.\n\nHow can our AI Business Concierge help you today? 🤖\n\nWe help businesses with:\n📱 **App Development**\n🤖 **AI Business Solutions & Development**\n💬 **WhatsApp CRM & Automation**\n💻 **Custom IT Solutions**\n\nTell us what your business needs, and let’s build something powerful together! 🚀`,
                    time: 'Recent',
                  },
                ];

            return {
              id: c.id,
              conversationId,
              contactName: c.full_name,
              avatar: null,
              phone: c.phone_number,
              email: c.email || `${c.full_name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
              channel: 'whatsapp',
              tag: c.custom_attributes?.tag || (c.lead_score >= 90 ? 'Hot' : c.lead_score >= 70 ? 'Interested' : 'Discovery'),
              city: c.custom_attributes?.city || 'Mumbai, IN',
              lastSeen: 'Active',
              unreadCount: 0,
              aiHandled: true,
              dealValue: c.custom_attributes?.dealValue || '₹2,499',
              attributes: {
                budget: '₹2,000 - ₹5,000',
                product: 'Omnichannel CRM Lead',
                intent: c.lead_stage || 'Discovery',
                city: c.custom_attributes?.city || 'India',
              },
              notes: [],
              messages: contactMsgs,
            };
          });

          setChats((prev) => {
            const hasChanged = dbChats.some((newChat) => {
              const oldChat = prev.find((p) => p.id === newChat.id);
              if (!oldChat) return true;
              if ((oldChat.messages || []).length !== (newChat.messages || []).length) return true;
              const oldLast = oldChat.messages?.[oldChat.messages.length - 1];
              const newLast = newChat.messages?.[newChat.messages.length - 1];
              return oldLast?.id !== newLast?.id || oldLast?.text !== newLast?.text;
            });

            if (!hasChanged && prev.length === dbChats.length && prev.length > 0) {
              return prev;
            }

            return dbChats.map((newChat) => {
              const oldChat = prev.find((p) => p.id === newChat.id);
              if (!oldChat) return newChat;
              return {
                ...newChat,
                notes: oldChat.notes?.length > 0 ? oldChat.notes : newChat.notes,
                tag: oldChat.tag || newChat.tag,
              };
            });
          });

          setActiveChatId((prev) => {
            if (prev && dbChats.some((d) => d.id === prev)) return prev;
            return dbChats.length > 0 ? dbChats[0].id : null;
          });
        }
      } catch (err) {
        console.warn('Supabase cloud sync note:', err);
      }
    };

    syncCloudData();

    // 4. Automatic fast-polling every 2 seconds for guaranteed live sync
    const pollInterval = setInterval(() => {
      if (!isMounted) return;
      syncCloudData();
    }, 2000);

    const handleFocus = () => {
      if (isMounted) syncCloudData();
    };
    window.addEventListener('focus', handleFocus);

    // 5. Subscribe to Real-Time Inbound Messages
    const subscription = subscribeToNewMessages(DEFAULT_WORKSPACE_ID, (newMsg) => {
      if (!isMounted) return;
      const formatted = {
        id: newMsg.id,
        sender: newMsg.ai_generated ? 'ai' : newMsg.direction === 'inbound' ? 'user' : 'agent',
        text: newMsg.content,
        time: new Date(newMsg.sent_at || newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChats((prev) =>
        prev.map((c) => {
          if (
            c.conversationId === newMsg.conversation_id ||
            c.id === newMsg.conversation_id ||
            (!c.conversationId && prev.length === 1)
          ) {
            if (c.messages.some((m) => m.id === newMsg.id)) return c;
            return {
              ...c,
              conversationId: c.conversationId || newMsg.conversation_id,
              messages: [...c.messages, formatted],
              lastSeen: 'Just now',
            };
          }
          return c;
        })
      );
    });

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
      if (subscription && typeof subscription.unsubscribe === 'function') {
        subscription.unsubscribe();
      }
    };
  }, []);

  // Toast Helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Claim $5 Bonus
  const claimBonus = () => {
    if (hasClaimedBonus) {
      showToast('You have already claimed your $5 launch credit!', 'info');
      return;
    }
    setCredits((prev) => +(prev + 5.00).toFixed(2));
    setHasClaimedBonus(true);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    showToast('🎉 $5.00 launch credit added to your wallet!', 'success');
  };

  // Send Message in Inbox
  const sendMessage = (text, sender = 'agent') => {
    if (!text.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return {
            ...c,
            messages: [...c.messages, newMsg],
            lastSeen: 'Just now',
          };
        }
        return c;
      })
    );

    setMetrics((prev) => ({
      ...prev,
      messagesHandled: prev.messagesHandled + 1,
    }));

    if (sender === 'user') {
      setTimeout(() => {
        let reply = `Thank you for your message! Sendiee AI is assisting you with "${text}". Our team has also been notified.`;
        if (text.toLowerCase().includes('price') || text.toLowerCase().includes('cost') || text.toLowerCase().includes('how much')) {
          reply = `Our current rate is ₹2,499 with free COD shipping across India! Would you like me to book this for you?`;
        } else if (text.toLowerCase().includes('track') || text.toLowerCase().includes('order')) {
          reply = `Your order is on the way via BlueDart Express (Air AWB #BD-99482). Live tracking has been sent to your WhatsApp.`;
        }

        const aiMsg = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setChats((prevChats) =>
          prevChats.map((c) => (c.id === activeChatId ? { ...c, messages: [...c.messages, aiMsg] } : c))
        );

        setMetrics((prev) => ({
          ...prev,
          messagesHandled: prev.messagesHandled + 1,
          aiSpend30d: +(prev.aiSpend30d + 0.005).toFixed(3),
        }));
      }, 800);
    }
  };

  const toggleAiForChat = (chatId) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === chatId) {
          const next = !c.aiHandled;
          showToast(next ? '🤖 AI Auto-Pilot Enabled for this conversation' : '👤 Human Agent Takeover Active', 'info');
          return { ...c, aiHandled: next };
        }
        return c;
      })
    );
  };

  const addInternalNote = (chatId, text) => {
    if (!text.trim()) return;
    const note = {
      id: `n-${Date.now()}`,
      author: 'Sri (Admin)',
      text,
      time: 'Just now',
    };
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, notes: [note, ...(c.notes || [])] } : c))
    );
    showToast('Internal note saved to contact timeline', 'success');
  };

  const updateLeadTag = (chatId, newTag) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, tag: newTag } : c))
    );
    showToast(`Lead stage updated to "${newTag}"`, 'success');
  };

  const createLead = async (leadData) => {
    let newDbId = `c-${Date.now()}`;

    // 1. Save to Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const res = await createDbContact({
          fullName: leadData.name,
          phoneNumber: leadData.phone,
          email: leadData.email,
          leadStage: leadData.tag === 'Hot' ? 'Won / Confirmed' : 'Discovery',
          leadScore: leadData.tag === 'Hot' ? 95 : 65,
          city: leadData.city || 'Mumbai, IN',
          dealValue: leadData.dealValue || '₹2,499',
          tag: leadData.tag || 'Interested',
        });
        if (res?.contact?.id) {
          newDbId = res.contact.id;
        }
      } catch (err) {
        console.warn('Supabase create contact notice:', err);
      }
    }

    const newLead = {
      id: newDbId,
      contactName: leadData.name,
      avatar: leadData.avatar || null,
      phone: leadData.phone,
      email: leadData.email || `${leadData.name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      channel: leadData.channel || 'whatsapp',
      tag: leadData.tag || 'Interested',
      city: leadData.city || 'Mumbai, IN',
      lastSeen: 'Just now',
      unreadCount: 0,
      aiHandled: true,
      dealValue: leadData.dealValue || '₹2,499',
      attributes: {
        budget: leadData.budget || '₹2,499',
        product: leadData.product || 'General inquiry',
        intent: 'New Lead',
        city: leadData.city || 'Mumbai, IN',
      },
      notes: [],
      messages: [
        {
          id: `init-${Date.now()}`,
          sender: 'ai',
          text: `Hello! 👋 Welcome to **DhiGrowth IT Services**.\n\nHow can our AI Business Concierge help you today? 🤖\n\nWe help businesses with:\n📱 **App Development**\n🤖 **AI Business Solutions & Development**\n💬 **WhatsApp CRM & Automation**\n💻 **Custom IT Solutions**\n\nTell us what your business needs, and let’s build something powerful together! 🚀`,
          time: 'Just now',
        },
      ],
    };

    setChats((prev) => [newLead, ...prev]);
    setActiveChatId(newDbId);
    setMetrics((prev) => ({ ...prev, totalLeads: prev.totalLeads + 1 }));
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
    showToast(`Contact "${leadData.name}" saved to database!`, 'success');
  };

  const updateLead = async (contactId, updatedData) => {
    const targetChat = chats.find((c) => c.id === contactId);

    // 1. Update in Supabase if configured
    if (isSupabaseConfigured) {
      try {
        await updateDbContact(
          contactId,
          {
            fullName: updatedData.name,
            phoneNumber: updatedData.phone,
            email: updatedData.email,
            tag: updatedData.tag,
            custom_attributes: {
              ...(targetChat?.attributes || {}),
              city: updatedData.city || targetChat?.city || targetChat?.attributes?.city || 'Mumbai, IN',
              dealValue: updatedData.dealValue || targetChat?.dealValue || '₹2,499',
              tag: updatedData.tag || targetChat?.tag || 'Interested',
              ...(updatedData.attributes || {}),
            },
          },
          DEFAULT_WORKSPACE_ID,
          targetChat?.phone
        );
      } catch (err) {
        console.warn('Supabase update contact notice:', err);
      }
    }

    // 2. Update local state
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          return {
            ...c,
            contactName: updatedData.name !== undefined ? updatedData.name : c.contactName,
            phone: updatedData.phone !== undefined ? updatedData.phone : c.phone,
            email: updatedData.email !== undefined ? updatedData.email : c.email,
            tag: updatedData.tag !== undefined ? updatedData.tag : c.tag,
            city: updatedData.city !== undefined ? updatedData.city : c.city,
            dealValue: updatedData.dealValue !== undefined ? updatedData.dealValue : c.dealValue,
            attributes: {
              ...c.attributes,
              ...(updatedData.attributes || {}),
              city: updatedData.city || c.attributes?.city || c.city,
              budget: updatedData.dealValue || updatedData.budget || c.attributes?.budget || c.dealValue,
              product: updatedData.product || c.attributes?.product,
            },
          };
        }
        return c;
      })
    );

    showToast(`Contact "${updatedData.name || targetChat?.contactName}" updated successfully!`, 'success');
  };

  const deleteLead = async (contactId) => {
    const targetChat = chats.find((c) => c.id === contactId);

    // 1. Delete from Supabase if configured
    if (isSupabaseConfigured) {
      try {
        await deleteDbContact(contactId, DEFAULT_WORKSPACE_ID, targetChat?.phone);
      } catch (err) {
        console.warn('Supabase delete contact notice:', err);
      }
    }

    // 2. Remove from local state
    setChats((prev) => {
      const remaining = prev.filter((c) => c.id !== contactId);
      return remaining;
    });

    setActiveChatId((prevActive) => {
      if (prevActive === contactId) {
        const remaining = chats.filter((c) => c.id !== contactId);
        return remaining.length > 0 ? remaining[0].id : null;
      }
      return prevActive;
    });

    setMetrics((prev) => ({ ...prev, totalLeads: Math.max(0, prev.totalLeads - 1) }));
    showToast(`Contact deleted from database`, 'info');
  };

  const createCampaign = (campData) => {
    const newCamp = {
      id: `camp-${Date.now()}`,
      name: campData.name || 'New Broadcast Campaign',
      channel: campData.channel || 'WhatsApp',
      template: campData.template || 'order_shipped_tracker',
      status: 'Active',
      audience: campData.audience || 'Hot Leads (1,200 contacts)',
      sent: 1200,
      delivered: 1184,
      read: 1140,
      replied: 410,
      conversions: 142,
      revenue: '$4,850',
      roas: '680x',
    };

    setCampaigns((prev) => [newCamp, ...prev]);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    showToast('🚀 Broadcast Campaign scheduled & launched!', 'success');
  };

  // Keyboard shortcut listener for Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        theme,
        setTheme,
        credits,
        setCredits,
        phoneNumber,
        setPhoneNumber,
        countryCode,
        setCountryCode,
        hasClaimedBonus,
        claimBonus,
        currentPlan,
        setCurrentPlan,
        daysRemaining,
        channels,
        connectChannel,
        disconnectChannel,
        metrics,
        chats,
        activeChatId,
        setActiveChatId,
        sendMessage,
        toggleAiForChat,
        addInternalNote,
        updateLeadTag,
        createLead,
        updateLead,
        deleteLead,
        campaigns,
        createCampaign,
        aiConfig,
        setAiConfig,
        knowledgeBase,
        setKnowledgeBase,
        searchQuery,
        setSearchQuery,
        isSearchOpen,
        setIsSearchOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        toggleSidebar: () => setIsSidebarCollapsed((prev) => !prev),
        isUpgradeModalOpen,
        setIsUpgradeModalOpen,
        isUsageModalOpen,
        setIsUsageModalOpen,
        isWidgetOpen,
        setIsWidgetOpen,
        isWorkspaceDropdownOpen,
        setIsWorkspaceDropdownOpen,
        isBroadcastDueModalOpen,
        setIsBroadcastDueModalOpen,
        toastMessage,
        showToast,
        currentUser,
        isAuthenticated,
        login,
        logout,
        metaConfig,
        isMetaLoading,
        fetchMetaConfig,
        saveMetaConfig,
        testMetaConfig,
        adminViewProfile,
        setAdminViewProfile,
        switchAdminProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
