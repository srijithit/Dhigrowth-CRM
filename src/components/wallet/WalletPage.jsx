import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  FileText,
  Briefcase,
  Calendar,
  Clock,
  Zap,
  RotateCw,
  ChevronDown,
  Calendar as CalendarIcon,
  CheckCircle2,
  X,
  CreditCard,
  Building,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WalletPage = () => {
  const {
    credits,
    currentPlan,
    daysRemaining,
    claimBonus,
    hasClaimedBonus,
    showToast,
    setActiveTab,
    setIsUpgradeModalOpen,
    setIsUsageModalOpen
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState('payment-history'); // 'payment-history' | 'subscription-history'
  const [selectedType, setSelectedType] = useState('all');
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [fundsAmount, setFundsAmount] = useState('25');

  // Billing Details Form
  const [gstin, setGstin] = useState('27AADCS1234F1Z5');
  const [billingName, setBillingName] = useState('Sri Retail Enterprises');
  const [billingAddress, setBillingAddress] = useState('124, Linking Road, Bandra West, Mumbai, MH - 400050');

  const [walletLogs, setWalletLogs] = useState([
    {
      id: 'log-1',
      date: '2026-09-03',
      type: 'LAUNCH_CREDIT',
      amount: '+$5.00',
      description: 'Promotional $5 launch credit applied to workspace wallet',
    },
  ]);

  const handleAddFundsSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(fundsAmount) || 10;
    const newLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: 'TOP_UP',
      amount: `+$${amountNum.toFixed(2)}`,
      description: `Instant wallet funds top-up via UPI / Credit Card`,
    };
    setWalletLogs((prev) => [newLog, ...prev]);
    setIsAddFundsModalOpen(false);
    showToast(`Added $${amountNum.toFixed(2)} credits to wallet!`, 'success');
  };

  const handleSaveBilling = (e) => {
    e.preventDefault();
    setIsBillingModalOpen(false);
    showToast('GST & Billing details saved for invoices!', 'success');
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-[1300px] mx-auto font-sans">
      {/* 1. Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-[#667085]">
          <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#101828]">
            Dashboard
          </button>
          <span>&gt;</span>
          <span className="text-[#101828] font-semibold">Wallet</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-[#101828] tracking-tight mt-1">
          Wallet
        </h1>
      </div>

      {/* 2. Purple Top AI Credits Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] p-8 text-white flex items-center justify-between shadow-md shadow-purple-600/15">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white/80 uppercase tracking-wider font-mono">
            <DollarSign className="w-3.5 h-3.5" />
            <span>AI CREDITS</span>
          </div>
          <div className="text-4xl lg:text-5xl font-extrabold tracking-tight">
            ${credits.toFixed(0)}
          </div>
        </div>

        <button
          onClick={() => setIsAddFundsModalOpen(true)}
          className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white backdrop-blur-md rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-white/20 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Funds</span>
        </button>
      </div>

      {/* 3. Billing Info Alert Banner */}
      <div className="p-4 rounded-2xl bg-[#FFFDF5] border border-[#FEF0C7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#D97706] shrink-0" />
          <div className="text-xs text-[#475467]">
            <strong className="text-[#101828]">Complete your billing details for invoices.</strong>{' '}
            Required for GST compliance and payment receipts.
          </div>
        </div>

        <button
          onClick={() => setIsBillingModalOpen(true)}
          className="px-4 py-2 bg-[#FAF5EE] hover:bg-[#F2ECE2] border border-[#E8DFC8] text-[#475467] rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-2xs"
        >
          Add Billing Info
        </button>
      </div>

      {/* 4. Subscription Card matching screenshot */}
      <div className="sendiee-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-[#101828]">Subscription</h2>
            <span className="bg-[#F4F0FD] border border-[#E9D8FD] text-[#7C3AED] text-xs font-semibold px-2.5 py-0.5 rounded-full">
              Free Trial · {daysRemaining} days left
            </span>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('usage')}
              className="text-xs font-semibold text-[#7C3AED] hover:underline cursor-pointer"
            >
              View Usage
            </button>
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              Upgrade
            </button>
          </div>
        </div>

        {/* 4-Item Metric Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Plan */}
          <div
            onClick={() => setIsUpgradeModalOpen(true)}
            className="flex items-center gap-3.5 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-11 h-11 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#475467] shrink-0">
              <Briefcase className="w-5 h-5 text-[#475467]" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#667085]">Plan</div>
              <div className="text-sm font-bold text-[#16A34A]">{currentPlan}</div>
            </div>
          </div>

          {/* Billing */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#475467] shrink-0">
              <Calendar className="w-5 h-5 text-[#475467]" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#667085]">Billing</div>
              <div className="text-sm font-bold text-[#101828]">Monthly</div>
            </div>
          </div>

          {/* Days Remaining */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#475467] shrink-0">
              <Clock className="w-5 h-5 text-[#475467]" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#667085]">Days Remaining</div>
              <div className="text-sm font-bold text-[#101828]">{daysRemaining}</div>
            </div>
          </div>

          {/* Auto-Pay */}
          <div
            onClick={() => showToast('Auto-pay will be configurable upon card linkage', 'info')}
            className="flex items-center gap-3.5 cursor-pointer hover:opacity-80"
          >
            <div className="w-11 h-11 rounded-full bg-[#F2F4F7] flex items-center justify-center text-[#475467] shrink-0">
              <Zap className="w-5 h-5 text-[#475467]" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-[#667085]">Auto-Pay</div>
              <div className="text-sm font-medium text-[#667085]">Off</div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Sub-Tabs Bar: Payment History | Subscription History */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveSubTab('payment-history')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'payment-history'
              ? 'bg-white border-[#EAECF0] text-[#101828] shadow-2xs'
              : 'bg-transparent border-transparent text-[#667085] hover:text-[#101828]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Payment History</span>
        </button>

        <button
          onClick={() => setActiveSubTab('subscription-history')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'subscription-history'
              ? 'bg-white border-[#EAECF0] text-[#101828] shadow-2xs'
              : 'bg-transparent border-transparent text-[#667085] hover:text-[#101828]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Subscription History</span>
        </button>
      </div>

      {/* 6. Wallet Logs Table Card */}
      <div className="sendiee-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#7C3AED]" />
            <h2 className="text-base font-bold text-[#101828]">Wallet Logs</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="appearance-none bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-1.5 pr-8 rounded-xl text-xs text-[#344054] font-medium focus:outline-none focus:border-[#7C3AED] cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="topup">Top Up</option>
                <option value="usage">AI Usage Deductions</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#98A2B3] absolute right-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-1.5 rounded-xl text-xs font-mono text-[#667085]">
              <span>19-08-2026</span>
              <span>&rarr;</span>
              <span>03-09-2026</span>
              <CalendarIcon className="w-3.5 h-3.5 text-[#98A2B3]" />
            </div>

            <button
              onClick={() => showToast('Wallet transactions refreshed', 'success')}
              className="p-1.5 rounded-xl border border-[#EAECF0] bg-white text-[#667085] hover:text-[#101828] cursor-pointer"
              title="Refresh logs"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Table Header & Rows */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] border-y border-[#EAECF0] text-[#667085] font-mono text-[10px] uppercase">
              <tr>
                <th className="p-3">DATE</th>
                <th className="p-3">TYPE</th>
                <th className="p-3">AMOUNT</th>
                <th className="p-3">DESCRIPTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAECF0]">
              {walletLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F9FAFB] transition-colors">
                  <td className="p-3 font-mono text-[#667085]">{log.date}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FAF5FF] text-[#7C3AED] border border-[#E9D8FD]">
                      {log.type}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-[#16A34A]">{log.amount}</td>
                  <td className="p-3 text-[#344054]">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Funds Modal */}
      {isAddFundsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in font-sans">
          <div className="bg-white border border-[#EAECF0] rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsAddFundsModalOpen(false)}
              className="absolute top-5 right-5 text-[#98A2B3] hover:text-[#101828]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
                <Plus className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101828]">Top Up AI Credits</h3>
                <p className="text-xs text-[#667085]">Instant credit balance for bot executions & templates</p>
              </div>
            </div>

            <form onSubmit={handleAddFundsSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#344054]">Select Credit Amount ($ USD)</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {['10', '25', '50', '100', '250', '500'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setFundsAmount(amt)}
                      className={`p-2.5 rounded-xl font-bold font-mono text-xs border transition-all cursor-pointer ${
                        fundsAmount === amt
                          ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                          : 'bg-[#F9FAFB] border-[#EAECF0] text-[#344054] hover:bg-[#F2F4F7]'
                      }`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-xs mt-3 cursor-pointer"
              >
                Proceed to Checkout (${fundsAmount})
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Billing Info Modal */}
      {isBillingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in font-sans">
          <div className="bg-white border border-[#EAECF0] rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsBillingModalOpen(false)}
              className="absolute top-5 right-5 text-[#98A2B3] hover:text-[#101828]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
                <Building className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101828]">GST &amp; Invoicing Details</h3>
                <p className="text-xs text-[#667085]">Used to generate tax-compliant invoices</p>
              </div>
            </div>

            <form onSubmit={handleSaveBilling} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#344054]">Company Legal Name</label>
                <input
                  type="text"
                  required
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] p-2.5 rounded-xl text-xs text-[#101828]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#344054]">GSTIN Number</label>
                <input
                  type="text"
                  required
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] p-2.5 rounded-xl text-xs text-[#101828] font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-[#344054]">Billing Address</label>
                <textarea
                  rows={2}
                  required
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] p-2.5 rounded-xl text-xs text-[#101828] resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-xs mt-2 cursor-pointer"
              >
                Save Billing Details
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
