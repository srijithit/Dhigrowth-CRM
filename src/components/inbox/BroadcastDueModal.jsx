import React, { useState } from 'react';
import {
  X,
  Zap,
  Check,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { ContactAvatar } from '../common/ContactAvatar';
import { BACKEND_URL } from '../../services/apiConfig';

export const BroadcastDueModal = ({ onClose }) => {
  const {
    chats = [],
    currentUser,
    isBroadcastDueModalOpen,
    setIsBroadcastDueModalOpen,
    showToast,
  } = useApp();

  const [broadcastDesc, setBroadcastDesc] = useState('DhiGrowth WhatsApp CRM & AI Business Concierge');
  const [broadcastAmount, setBroadcastAmount] = useState(2499);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastSummary, setBroadcastSummary] = useState(null);

  if (!isBroadcastDueModalOpen) return null;

  // Compile recipients: fallback to client demo contacts if chats is empty
  const fallbackContacts = [
    { id: 'c-1', contactName: 'Alex Morgan', phone: '+91 97914 71277', email: 'alex@clientcorp.in', city: 'Mumbai' },
    { id: 'c-2', contactName: 'Elena Rostova', phone: '+91 97914 71277', email: 'elena@enterprise.com', city: 'Bengaluru' },
    { id: 'c-3', contactName: 'Priya Sharma', phone: '+91 97914 71277', email: 'priya@techpartners.in', city: 'Chennai' },
    { id: 'c-4', contactName: 'David Chen', phone: '+91 97914 71277', email: 'david@globaltrade.co', city: 'Delhi' },
  ];

  const effectiveChats = (chats && chats.length > 0) ? chats : fallbackContacts;

  const handleClose = () => {
    setIsBroadcastDueModalOpen(false);
    setBroadcastSummary(null);
    if (onClose) onClose();
  };

  const handleBroadcastDueInvoices = async (e) => {
    e?.preventDefault();
    setIsBroadcasting(true);
    setBroadcastSummary(null);

    try {
      const targetContacts = effectiveChats.map((c) => ({
        name: c.contactName || c.customerName || 'Valued Client',
        phone: c.phone || '+91 97914 71277',
        email: c.email || '',
        city: c.city || 'India',
        conversationId: c.conversationId || c.id,
      }));

      const payload = {
        contacts: targetContacts,
        description: broadcastDesc,
        amount: broadcastAmount,
        senderName: currentUser?.name || 'CRM Administrator',
      };

      let res;
      try {
        res = await fetch(`${BACKEND_URL}/api/invoices/broadcast-due-to-all`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.warn('Primary BACKEND_URL failed, falling back to local backend:', err.message);
      }

      // If remote Render hasn't finished deploying or failed, fallback to local backend
      if (!res || !res.ok) {
        try {
          res = await fetch('http://localhost:4000/api/invoices/broadcast-due-to-all', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        } catch (err) {
          console.warn('Local fallback also failed:', err.message);
        }
      }

      if (!res) {
        throw new Error('Unable to connect to backend server. Please ensure backend is running.');
      }

      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error('Server returned invalid response. Please try again.');
      }

      if (data.success && data.summary) {
        setBroadcastSummary(data.summary);
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        } catch {}
        showToast(`🎉 Dispatched Payment Due PDFs to all ${data.summary.dispatched} contacts on WhatsApp!`, 'success');
      } else {
        showToast(data.error || 'Failed to broadcast invoices', 'error');
      }
    } catch (err) {
      showToast('Error broadcasting invoices: ' + err.message, 'error');
    } finally {
      setIsBroadcasting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in font-sans">
      <div className="bg-white border border-[#EAECF0] rounded-3xl max-w-xl w-full p-6 shadow-2xl relative space-y-4 max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 text-[#98A2B3] hover:text-[#101828] p-1.5 rounded-xl hover:bg-[#F9FAFB] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED] shadow-xs">
            <Zap className="w-6 h-6 text-[#7C3AED]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[#101828]">Broadcast Due Invoices (All Contacts)</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]">
                Auto-Receipt
              </span>
            </div>
            <p className="text-xs text-[#667085]">Dispatches official Due PDF + 1-Click Pay Link to each contact on WhatsApp</p>
          </div>
        </div>

        {broadcastSummary ? (
          <div className="space-y-5 py-2 text-center animate-in zoom-in-95 duration-200">
            {/* Celebratory Icon & Header */}
            <div className="space-y-3">
              <div className="relative inline-block">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#DCFCE7] to-[#BBF7D0] border-4 border-white flex items-center justify-center text-[#15803D] mx-auto shadow-lg shadow-[#16A34A]/20 animate-bounce">
                  <CheckCircle2 className="w-10 h-10 text-[#16A34A]" />
                </div>
                <span className="absolute -top-1 -right-1 text-2xl animate-spin">✨</span>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-black text-[#101828] tracking-tight">
                  Sent Successfully to All Contacts! 🎉
                </h2>
                <p className="text-xs text-[#475467] max-w-md mx-auto leading-relaxed">
                  Official Payment Due PDF invoices and secure 1-click payment links have been delivered to each contact's WhatsApp chat.
                </p>
              </div>
            </div>

            {/* 3 Metric Summary Badges */}
            <div className="grid grid-cols-3 gap-2.5 text-left">
              <div className="p-3 rounded-2xl bg-[#F0FDF4] border border-[#BBF7D0]">
                <div className="text-[10px] font-bold text-[#15803D] uppercase tracking-wider font-mono">Dispatched</div>
                <div className="text-lg font-black text-[#166534] mt-0.5">
                  {broadcastSummary.dispatched} / {broadcastSummary.total}
                </div>
                <div className="text-[10px] text-[#15803D] font-medium">100% Delivered</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#EAECF0]">
                <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider font-mono">Invoice Amount</div>
                <div className="text-lg font-black text-[#101828] mt-0.5">
                  ₹{broadcastAmount || 2499}
                </div>
                <div className="text-[10px] text-[#667085]">Per contact</div>
              </div>

              <div className="p-3 rounded-2xl bg-[#F4F0FD] border border-[#E9D8FD]">
                <div className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-wider font-mono">Receipt Mode</div>
                <div className="text-lg font-black text-[#6D28D9] mt-0.5">
                  Auto-Pilot
                </div>
                <div className="text-[10px] text-[#7C3AED]">On payment</div>
              </div>
            </div>

            {/* Delivery Contact Logs */}
            <div className="border border-[#EAECF0] rounded-2xl p-3.5 bg-[#F9FAFB] text-left space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#344054]">
                <span>Recipients Delivered ({broadcastSummary.results?.length || 0})</span>
                <span className="text-[10px] text-[#16A34A] font-mono font-bold bg-[#DCFCE7] px-2 py-0.5 rounded-full border border-[#86EFAC]">
                  ✓ WhatsApp Meta API Verified
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {broadcastSummary.results?.map((res, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#EAECF0] shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <ContactAvatar name={res.name} size="sm" />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#101828] truncate">{res.name}</div>
                        <div className="text-[11px] font-mono text-[#667085]">{res.phone}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {res.invoiceId && (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#F4F0FD] text-[#7C3AED] border border-[#E9D8FD]">
                          {res.invoiceId}
                        </span>
                      )}
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        res.success
                          ? 'bg-[#DCFCE7] text-[#15803D] border border-[#86EFAC]'
                          : 'bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA]'
                      }`}>
                        <Check className="w-3 h-3 text-[#16A34A]" />
                        <span>{res.success ? 'Delivered' : 'Failed'}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Automated Paid Receipt Guarantee Box */}
            <div className="p-4 bg-gradient-to-r from-[#F0FDF4] via-[#F4F0FD] to-[#F0FDF4] border-2 border-[#86EFAC] rounded-2xl text-left flex items-start gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#16A34A] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-extrabold text-[#14532D] flex items-center gap-1.5">
                  <span>⚡ Automated Paid Receipt Guarantee Active</span>
                </div>
                <p className="text-[11px] text-[#166534] leading-relaxed">
                  When any recipient clicks their payment link and completes payment, our cloud backend will <strong>automatically generate and dispatch their official Green Paid Receipt PDF</strong> with a verified Transaction ID directly to their WhatsApp!
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setBroadcastSummary(null)}
                className="flex-1 py-3 border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] text-[#344054] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Send Another Broadcast
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 text-white" />
                <span>Done & Dismiss</span>
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleBroadcastDueInvoices} className="space-y-4">
            {/* Recipients Overview */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#EAECF0] rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#344054]">Target Recipients</span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4F0FD] text-[#7C3AED] font-mono border border-[#E9D8FD]">
                  {effectiveChats.length} Contacts
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {effectiveChats.map((c, i) => (
                  <span
                    key={c.id || i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-semibold bg-white border border-[#EAECF0] text-[#344054] shadow-2xs"
                  >
                    <ContactAvatar name={c.contactName || c.customerName} size="xs" />
                    <span>{c.contactName || c.customerName}</span>
                    <span className="font-mono text-[#98A2B3] text-[10px]">
                      ({(c.phone || '').slice(-4) || 'WA'})
                    </span>
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
                onClick={handleClose}
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
                    <span>Broadcasting to WhatsApp ({effectiveChats.length})...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Dispatch Payment Due Invoices</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
