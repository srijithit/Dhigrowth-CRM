import React, { useState } from 'react';
import {
  Zap,
  Activity,
  Check,
  AlertTriangle,
  Plus,
  ArrowUpRight,
  Clock,
  Sparkles,
  Play,
  RotateCw,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AutomationsPage = () => {
  const { showToast, setIsUpgradeModalOpen, setActiveTab } = useApp();

  const [automations, setAutomations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [triggerEvent, setTriggerEvent] = useState('Keyword Match');
  const [actionEvent, setActionEvent] = useState('Send WhatsApp Catalog');

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newAuto = {
      id: `auto-${Date.now()}`,
      name,
      trigger: triggerEvent,
      action: actionEvent,
      status: 'Active',
      runs: 0,
    };

    setAutomations((prev) => [newAuto, ...prev]);
    setName('');
    setIsModalOpen(false);
    showToast(`Created Automation "${name}" successfully!`, 'success');
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-[1300px] mx-auto font-sans">
      {/* 1. Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#667085]">
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#101828]">
              Dashboard
            </button>
            <span>&gt;</span>
            <span className="text-[#101828] font-semibold">Automations</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#101828] tracking-tight mt-1">
            Automations
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Automation</span>
        </button>
      </div>

      {/* 2. Top Metric Allocation Card: TRIGGERS / MONTH */}
      <div className="sendiee-card p-4 flex items-center justify-between max-w-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
            <Zap className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider font-mono">
              TRIGGERS / MONTH
            </div>
            <div className="text-base font-bold text-[#101828]">
              {automations.reduce((acc, a) => acc + a.runs, 0)}{' '}
              <span className="text-[#98A2B3] text-xs font-normal">/ 10,000</span>
            </div>
            <div className="text-[10px] text-[#98A2B3] flex items-center gap-1 font-mono mt-0.5">
              <Clock className="w-3 h-3" />
              <span>Resets in 30 days</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsUpgradeModalOpen(true)}
          className="flex items-center gap-1 text-[11px] font-bold text-[#7C3AED] bg-[#F4F0FD] hover:bg-[#EDE5FA] border border-[#E9D8FD] px-2.5 py-1 rounded-full transition-colors cursor-pointer"
        >
          <ArrowUpRight className="w-3 h-3" />
          <span>Addon</span>
        </button>
      </div>

      {/* 3. Three Status Cards Row: TOTAL | ACTIVE | FAILED */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: TOTAL */}
        <div className="sendiee-card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
            <Activity className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#101828] leading-none">
              {automations.length}
            </div>
            <div className="text-[10px] font-bold font-mono text-[#667085] uppercase mt-1">TOTAL</div>
          </div>
        </div>

        {/* Card 2: ACTIVE */}
        <div className="sendiee-card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center text-[#10B981]">
            <Check className="w-5 h-5 text-[#10B981]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#101828] leading-none">
              {automations.filter((a) => a.status === 'Active').length}
            </div>
            <div className="text-[10px] font-bold font-mono text-[#667085] uppercase mt-1">ACTIVE</div>
          </div>
        </div>

        {/* Card 3: FAILED */}
        <div className="sendiee-card p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#FEF2F2] border border-[#FECACA] flex items-center justify-center text-[#EF4444]">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
          </div>
          <div>
            <div className="text-2xl font-bold text-[#101828] leading-none">
              0
            </div>
            <div className="text-[10px] font-bold font-mono text-[#667085] uppercase mt-1">FAILED</div>
          </div>
        </div>
      </div>

      {/* 4. Main Empty State or List */}
      {automations.length === 0 ? (
        <div className="sendiee-card p-16 flex flex-col items-center justify-center text-center space-y-3 min-h-[380px]">
          {/* Triangular automation icon in purple rounded square */}
          <div className="w-16 h-16 rounded-2xl bg-[#FAF5FF] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="5" r="3" />
              <circle cx="6" cy="19" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M12 8v4" />
              <path d="m8.5 14.5 2.5-2.5" />
              <path d="m15.5 14.5-2.5-2.5" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#101828]">No automations yet</h3>
            <p className="text-xs text-[#667085] max-w-sm">
              Create your first automation to connect events with actions.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <span>Create Automation</span>
          </button>
        </div>
      ) : (
        <div className="sendiee-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAECF0] bg-[#F9FAFB] text-[#667085] font-mono text-[10px] uppercase">
                  <th className="p-4 font-semibold">Automation</th>
                  <th className="p-4 font-semibold">Trigger Event</th>
                  <th className="p-4 font-semibold">Action Executed</th>
                  <th className="p-4 font-semibold">Total Runs</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECF0]">
                {automations.map((a) => (
                  <tr key={a.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="p-4 font-bold text-[#101828]">{a.name}</td>
                    <td className="p-4 text-[#475467] font-mono">{a.trigger}</td>
                    <td className="p-4 text-[#7C3AED] font-mono font-semibold">{a.action}</td>
                    <td className="p-4 font-mono font-bold text-[#101828]">{a.runs}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A]">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Automation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in font-sans">
          <div className="bg-white border border-[#EAECF0] rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 text-[#98A2B3] hover:text-[#101828] p-1.5 rounded-xl hover:bg-[#F9FAFB] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
                <Zap className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101828]">Create New Automation</h3>
                <p className="text-xs text-[#667085]">Connect trigger events to instant actions</p>
              </div>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#475467]">Automation Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Instant COD Order Tagging"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475467]">When this happens (Trigger):</label>
                <select
                  value={triggerEvent}
                  onChange={(e) => setTriggerEvent(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="Keyword Match">Customer sends keyword (e.g. "Price", "COD")</option>
                  <option value="Stage Changed">Lead moves to Hot Lead stage</option>
                  <option value="Cart Abandoned">Shopify Cart Abandoned</option>
                  <option value="Form Submitted">Meta Lead Ad Form Submitted</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475467]">Then do this (Action):</label>
                <select
                  value={actionEvent}
                  onChange={(e) => setActionEvent(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="Send WhatsApp Catalog">Send WhatsApp Product Catalog</option>
                  <option value="Assign to Agent">Assign conversation to Human Agent</option>
                  <option value="Fire Meta CAPI Event">Fire Meta CAPI Purchase Event</option>
                  <option value="Apply Discount Tag">Apply 10% Discount Coupon Tag</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-xs mt-2 cursor-pointer"
              >
                Deploy & Activate Automation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
