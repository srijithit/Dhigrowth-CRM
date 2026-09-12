import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bot,
  User,
  Send,
  Sparkles,
  PhoneCall,
  CheckCheck,
  ShieldCheck,
  Tag,
  StickyNote,
  Zap,
  DollarSign,
  MapPin,
  Calendar,
  Layers,
  ArrowRight,
  Globe,
  ChevronDown,
  Wand2,
  RefreshCw,
  MessageCircle,
  Loader2,
  Check,
  Smile,
  Plus,
  Trash2,
  X,
  Users,
  Edit2,
  Edit3,
  FileText,
  CreditCard,
  Download,
  ExternalLink,
  GripVertical,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ContactAvatar } from '../common/ContactAvatar';
import { BACKEND_URL } from '../../services/apiConfig';

export const TeamInbox = () => {
  const {
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
    showToast,
    isBroadcastDueModalOpen,
    setIsBroadcastDueModalOpen,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [activeTabSide, setActiveTabSide] = useState('profile'); // profile | notes
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all | ai | human | hot
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  const [isTranslateMenuOpen, setIsTranslateMenuOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // New Contact & Delete Modal State
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formTag, setFormTag] = useState('Interested');
  const [formChannel, setFormChannel] = useState('WhatsApp');
  const [formCity, setFormCity] = useState('');

  // Edit Contact State
  const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
  const [isUpdatingContact, setIsUpdatingContact] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editTag, setEditTag] = useState('Interested');
  const [editCity, setEditCity] = useState('');
  const [editDealValue, setEditDealValue] = useState('');
  const [editProduct, setEditProduct] = useState('');

  // Horizontal Resizing State (Left & Right Splitters)
  const [leftWidth, setLeftWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('team_inbox_left_width');
      return saved ? Math.min(Math.max(parseInt(saved, 10) || 320, 220), 550) : 320;
    } catch {
      return 320;
    }
  });

  const [rightWidth, setRightWidth] = useState(() => {
    try {
      const saved = localStorage.getItem('team_inbox_right_width');
      return saved ? Math.min(Math.max(parseInt(saved, 10) || 340, 240), 580) : 340;
    } catch {
      return 340;
    }
  });

  const [isRightCollapsed, setIsRightCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(null); // 'left' | 'right' | null

  useEffect(() => {
    try {
      localStorage.setItem('team_inbox_left_width', leftWidth);
    } catch {}
  }, [leftWidth]);

  useEffect(() => {
    try {
      localStorage.setItem('team_inbox_right_width', rightWidth);
    } catch {}
  }, [rightWidth]);

  const handleStartResizeLeft = (e) => {
    e.preventDefault();
    setIsDragging('left');
    const startX = e.clientX;
    const startWidth = leftWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      const nextWidth = Math.min(Math.max(startWidth + delta, 220), 550);
      setLeftWidth(nextWidth);
    };

    const onMouseUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      setIsDragging(null);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleStartResizeRight = (e) => {
    e.preventDefault();
    setIsDragging('right');
    const startX = e.clientX;
    const startWidth = rightWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (moveEvent) => {
      const delta = startX - moveEvent.clientX; // dragging left expands right sidebar
      const nextWidth = Math.min(Math.max(startWidth + delta, 240), 580);
      setRightWidth(nextWidth);
    };

    const onMouseUp = () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      setIsDragging(null);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Invoice & Payment Modal State
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceName, setInvoiceName] = useState('');
  const [invoicePhone, setInvoicePhone] = useState('');
  const [invoiceEmail, setInvoiceEmail] = useState('');
  const [invoiceCity, setInvoiceCity] = useState('');
  const [invoiceDesc, setInvoiceDesc] = useState('DhiGrowth WhatsApp CRM & AI Concierge');
  const [invoiceAmount, setInvoiceAmount] = useState('2499');
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const [markingPaidId, setMarkingPaidId] = useState(null);

  const handleOpenInvoiceModal = () => {
    if (!activeChat) return;
    setInvoiceName(activeChat.contactName || 'Valued Client');
    setInvoicePhone(activeChat.phone || '919791471277');
    setInvoiceEmail(activeChat.email || '');
    setInvoiceCity(activeChat.city || 'Mumbai, IN');
    setInvoiceDesc(activeChat.interestedIn ? `DhiGrowth Service - ${activeChat.interestedIn}` : 'DhiGrowth WhatsApp CRM & AI Concierge');
    setInvoiceAmount(activeChat.dealValue ? activeChat.dealValue.replace(/[^0-9]/g, '') || '2499' : '2499');
    setIsInvoiceModalOpen(true);
  };

  // Broadcast Payment Due Invoices to All Contacts State
  const [broadcastDesc, setBroadcastDesc] = useState('DhiGrowth WhatsApp CRM & AI Business Concierge');
  const [broadcastAmount, setBroadcastAmount] = useState('2499');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSummary, setBroadcastSummary] = useState(null);

  const handleBroadcastDueInvoices = async (e) => {
    e?.preventDefault();
    setIsBroadcasting(true);
    setBroadcastSummary(null);

    try {
      const targetContacts = (chats || []).map((c) => ({
        name: c.contactName || 'Valued Client',
        phone: c.phone || '',
        email: c.email || '',
        city: c.city || 'India',
        conversationId: c.conversationId || c.id,
      }));

      const payload = {
        contacts: targetContacts,
        description: broadcastDesc,
        amount: broadcastAmount,
      };

      let res;
      try {
        res = await fetch(`${BACKEND_URL}/api/invoices/broadcast-due-to-all`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (e) {
        console.warn('BACKEND_URL failed, falling back to local backend:', e.message);
      }

      // If remote Render hasn't finished deploying new commit (returned 404), fallback to local backend
      if (!res || !res.ok) {
        try {
          res = await fetch('http://localhost:4000/api/invoices/broadcast-due-to-all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (e) {
          console.warn('Local fallback also failed:', e.message);
        }
      }

      if (!res) {
        throw new Error('Unable to connect to backend server. Please check your connection.');
      }

      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error('Backend is currently deploying latest code on Render. Please wait 1-2 minutes and try again.');
      }

      if (data.success && data.summary) {
        setBroadcastSummary(data.summary);
        showToast(`🚀 Dispatched Payment Due PDFs to ${data.summary.dispatched} contacts on WhatsApp!`, 'success');
      } else {
        showToast(data.error || 'Failed to broadcast invoices', 'error');
      }
    } catch (err) {
      showToast('Error broadcasting invoices: ' + err.message, 'error');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleCreateAndSendInvoice = async (e) => {
    e?.preventDefault();
    if (!invoicePhone) {
      showToast('Recipient phone number is required', 'error');
      return;
    }
    setIsSendingInvoice(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/invoices/create-and-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: invoiceName,
          phone: invoicePhone,
          email: invoiceEmail,
          city: invoiceCity,
          description: invoiceDesc,
          amount: invoiceAmount,
          conversationId: activeChat.conversationId || activeChat.id,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const inv = data.invoice;
        const formattedAmount = `INR ${Number(inv.amount).toLocaleString('en-IN')}`;
        const text = `🧾 [INVOICE DUE: ${inv.id}]\nAmount: ${formattedAmount}\nService: ${inv.description}\nPayment Link: ${inv.paymentLink}`;
        sendMessage(text, 'agent');
        setIsInvoiceModalOpen(false);
        showToast(`🧾 Invoice ${inv.id} & Due PDF sent to WhatsApp (${inv.phone})!`, 'success');
      } else {
        showToast(data.error || 'Failed to generate invoice', 'error');
      }
    } catch (err) {
      showToast('Failed to connect to invoice server: ' + err.message, 'error');
    } finally {
      setIsSendingInvoice(false);
    }
  };

  const handleMarkInvoicePaid = async (invoiceId) => {
    setMarkingPaidId(invoiceId);
    try {
      const res = await fetch(`${BACKEND_URL}/api/invoices/${invoiceId}/mark-paid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod: 'Manual CRM Confirmation',
        }),
      });
      const data = await res.json();
      if (data.success) {
        const inv = data.invoice;
        const formattedAmount = `INR ${Number(inv.amount).toLocaleString('en-IN')}`;
        const receiptText = `✅ [PAYMENT RECEIVED: ${inv.id}]\nAmount: ${formattedAmount}\nTransaction ID: ${inv.transactionId}\nReceipt PDF sent to customer.`;
        sendMessage(receiptText, 'agent');
        showToast(`✅ Invoice ${inv.id} paid! Customer received Paid Receipt PDF on WhatsApp.`, 'success');
      } else {
        showToast(data.error || 'Failed to mark invoice paid', 'error');
      }
    } catch (err) {
      showToast('Failed to mark paid: ' + err.message, 'error');
    } finally {
      setMarkingPaidId(null);
    }
  };


  const activeChat = chats.find((c) => c.id === activeChatId) || (chats.length > 0 ? chats[0] : null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages?.length, activeChatId]);

  const LANGUAGES = [
    { name: 'Hindi', code: 'hi', native: 'हिंदी', flag: '🇮🇳' },
    { name: 'Tamil', code: 'ta', native: 'தமிழ்', flag: '🇮🇳' },
    { name: 'Telugu', code: 'te', native: 'తెలుగు', flag: '🇮🇳' },
    { name: 'Marathi', code: 'mr', native: 'मराठी', flag: '🇮🇳' },
    { name: 'Spanish', code: 'es', native: 'Español', flag: '🇪🇸' },
    { name: 'Arabic', code: 'ar', native: 'العربية', flag: '🇦🇪' },
    { name: 'French', code: 'fr', native: 'Français', flag: '🇫🇷' },
    { name: 'German', code: 'de', native: 'Deutsch', flag: '🇩🇪' },
  ];

  const filteredChats = chats.filter((chat) => {
    if (statusFilter === 'ai' && !chat.aiHandled) return false;
    if (statusFilter === 'human' && chat.aiHandled) return false;
    if (statusFilter === 'hot' && chat.tag !== 'Hot') return false;
    if (
      searchTerm &&
      !chat.contactName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !chat.phone.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const [isSendingLive, setIsSendingLive] = useState(false);
  const [agentMode, setAgentMode] = useState('manual'); // 'manual' | 'ai'

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = inputMessage.trim();
    if (!text) return;

    setInputMessage('');
    setIsSendingLive(true);

    // 1. Immediately append to chat in UI as Human Support Agent
    sendMessage(text, 'agent');

    // 2. Dispatch to live Meta WhatsApp Cloud API via server endpoint
    try {
      const recipient = activeChat.phone || '919791471277';
      const res = await fetch('http://localhost:4000/api/send-manual-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: recipient,
          text: text,
          conversationId: activeChat.conversationId || activeChat.id,
          channelType: activeChat.channel || 'whatsapp',
        }),
      });
      const data = await res.json();
      if (data.deliveredToWhatsApp) {
        showToast(`🚀 Delivered to ${recipient} on WhatsApp!`, 'success');
      } else if (data.errorDetails) {
        if (data.errorDetails.code === 131030) {
          showToast(`⚠️ Meta Error: ${recipient} is not in your Meta Allowed Recipients list. Add it in Meta Developers -> WhatsApp -> API Setup.`, 'error');
        } else {
          showToast(`⚠️ Meta API: ${data.errorDetails.details || data.errorDetails.message}`, 'error');
        }
      } else {
        showToast(`Sent manually as Support Agent`, 'success');
      }
    } catch (err) {
      console.warn('Manual send note:', err);
      showToast(`Sent manually as Support Agent`, 'success');
    } finally {
      setIsSendingLive(false);
    }
  };

  const handleUserSimulatorSend = () => {
    if (!inputMessage.trim()) return;
    sendMessage(inputMessage, 'user');
    setInputMessage('');
  };

  // 1. AI Reply Generator
  const handleGenerateAiReply = () => {
    setIsGeneratingAi(true);
    const messages = activeChat.messages || [];
    const lastUserMsg = [...messages].reverse().find((m) => m.sender === 'user')?.text || '';

    setTimeout(() => {
      let aiDraft = `Hi ${activeChat.contactName}, thank you for reaching out to Dhigrowth CRM! How can I assist you with your order today?`;

      if (lastUserMsg.toLowerCase().includes('cod') || lastUserMsg.toLowerCase().includes('bandra') || lastUserMsg.toLowerCase().includes('address')) {
        aiDraft = `Great! Confirmed your Cash on Delivery order to Bandra West, Mumbai. Our delivery partner will dispatch your parcel within 24 hours with live tracking. 🎉`;
      } else if (lastUserMsg.toLowerCase().includes('price') || lastUserMsg.toLowerCase().includes('cost') || lastUserMsg.toLowerCase().includes('discount')) {
        aiDraft = `The total price is ₹2,499 with free express shipping. You can also apply promo code LAUNCH10 for an instant 10% discount!`;
      } else if (lastUserMsg.toLowerCase().includes('stock') || lastUserMsg.toLowerCase().includes('available')) {
        aiDraft = `Yes, this item is in stock in our Mumbai fulfillment center. Would you like me to reserve one for you?`;
      }

      setInputMessage(aiDraft);
      setIsGeneratingAi(false);
      showToast('✨ AI smart response drafted in editor!', 'success');
    }, 450);
  };

  // Helper for real-time translation
  const translateText = async (text, targetLangCode = 'hi') => {
    if (!text || !text.trim()) return '';

    // 1. Try local Node backend endpoint
    try {
      const res = await fetch('http://localhost:4000/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim(), targetLang: targetLangCode }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.translatedText) return data.translatedText;
      }
    } catch (err) {
      console.warn('[Translate] Local endpoint error, falling back to direct:', err);
    }

    // 2. Direct browser fallback via Google Translate API
    try {
      const directUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLangCode}&dt=t&q=${encodeURIComponent(text.trim())}`;
      const resp = await fetch(directUrl);
      const json = await resp.json();
      return json[0].map((s) => s[0]).join('');
    } catch (err) {
      console.error('[Translate] Direct API error:', err);
      throw err;
    }
  };

  // 1. Translate Draft inside editor so user can review/edit
  const handleTranslateDraft = async (langName = selectedLanguage) => {
    const text = inputMessage.trim();
    if (!text) {
      showToast(`Type a message in the box first to translate into ${langName}`, 'info');
      return;
    }

    const target = LANGUAGES.find((l) => l.name === langName) || LANGUAGES[0];
    setIsTranslating(true);
    try {
      const translated = await translateText(text, target.code);
      setInputMessage(translated);
      setSelectedLanguage(target.name);
      showToast(`🌐 Translated to ${target.name}!`, 'success');
    } catch (err) {
      console.error('Translation error:', err);
      showToast('Translation error. Please check your connection.', 'error');
    } finally {
      setIsTranslating(false);
      setIsTranslateMenuOpen(false);
    }
  };

  // 2. Translate and Send directly to WhatsApp & Supabase
  const handleTranslateAndSend = async (langName = selectedLanguage) => {
    const text = inputMessage.trim();
    if (!text) {
      showToast(`Type a message in the box first to translate & send in ${langName}`, 'info');
      return;
    }

    const target = LANGUAGES.find((l) => l.name === langName) || LANGUAGES[0];
    setIsTranslating(true);
    setIsSendingLive(true);
    try {
      const translated = await translateText(text, target.code);
      setInputMessage('');
      setIsTranslateMenuOpen(false);

      // 1. Immediately append to chat in UI as Human Support Agent
      sendMessage(translated, 'agent');

      // 2. Dispatch to live Meta WhatsApp Cloud API via server endpoint
      const recipient = activeChat?.phone || '919791471277';
      const res = await fetch('http://localhost:4000/api/send-manual-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientPhone: recipient,
          text: translated,
          conversationId: activeChat?.conversationId || activeChat?.id,
          channelType: activeChat?.channel || 'whatsapp',
        }),
      });
      const data = await res.json();
      if (data.deliveredToWhatsApp) {
        showToast(`🚀 Translated to ${target.name} & delivered to WhatsApp!`, 'success');
      } else if (data.errorDetails) {
        if (data.errorDetails.code === 131030) {
          showToast(`⚠️ Meta Error: ${recipient} is not in your Meta Allowed Recipients list. Add it in Meta Developers -> WhatsApp -> API Setup.`, 'error');
        } else {
          showToast(`⚠️ Meta API: ${data.errorDetails.details || data.errorDetails.message}`, 'error');
        }
      } else {
        showToast(`🌐 Translated to ${target.name} & sent!`, 'success');
      }
    } catch (err) {
      console.error('Translate & send error:', err);
      showToast('Failed to translate and dispatch message', 'error');
    } finally {
      setIsTranslating(false);
      setIsSendingLive(false);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addInternalNote(activeChat.id, noteInput);
    setNoteInput('');
  };

  const handleCreateContact = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    setIsSubmitting(true);
    try {
      await createLead({
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        tag: formTag,
        city: formCity.trim() || 'Mumbai, IN',
        channel: formChannel.toLowerCase(),
      });
      setFormName('');
      setFormPhone('');
      setFormEmail('');
      setFormCity('');
      setIsAddContactModalOpen(false);
    } catch (err) {
      console.error('Error adding contact:', err);
      showToast('Error saving contact to database', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!contactToDelete) return;
    setIsDeleting(true);
    try {
      await deleteLead(contactToDelete.id);
      setContactToDelete(null);
    } catch (err) {
      console.error('Error deleting contact:', err);
      showToast('Error deleting contact from database', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEditModal = (chat = activeChat) => {
    if (!chat) return;
    setEditName(chat.contactName || '');
    setEditPhone(chat.phone || '');
    setEditEmail(chat.email || '');
    setEditTag(chat.tag || 'Interested');
    setEditCity(chat.city || chat.attributes?.city || 'Mumbai, IN');
    setEditDealValue(chat.dealValue || chat.attributes?.budget || '₹2,499');
    setEditProduct(chat.attributes?.product || 'General inquiry');
    setIsEditContactModalOpen(true);
  };

  const handleSaveContactEdit = async (e) => {
    e.preventDefault();
    if (!activeChat || !editName.trim() || !editPhone.trim()) return;

    setIsUpdatingContact(true);
    try {
      await updateLead(activeChat.id, {
        name: editName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim(),
        tag: editTag,
        city: editCity.trim(),
        dealValue: editDealValue.trim(),
        attributes: {
          budget: editDealValue.trim(),
          city: editCity.trim(),
          product: editProduct.trim(),
        },
      });
      setIsEditContactModalOpen(false);
    } catch (err) {
      console.error('Error updating contact:', err);
      showToast('Error updating contact details', 'error');
    } finally {
      setIsUpdatingContact(false);
    }
  };

  const channelIcons = {
    whatsapp: <span className="text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded-full font-mono">WhatsApp</span>,
    instagram: <span className="text-[10px] font-bold bg-[#FCE7F3] text-[#DB2777] px-2 py-0.5 rounded-full font-mono">Instagram</span>,
    messenger: <span className="text-[10px] font-bold bg-[#DBEAFE] text-[#2563EB] px-2 py-0.5 rounded-full font-mono">Messenger</span>,
  };

  const tagColors = {
    Hot: 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]',
    Interested: 'bg-[#DCFCE7] text-[#16A34A] border-[#BBF7D0]',
    Cold: 'bg-[#F1F5F9] text-[#475467] border-[#E2E8F0]',
    Converted: 'bg-[#F4F0FD] text-[#7C3AED] border-[#E9D8FD]',
  };

  return (
    <div className="h-full flex-1 flex overflow-hidden bg-[#F8F9FC] font-sans">
      {/* 1. Left: Conversation List */}
      <div
        style={{ width: `${leftWidth}px` }}
        className="border-r border-[#EAECF0] bg-white flex flex-col shrink-0 min-h-0 relative select-text"
      >
        {/* Header & New Contact & Search */}
        <div className="p-3.5 border-b border-[#EAECF0] space-y-2.5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#101828]">Messages</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#F4F0FD] text-[#7C3AED] font-mono font-bold">
                {chats.length}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setBroadcastSummary(null);
                  setIsBroadcastDueModalOpen(true);
                }}
                className="flex items-center gap-1 text-[11px] font-bold text-[#7C3AED] bg-[#F4F0FD] hover:bg-[#EDE5FA] border border-[#E9D8FD] px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs group"
                title="Send Payment Due PDF with payment link to all WhatsApp contacts"
              >
                <Zap className="w-3.5 h-3.5 text-[#7C3AED] group-hover:scale-110 transition-transform" />
                <span>Send Due to All</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddContactModalOpen(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Contact</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-[#98A2B3] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search leads, phone, tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#EAECF0] pl-8.5 pr-3 py-1.5 rounded-xl text-xs text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-medium overflow-x-auto pb-0.5 no-scrollbar">
            {[
              { id: 'all', label: 'All Threads' },
              { id: 'ai', label: '🤖 AI Handled' },
              { id: 'human', label: '👤 Agent' },
              { id: 'hot', label: '🔥 Hot Leads' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer ${
                  statusFilter === f.id
                    ? 'bg-[#7C3AED] text-white font-semibold'
                    : 'bg-[#F9FAFB] text-[#475467] hover:text-[#101828]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Threads List */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F2F4F7] min-h-0">
          {filteredChats.map((chat) => {
            const isSelected = chat.id === activeChatId;
            const messages = chat.messages || [];
            const lastMsg = messages[messages.length - 1];
            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#F4F0FD] border-l-4 border-l-[#7C3AED]'
                    : 'hover:bg-[#F9FAFB]'
                }`}
              >
                <div className="relative shrink-0">
                  <ContactAvatar name={chat.contactName} size="md" />
                  {chat.aiHandled ? (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#7C3AED] rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-xs" title="AI Auto-Pilot On">
                      🤖
                    </span>
                  ) : (
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#16A34A] rounded-full flex items-center justify-center text-white text-[8px] font-bold shadow-xs" title="Human Agent Active">
                      👤
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#101828] truncate">
                      {chat.contactName}
                    </h3>
                    <span className="text-[10px] text-[#98A2B3] font-mono">{chat.lastSeen}</span>
                  </div>

                  <p className="text-xs text-[#475467] truncate line-clamp-1">
                    {lastMsg ? lastMsg.text : 'New lead inbound'}
                  </p>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    {channelIcons[chat.channel] || channelIcons.whatsapp}
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${
                        tagColors[chat.tag] || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {chat.tag}
                    </span>
                    {chat.dealValue && (
                      <span className="text-[9px] font-mono text-[#16A34A] font-bold ml-auto">
                        {chat.dealValue}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Horizontal Resizer: Between Messages List & Chat */}
      <div
        onMouseDown={handleStartResizeLeft}
        onDoubleClick={() => setLeftWidth(320)}
        title="Drag horizontally to resize Messages sidebar (Double-click to reset to 320px)"
        className={`w-1.5 hover:w-2 transition-all cursor-col-resize select-none shrink-0 z-10 flex items-center justify-center group relative ${
          isDragging === 'left' ? 'bg-[#7C3AED] w-2' : 'bg-[#EAECF0] hover:bg-[#7C3AED]/70'
        }`}
      >
        <div className="w-0.5 h-7 rounded-full bg-[#98A2B3] group-hover:bg-white transition-colors" />
      </div>

      {/* 2. Center: Chat Conversation Window */}
      <div className="flex-1 flex flex-col bg-[#F8F9FC] min-w-[320px] h-full min-h-0">
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#F8F9FC] space-y-3 min-h-0">
            <div className="w-16 h-16 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#98A2B3]">
              <MessageCircle className="w-8 h-8 text-[#98A2B3]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#101828]">No active conversation</h3>
              <p className="text-xs text-[#667085] max-w-sm">
                Select a conversation thread from the left or create a new contact to start chatting.
              </p>
            </div>
            <button
              onClick={() => setIsAddContactModalOpen(true)}
              className="mt-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Contact</span>
            </button>
          </div>
        ) : (
          <>
            {/* Chat Top Header */}
            <div className="h-16 border-b border-[#EAECF0] bg-white px-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <ContactAvatar name={activeChat.contactName} size="lg" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-[#101828] truncate">
                      {activeChat.contactName}
                    </h2>
                    <span className="hidden sm:inline text-xs font-mono text-[#667085]">
                      {activeChat.phone}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${tagColors[activeChat.tag]}`}>
                      {activeChat.tag}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#98A2B3] flex items-center gap-2 mt-0.5">
                    <span>{activeChat.city}</span>
                    <span>·</span>
                    <span className="text-[#16A34A] font-mono font-semibold">
                      {activeChat.aiHandled ? '● Dhigrowth AI Auto-Pilot' : '● Human Agent Active'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* AI Auto-Pilot Switch */}
                <button
                  onClick={() => toggleAiForChat(activeChat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                    activeChat.aiHandled
                      ? 'bg-[#F4F0FD] text-[#7C3AED] border border-[#E9D8FD] hover:bg-[#EDE5FA]'
                      : 'bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0] hover:bg-[#D1FAE5]'
                  }`}
                >
                  {activeChat.aiHandled ? <Bot className="w-3.5 h-3.5 text-[#7C3AED]" /> : <User className="w-3.5 h-3.5 text-[#16A34A]" />}
                  <span>{activeChat.aiHandled ? 'AI Auto-Pilot ON' : 'Human Takeover'}</span>
                </button>

                {/* Toggle Lead Intelligence Panel */}
                <button
                  onClick={() => setIsRightCollapsed(!isRightCollapsed)}
                  className="p-2 rounded-xl border border-[#EAECF0] bg-white text-[#667085] hover:text-[#7C3AED] hover:border-[#7C3AED] hover:bg-[#F4F0FD] transition-all cursor-pointer shadow-2xs"
                  title={isRightCollapsed ? 'Expand Lead Intelligence Panel' : 'Collapse Lead Intelligence Panel'}
                >
                  {isRightCollapsed ? <PanelRightOpen className="w-4 h-4" /> : <PanelRightClose className="w-4 h-4" />}
                </button>
              </div>
            </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-3.5 min-h-0">
          {(activeChat.messages || []).map((msg) => {
            const isUser = msg.sender === 'user';
            const isAi = msg.sender === 'ai';
            const text = msg.text || '';
            const isInvoiceDue = text.includes('[INVOICE DUE:') || msg.type === 'invoice';
            const isPaymentReceived = text.includes('[PAYMENT RECEIVED:') || msg.type === 'receipt';

            let invoiceId = null;
            if (isInvoiceDue) {
              const match = text.match(/\[INVOICE DUE:\s*([A-Za-z0-9_-]+)\]/);
              if (match) invoiceId = match[1];
            } else if (isPaymentReceived) {
              const match = text.match(/\[PAYMENT RECEIVED:\s*([A-Za-z0-9_-]+)\]/);
              if (match) invoiceId = match[1];
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-start mr-auto' : 'items-end ml-auto'} max-w-[85%] sm:max-w-md`}
              >
                {isInvoiceDue ? (
                  <div className="bg-white border-2 border-[#E9D8FD] rounded-2xl p-4 shadow-sm space-y-3 w-full text-left font-sans">
                    <div className="flex items-center justify-between gap-2 border-b border-[#F4F0FD] pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
                          <FileText className="w-4 h-4 text-[#7C3AED]" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#101828]">Invoice Due PDF</div>
                          <div className="text-[10px] font-mono text-[#7C3AED] font-bold">{invoiceId || 'INV'}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]">
                        PAYMENT DUE
                      </span>
                    </div>

                    <p className="text-xs text-[#344054] whitespace-pre-line leading-relaxed">
                      {text.replace(/🧾\s*\[INVOICE DUE:[^\]]+\]\n?/, '')}
                    </p>

                    <div className="space-y-2 pt-1 border-t border-[#F2F4F7]">
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`http://localhost:4000/api/invoices/${invoiceId || 'sample'}/pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#F4F0FD] hover:bg-[#EDE5FA] text-[#7C3AED] border border-[#E9D8FD] rounded-xl text-[11px] font-bold transition-all text-center"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>View PDF</span>
                        </a>
                        <a
                          href={`http://localhost:4000/invoices/${invoiceId || 'sample'}/pay`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-[11px] font-bold transition-all text-center shadow-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Pay Page</span>
                        </a>
                      </div>

                      {invoiceId && (
                        <button
                          type="button"
                          disabled={markingPaidId === invoiceId}
                          onClick={() => handleMarkInvoicePaid(invoiceId)}
                          className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-[11px] font-bold transition-all cursor-pointer shadow-xs disabled:opacity-75"
                          title="Confirm payment received and instantly send Paid Receipt PDF to WhatsApp"
                        >
                          {markingPaidId === invoiceId ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Sending Receipt PDF to WhatsApp...</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Mark Paid & Send Receipt PDF</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ) : isPaymentReceived ? (
                  <div className="bg-[#F0FDF4] border-2 border-[#86EFAC] rounded-2xl p-4 shadow-sm space-y-3 w-full text-left font-sans">
                    <div className="flex items-center justify-between gap-2 border-b border-[#DCFCE7] pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] flex items-center justify-center text-[#15803D]">
                          <ShieldCheck className="w-4 h-4 text-[#15803D]" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#14532D]">Payment Confirmed</div>
                          <div className="text-[10px] font-mono text-[#15803D] font-bold">{invoiceId || 'PAID'}</div>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                        ✓ PAID RECEIPT
                      </span>
                    </div>

                    <p className="text-xs text-[#166534] whitespace-pre-line leading-relaxed">
                      {text.replace(/✅\s*\[PAYMENT RECEIVED:[^\]]+\]\n?/, '')}
                    </p>

                    <a
                      href={`http://localhost:4000/api/invoices/${invoiceId || 'sample'}/pdf`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-[11px] font-bold transition-all text-center shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Paid Tax Receipt PDF</span>
                    </a>
                  </div>
                ) : (
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                      isUser
                        ? 'bg-white border border-[#EAECF0] text-[#101828] rounded-tl-xs'
                        : isAi
                        ? 'bg-[#F4F0FD] border border-[#E9D8FD] text-[#101828] rounded-tr-xs'
                        : 'bg-[#7C3AED] text-white rounded-tr-xs'
                    }`}
                  >
                    {isAi && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#7C3AED] font-bold mb-1.5 pb-1 border-b border-[#E9D8FD]">
                        <Sparkles className="w-3 h-3 text-[#7C3AED]" />
                        <span>Dhigrowth AI Auto-Pilot</span>
                      </div>
                    )}

                    {!isUser && !isAi && (
                      <div className="flex items-center gap-1 text-[10px] font-mono text-purple-200 font-bold mb-1 pb-1 border-b border-purple-400/30">
                        <User className="w-3 h-3" />
                        <span>Support Agent</span>
                      </div>
                    )}

                    <p className="whitespace-pre-line">{text}</p>
                  </div>
                )}

                <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#98A2B3] font-mono">
                  <span>{msg.time}</span>
                  {!isUser && <CheckCheck className="w-3.5 h-3.5 text-[#16A34A]" />}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer & Multi-Channel Action Bar */}
        <div className="p-3 lg:p-4 border-t border-[#EAECF0] bg-white shrink-0 space-y-2.5">
          {/* Top Bar: Mode Selector & Quick AI Chips */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {/* Manual vs AI Mode Toggle */}
              <div className="inline-flex p-0.5 bg-[#F2F4F7] rounded-lg border border-[#EAECF0] shrink-0">
                <button
                  type="button"
                  onClick={() => setAgentMode('manual')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    agentMode === 'manual'
                      ? 'bg-white text-[#101828] shadow-xs'
                      : 'text-[#667085] hover:text-[#101828]'
                  }`}
                >
                  <User className="w-3 h-3 text-[#16A34A]" />
                  <span>Manual Agent</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAgentMode('ai')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    agentMode === 'ai'
                      ? 'bg-white text-[#7C3AED] shadow-xs'
                      : 'text-[#667085] hover:text-[#101828]'
                  }`}
                >
                  <Bot className="w-3 h-3 text-[#7C3AED]" />
                  <span>AI Auto-Pilot</span>
                </button>
              </div>

              {/* Active Channel & Recipient Badge */}
              <div className="hidden xl:flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#DCFCE7]/70 border border-[#BBF7D0] text-[#16A34A] text-[11px] font-medium font-mono truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse shrink-0"></span>
                <span className="truncate">WhatsApp Live · {activeChat.phone}</span>
              </div>
            </div>

            {/* Quick Actions & AI Suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <button
                type="button"
                onClick={handleOpenInvoiceModal}
                className="px-2.5 py-1 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-[11px] font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
                title="Create and send official Payment Due PDF with payment link to WhatsApp"
              >
                <FileText className="w-3 h-3" />
                <span>Send Invoice PDF</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateAiReply}
                disabled={isGeneratingAi}
                className="px-2.5 py-1 rounded-full bg-[#F4F0FD] border border-[#E9D8FD] hover:border-[#7C3AED] text-[#7C3AED] text-[11px] font-bold shrink-0 transition-colors cursor-pointer flex items-center gap-1"
                title="Auto-draft response with AI"
              >
                <Sparkles className="w-3 h-3 text-[#7C3AED]" />
                <span>{isGeneratingAi ? 'Drafting...' : 'AI Draft'}</span>
              </button>


              <button
                type="button"
                onClick={() => setInputMessage('Yes please, confirmed COD order for Bandra West.')}
                className="px-2.5 py-1 rounded-full bg-[#F9FAFB] border border-[#EAECF0] hover:border-[#7C3AED] text-[#475467] hover:text-[#7C3AED] text-[11px] shrink-0 transition-colors cursor-pointer hidden sm:inline-flex"
              >
                📦 COD Confirm
              </button>

              <button
                type="button"
                onClick={() => setInputMessage('Use promo code LAUNCH10 for an extra 10% off today!')}
                className="px-2.5 py-1 rounded-full bg-[#F9FAFB] border border-[#EAECF0] hover:border-[#7C3AED] text-[#475467] hover:text-[#7C3AED] text-[11px] shrink-0 transition-colors cursor-pointer hidden md:inline-flex"
              >
                🎟️ Promo
              </button>
            </div>
          </div>

          {/* Dedicated Full-Width Multi-Line Textarea */}
          <div className="relative bg-[#F9FAFB] border border-[#EAECF0] rounded-2xl p-2.5 focus-within:border-[#7C3AED] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#7C3AED]/10 transition-all shadow-2xs">
            <textarea
              rows={2}
              placeholder={
                agentMode === 'manual'
                  ? `Type message to send directly to WhatsApp (${activeChat.phone})... (Press Enter to send)`
                  : `Type message as customer or agent (AI Auto-Pilot active)...`
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="w-full bg-transparent text-xs text-[#101828] placeholder-[#98A2B3] focus:outline-none resize-none min-h-[44px] max-h-28 leading-relaxed"
            />

            {/* Bottom Toolbar inside composer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#EAECF0]/80 gap-2">
              <div className="flex items-center gap-2 text-[#667085] min-w-0">
                <button
                  type="button"
                  onClick={handleGenerateAiReply}
                  className="p-1 hover:text-[#7C3AED] hover:bg-[#F4F0FD] rounded-lg transition-colors cursor-pointer text-xs font-semibold flex items-center gap-1 text-[#7C3AED] shrink-0"
                  title="Generate smart AI draft"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Draft with AI</span>
                </button>
                <span className="text-[#D0D5DD] hidden sm:inline">|</span>
                <span className="text-[10px] text-[#98A2B3] font-mono hidden lg:inline truncate">
                  ↵ Enter to send · Shift+↵ new line
                </span>
              </div>

              {/* Action & Send Buttons */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Translate & Send Dropdown */}
                <div className="relative">
                  <div className="flex items-center">
                    <button
                      type="button"
                      disabled={isTranslating}
                      onClick={() => handleTranslateDraft(selectedLanguage)}
                      className="px-2.5 py-1.5 bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-l-lg text-[11px] font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer disabled:opacity-75"
                      title={`Translate text in box to ${selectedLanguage}`}
                    >
                      {isTranslating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Globe className="w-3 h-3" />
                      )}
                      <span>{isTranslating ? 'Translating...' : selectedLanguage}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsTranslateMenuOpen(!isTranslateMenuOpen)}
                      className="px-1.5 py-1.5 bg-[#0369A1] hover:bg-[#075985] text-white rounded-r-lg text-[11px] font-bold border-l border-sky-400 cursor-pointer"
                      title="Choose Target Language & Options"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Language Selection Popover */}
                  {isTranslateMenuOpen && (
                    <div className="absolute right-0 bottom-10 w-64 bg-white border border-[#EAECF0] rounded-2xl shadow-2xl p-2 z-50 space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between px-1 pb-1 border-b border-[#EAECF0]">
                        <span className="text-[10px] font-bold text-[#98A2B3] uppercase font-mono">
                          Translate Language
                        </span>
                        <span className="text-[9px] text-[#0284C7] bg-[#F0F9FF] font-semibold px-1.5 py-0.5 rounded-md">
                          Live AI
                        </span>
                      </div>
                      <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5">
                        {LANGUAGES.map((lang) => (
                          <div
                            key={lang.name}
                            className={`flex items-center justify-between p-1.5 rounded-xl text-xs transition-colors ${
                              selectedLanguage === lang.name ? 'bg-[#F0F9FF] text-[#0284C7]' : 'hover:bg-[#F9FAFB] text-[#344054]'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLanguage(lang.name);
                                handleTranslateDraft(lang.name);
                              }}
                              className="flex items-center gap-2 flex-1 text-left cursor-pointer"
                              title={`Translate draft to ${lang.name}`}
                            >
                              <span>{lang.flag}</span>
                              <span className="font-semibold text-xs">{lang.name}</span>
                              <span className="text-[10px] text-[#98A2B3] font-mono">({lang.native})</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedLanguage(lang.name);
                                handleTranslateAndSend(lang.name);
                              }}
                              className="px-2 py-0.5 bg-[#0284C7] hover:bg-[#0369A1] text-white text-[10px] font-bold rounded-lg cursor-pointer transition-colors shadow-2xs shrink-0"
                              title={`Translate and send to WhatsApp in ${lang.name}`}
                            >
                              Send ↗
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="pt-1 border-t border-[#EAECF0] text-[10px] text-[#98A2B3] text-center font-mono">
                        Click language to translate in box · Click Send ↗ to send
                      </div>
                    </div>
                  )}
                </div>

                {/* Primary Send Button */}
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSendingLive || !inputMessage.trim()}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                    !inputMessage.trim()
                      ? 'bg-[#EAECF0] text-[#98A2B3] cursor-not-allowed'
                      : 'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-emerald-500/20 active:scale-95'
                  }`}
                  title="Send message directly to WhatsApp"
                >
                  {isSendingLive ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </>
                  )}
                </button>

                {/* Simulate Customer Inbound */}
                <button
                  type="button"
                  onClick={handleUserSimulatorSend}
                  className="px-2 py-1.5 bg-[#F4F0FD] hover:bg-[#EDE5FA] border border-[#E9D8FD] text-[#7C3AED] rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  title="Simulate incoming customer message to test AI reply"
                >
                  <Bot className="w-3 h-3 text-[#7C3AED]" />
                  <span className="hidden xl:inline">Simulate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </div>

      {/* Horizontal Resizer: Between Chat & Intelligence Panel */}
      {!isRightCollapsed && (
        <div
          onMouseDown={handleStartResizeRight}
          onDoubleClick={() => setRightWidth(340)}
          title="Drag horizontally to resize Lead Intelligence panel (Double-click to reset to 340px)"
          className={`w-1.5 hover:w-2 transition-all cursor-col-resize select-none shrink-0 z-10 flex items-center justify-center group relative ${
            isDragging === 'right' ? 'bg-[#7C3AED] w-2' : 'bg-[#EAECF0] hover:bg-[#7C3AED]/70'
          }`}
        >
          <div className="w-0.5 h-7 rounded-full bg-[#98A2B3] group-hover:bg-white transition-colors" />
        </div>
      )}

      {/* 3. Right: Contact Profile & Notes */}
      {!isRightCollapsed && (
        <div
          style={{ width: `${rightWidth}px` }}
          className="border-l border-[#EAECF0] bg-white flex flex-col shrink-0 min-h-0 select-text"
        >
        <div className="flex border-b border-[#EAECF0] shrink-0 bg-white">
          <button
            onClick={() => setActiveTabSide('profile')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTabSide === 'profile'
                ? 'border-[#7C3AED] text-[#7C3AED] bg-[#F4F0FD]/60'
                : 'border-transparent text-[#667085] hover:text-[#101828]'
            }`}
          >
            Lead Intelligence
          </button>
          <button
            onClick={() => setActiveTabSide('notes')}
            className={`flex-1 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTabSide === 'notes'
                ? 'border-[#7C3AED] text-[#7C3AED] bg-[#F4F0FD]/60'
                : 'border-transparent text-[#667085] hover:text-[#101828]'
            }`}
          >
            Team Notes ({activeChat ? (activeChat.notes || []).length : 0})
          </button>
        </div>

        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#98A2B3] space-y-2 min-h-0">
            <Users className="w-8 h-8 text-[#D0D5DD]" />
            <p className="text-xs font-semibold text-[#667085]">No contact selected</p>
            <p className="text-[11px] text-[#98A2B3]">Select a conversation to view intelligence and notes</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            {activeTabSide === 'profile' ? (
              <>
                {/* Profile Card */}
                <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#EAECF0] space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ContactAvatar name={activeChat.contactName} size="xl" />
                      <div>
                        <h4 className="text-sm font-bold text-[#101828] flex items-center gap-1">
                          {activeChat.contactName}
                          <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
                        </h4>
                        <span className="text-xs text-[#667085] font-mono">{activeChat.phone}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenEditModal(activeChat)}
                      className="p-2 rounded-xl border border-[#EAECF0] bg-white text-[#475467] hover:text-[#7C3AED] hover:border-[#7C3AED] hover:bg-[#F4F0FD] transition-all cursor-pointer shadow-xs"
                      title="Edit Contact"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>

                {/* Lead Stage Selector */}
                <div className="space-y-1.5 pt-2 border-t border-[#EAECF0]">
                  <div className="text-[10px] font-mono text-[#98A2B3] uppercase font-semibold">Lead Stage</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {['Hot', 'Interested', 'Cold', 'Converted'].map((stage) => (
                      <button
                        key={stage}
                        onClick={() => updateLeadTag(activeChat.id, stage)}
                        className={`py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                          activeChat.tag === stage
                            ? `${tagColors[stage]} shadow-xs ring-1 ring-[#7C3AED]`
                            : 'border-[#EAECF0] bg-white text-[#475467] hover:bg-[#F2F4F7]'
                        }`}
                      >
                        {stage}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Extracted Attributes */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>AI Extracted Entities</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F9FAFB] border border-[#EAECF0] space-y-2 text-xs">
                  {Object.entries(activeChat.attributes || {}).map(([key, val]) => (
                    <div key={key} className="flex justify-between items-start pb-1.5 border-b border-[#EAECF0] last:border-none last:pb-0">
                      <span className="text-[#667085] capitalize font-mono text-[11px]">{key}:</span>
                      <span className="font-semibold text-[#101828] text-right">{val}</span>
                    </div>
                  ))}
                </div>

                {/* Contact Actions: Invoices, Edit & Delete */}
                <div className="pt-2 border-t border-[#EAECF0] space-y-2">
                  <button
                    type="button"
                    onClick={handleOpenInvoiceModal}
                    className="w-full py-2 px-3 border border-[#E9D8FD] bg-[#F4F0FD] hover:bg-[#EDE5FA] text-[#7C3AED] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    title="Send customized Payment Due PDF to this contact"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Send Due Invoice PDF</span>
                  </button>

                  <button
                    onClick={() => handleOpenEditModal(activeChat)}
                    className="w-full py-2 px-3 border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] text-[#344054] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Edit Contact Details</span>
                  </button>

                  <button
                    onClick={() => setContactToDelete(activeChat)}
                    className="w-full py-2 px-3 border border-[#FEE2E2] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                    <span>Delete Contact from Database</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <form onSubmit={handleAddNote} className="space-y-2">
                <textarea
                  rows={3}
                  placeholder="Add internal note for your team..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-[#EAECF0] p-2.5 rounded-xl text-xs text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#7C3AED] resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Internal Note
                </button>
              </form>

              <div className="space-y-2">
                {(activeChat.notes || []).map((n) => (
                  <div
                    key={n.id}
                    className="p-3 rounded-xl bg-[#F9FAFB] border border-[#EAECF0] text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center text-[10px] text-[#7C3AED] font-mono font-semibold">
                      <span>{n.author}</span>
                      <span className="text-[#98A2B3]">{n.time}</span>
                    </div>
                    <p className="text-[#101828] text-xs">{n.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )}

      {/* Add Contact Modal */}
      {isAddContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in font-sans">
          <div className="bg-white border border-[#EAECF0] rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsAddContactModalOpen(false)}
              className="absolute top-5 right-5 text-[#98A2B3] hover:text-[#101828] p-1.5 rounded-xl hover:bg-[#F9FAFB] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
                <Users className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101828]">Add New Lead Contact</h3>
                <p className="text-xs text-[#667085]">Save contact into Supabase and start conversation</p>
              </div>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#475467]">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Rao"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475467]">WhatsApp Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED] font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475467]">Email Address</label>
                <input
                  type="email"
                  placeholder="vikram@company.com"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#475467]">Lead Stage</label>
                  <select
                    value={formTag}
                    onChange={(e) => setFormTag(e.target.value)}
                    className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                  >
                    <option value="Hot">🔥 Hot</option>
                    <option value="Interested">Interested</option>
                    <option value="Cold">Cold</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#475467]">Channel</label>
                  <select
                    value={formChannel}
                    onChange={(e) => setFormChannel(e.target.value)}
                    className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Messenger">Messenger</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475467]">City / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, IN"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-xs mt-2 cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving to Database...</span>
                  </>
                ) : (
                  <span>Create Contact & Save to Supabase</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {isEditContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in font-sans">
          <div className="bg-white border border-[#EAECF0] rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsEditContactModalOpen(false)}
              className="absolute top-5 right-5 text-[#98A2B3] hover:text-[#101828] p-1.5 rounded-xl hover:bg-[#F9FAFB] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
                <Edit3 className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101828]">Edit Contact Details</h3>
                <p className="text-xs text-[#667085]">Update lead information in database</p>
              </div>
            </div>

            <form onSubmit={handleSaveContactEdit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#475467]">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sri"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475467]">WhatsApp Number</label>
                <input
                  type="text"
                  required
                  placeholder="+91 84384 89970"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED] font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475467]">Email Address</label>
                <input
                  type="email"
                  placeholder="sri@example.com"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#475467]">Lead Stage</label>
                  <select
                    value={editTag}
                    onChange={(e) => setEditTag(e.target.value)}
                    className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                  >
                    <option value="Hot">🔥 Hot</option>
                    <option value="Interested">Interested</option>
                    <option value="Cold">Cold</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#475467]">City / Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, IN"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-[#475467]">Budget / Deal Value</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹2,499"
                    value={editDealValue}
                    onChange={(e) => setEditDealValue(e.target.value)}
                    className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#475467]">Product / Interest</label>
                  <input
                    type="text"
                    placeholder="e.g. Omnichannel CRM Lead"
                    value={editProduct}
                    onChange={(e) => setEditProduct(e.target.value)}
                    className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditContactModalOpen(false)}
                  disabled={isUpdatingContact}
                  className="flex-1 py-2.5 border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] text-[#344054] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingContact}
                  className="flex-1 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  {isUpdatingContact ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {contactToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in font-sans">
          <div className="bg-white border border-[#EAECF0] rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] border border-[#FECACA] flex items-center justify-center text-[#DC2626] mx-auto">
              <Trash2 className="w-6 h-6 text-[#DC2626]" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-[#101828]">Delete Contact?</h3>
              <p className="text-xs text-[#667085]">
                Are you sure you want to permanently delete <span className="font-bold text-[#101828]">{contactToDelete.contactName}</span> ({contactToDelete.phone}) from Supabase database?
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setContactToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-[#F2F4F7] hover:bg-[#EAECF0] text-[#344054] rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create & Send Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in font-sans">
          <div className="bg-white border border-[#EAECF0] rounded-3xl max-w-lg w-full p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsInvoiceModalOpen(false)}
              className="absolute top-5 right-5 text-[#98A2B3] hover:text-[#101828] p-1.5 rounded-xl hover:bg-[#F9FAFB] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
                <FileText className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101828]">Create & Send Invoice PDF</h3>
                <p className="text-xs text-[#667085]">Dispatches official Due PDF with payment link to WhatsApp</p>
              </div>
            </div>

            <form onSubmit={handleCreateAndSendInvoice} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#475467]">Customer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Sri"
                    value={invoiceName}
                    onChange={(e) => setInvoiceName(e.target.value)}
                    className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2.5 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#475467]">WhatsApp Number</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 97914 71277"
                    value={invoicePhone}
                    onChange={(e) => setInvoicePhone(e.target.value)}
                    className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2.5 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED] font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#475467]">Customer Email</label>
                  <input
                    type="email"
                    placeholder="sri@example.com"
                    value={invoiceEmail}
                    onChange={(e) => setInvoiceEmail(e.target.value)}
                    className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2.5 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-[#475467]">City / Location</label>
                  <input
                    type="text"
                    placeholder="Bangalore, IN"
                    value={invoiceCity}
                    onChange={(e) => setInvoiceCity(e.target.value)}
                    className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2.5 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475467]">Service / Item Description</label>
                <input
                  type="text"
                  required
                  placeholder="DhiGrowth WhatsApp CRM & AI Concierge Setup"
                  value={invoiceDesc}
                  onChange={(e) => setInvoiceDesc(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2.5 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475467]">Total Amount (INR ₹)</label>
                <div className="relative mt-1">
                  <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[#667085]">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="2499"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(e.target.value)}
                    className="w-full bg-[#F9FAFB] border border-[#EAECF0] pl-8 pr-3.5 py-2.5 rounded-xl text-xs text-[#101828] font-bold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div className="p-3 bg-[#F4F0FD] border border-[#E9D8FD] rounded-2xl text-[11px] text-[#6D28D9] space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Automated Workflow Highlights:</span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-[#5B21B6]">
                  <li>Generates high-resolution vector PDF with DhiGrowth branding & Red "PAYMENT DUE" badge.</li>
                  <li>Uploads PDF directly to Meta Cloud API and delivers as an attachment to WhatsApp.</li>
                  <li>Includes secure dynamic checkout link with UPI, NetBanking & Cards.</li>
                  <li><strong>Auto-Receipt:</strong> Once paid, the system instantly generates and dispatches the Green "PAID / RECEIPT" PDF to WhatsApp!</li>
                </ul>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  disabled={isSendingInvoice}
                  className="flex-1 py-3 border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] text-[#344054] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingInvoice}
                  className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSendingInvoice ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Generating & Sending PDF...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Send Invoice Due PDF</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Payment Due Invoices to All Contacts Modal */}
      {isBroadcastDueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in font-sans">
          <div className="bg-white border border-[#EAECF0] rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-4 max-h-[92vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => {
                setIsBroadcastDueModalOpen(false);
                setBroadcastSummary(null);
              }}
              className="absolute top-5 right-5 text-[#98A2B3] hover:text-[#101828] p-1.5 rounded-xl hover:bg-[#F9FAFB] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED] shadow-xs">
                <Zap className="w-6 h-6 text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101828]">Broadcast Due Invoices (All Contacts)</h3>
                <p className="text-xs text-[#667085]">Dispatches official Due PDF + 1-Click Pay Link to each contact on WhatsApp</p>
              </div>
            </div>

            {broadcastSummary ? (
              <div className="space-y-4 py-2">
                <div className="p-4 bg-[#F0FDF4] border-2 border-[#86EFAC] rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-[#15803D] font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A]" />
                    <span>Broadcast Completed Successfully!</span>
                  </div>
                  <p className="text-xs text-[#166534]">
                    Dispatched <strong>{broadcastSummary.dispatched}</strong> of <strong>{broadcastSummary.total}</strong> Payment Due PDFs with interactive payment links directly to WhatsApp.
                  </p>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto border border-[#EAECF0] rounded-2xl p-3 bg-[#F9FAFB]">
                  <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider font-mono mb-1">
                    Dispatch Log:
                  </div>
                  {broadcastSummary.results?.map((res, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#EAECF0] last:border-none">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#101828]">{res.name}</span>
                        <span className="font-mono text-[11px] text-[#667085]">({res.phone})</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${res.success ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEE2E2] text-[#DC2626]'}`}>
                        {res.success ? `Sent (${res.invoiceId})` : 'Failed'}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 bg-[#F4F0FD] border border-[#E9D8FD] rounded-2xl text-xs text-[#6D28D9] flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Auto-Receipt Trigger Active:</strong> The moment any customer clicks their payment link and completes payment, our backend automatically generates and sends their official <strong>Paid Receipt PDF</strong> to their WhatsApp without any manual action required!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsBroadcastDueModalOpen(false);
                    setBroadcastSummary(null);
                  }}
                  className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Done & Return to Inbox
                </button>
              </div>
            ) : (
              <form onSubmit={handleBroadcastDueInvoices} className="space-y-4">
                {/* Recipients Overview */}
                <div className="p-3.5 bg-[#FAF8F5] border border-[#EAECF0] rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#344054]">Target Recipients</span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4F0FD] text-[#7C3AED] font-mono border border-[#E9D8FD]">
                      {chats.length} Contacts
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {chats.map((c) => (
                      <span
                        key={c.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-white border border-[#EAECF0] text-[#344054] shadow-2xs"
                      >
                        <ContactAvatar name={c.contactName} size="xs" />
                        <span>{c.contactName}</span>
                        <span className="font-mono text-[#98A2B3] text-[10px]">({c.phone?.slice(-4) || 'WA'})</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[#475467]">Invoice Description / Service Name</label>
                    <input
                      type="text"
                      required
                      placeholder="DhiGrowth WhatsApp CRM & AI Business Concierge"
                      value={broadcastDesc}
                      onChange={(e) => setBroadcastDesc(e.target.value)}
                      className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2.5 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-[#475467]">Due Amount per Contact (INR ₹)</label>
                    <div className="relative mt-1">
                      <span className="absolute left-3.5 top-2.5 text-xs font-bold text-[#667085]">₹</span>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder="2499"
                        value={broadcastAmount}
                        onChange={(e) => setBroadcastAmount(e.target.value)}
                        className="w-full bg-[#F9FAFB] border border-[#EAECF0] pl-8 pr-3.5 py-2.5 rounded-xl text-xs text-[#101828] font-bold focus:outline-none focus:border-[#7C3AED]"
                      />
                    </div>
                  </div>
                </div>

                {/* Workflow Explanation Banner */}
                <div className="p-3.5 bg-[#F4F0FD] border border-[#E9D8FD] rounded-2xl text-[11px] text-[#6D28D9] space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-[#7C3AED]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>How the Automated Flow Works:</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#5B21B6]">
                    <li><strong>Step 1:</strong> Generates unique Payment Due PDF invoices and dispatches them via Meta Cloud API directly into each customer's WhatsApp chat.</li>
                    <li><strong>Step 2:</strong> Includes a 1-click secure payment link supporting UPI, GPay, PhonePe, Cards, and NetBanking.</li>
                    <li><strong>Step 3 (Auto-Receipt):</strong> As soon as any contact pays, our system immediately generates and sends their official <strong>Green Paid Receipt PDF</strong> to their WhatsApp automatically!</li>
                  </ul>
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsBroadcastDueModalOpen(false)}
                    disabled={isBroadcasting}
                    className="flex-1 py-3 border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] text-[#344054] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBroadcasting}
                    className="flex-1 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75"
                  >
                    {isBroadcasting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Broadcasting to WhatsApp ({chats.length})...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Send Due PDFs to All Contacts Now</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


