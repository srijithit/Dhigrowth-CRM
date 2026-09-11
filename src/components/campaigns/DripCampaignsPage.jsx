import React, { useState } from 'react';
import {
  Droplets,
  Plus,
  Search,
  ChevronDown,
  Info,
  Settings,
  ArrowUpRight,
  Sparkles,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DripCampaignsPage = () => {
  const { showToast, setIsUpgradeModalOpen, setActiveTab } = useApp();

  const [dripList, setDripList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const [dripName, setDripName] = useState('');
  const [triggerStage, setTriggerStage] = useState('Hot');
  const [delayDays, setDelayDays] = useState('1');

  const handleCreateDrip = (e) => {
    e.preventDefault();
    if (!dripName.trim()) return;

    const newDrip = {
      id: `drip-${Date.now()}`,
      name: dripName,
      trigger: triggerStage,
      delay: `${delayDays} day(s)`,
      status: 'Active',
      enrolled: 0,
    };

    setDripList((prev) => [newDrip, ...prev]);
    setDripName('');
    setIsModalOpen(false);
    showToast(`Drip automation "${dripName}" activated!`, 'success');
  };

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-[1300px] mx-auto font-sans">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#667085]">
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#101828]">
              Dashboard
            </button>
            <span>&gt;</span>
            <span className="text-[#101828] font-semibold">Drip Campaigns</span>
          </div>
          <h1 className="text-2xl font-bold text-[#101828] tracking-tight mt-1">
            Drip Campaigns
          </h1>
          <p className="text-xs text-[#667085] mt-0.5">
            Automated message sequences triggered by lead category changes
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => showToast('Starting Drip Campaigns guided tour', 'info')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAECF0] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#475467] transition-colors cursor-pointer shadow-2xs"
          >
            <Info className="w-3.5 h-3.5 text-[#667085]" />
            <span>Tour</span>
          </button>

          <button
            onClick={() => showToast('Opening Drip Automation Settings', 'info')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAECF0] bg-white hover:bg-[#F9FAFB] text-xs font-semibold text-[#475467] transition-colors cursor-pointer shadow-2xs"
          >
            <Settings className="w-3.5 h-3.5 text-[#667085]" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Drip Campaign</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Bar Card: DRIP CAMPAIGNS 0 / 10 */}
      <div className="sendiee-card p-4 flex items-center justify-between max-w-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
            <Droplets className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider font-mono">
              DRIP CAMPAIGNS
            </div>
            <div className="text-base font-bold text-[#101828]">
              {dripList.length} <span className="text-[#98A2B3] text-xs font-normal">/ 10</span>
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

      {/* 3. Toolbar: Search | All Categories */}
      <div className="sendiee-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-[#98A2B3] absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#EAECF0] pl-9 pr-3.5 py-1.5 rounded-xl text-xs text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div className="relative">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="appearance-none bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-1.5 pr-8 rounded-xl text-xs text-[#344054] font-medium focus:outline-none focus:border-[#7C3AED] cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="lead_stage">Lead Stage Nurturing</option>
              <option value="cart_recovery">Cart Recovery</option>
              <option value="post_purchase">Post-Purchase Re-order</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#98A2B3] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. Empty State matching screenshot */}
      {dripList.length === 0 ? (
        <div className="sendiee-card p-16 flex flex-col items-center justify-center text-center space-y-3 min-h-[380px]">
          <div className="w-16 h-16 rounded-full bg-[#FAF5FF] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
            <Droplets className="w-8 h-8 text-[#7C3AED]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#101828]">No drip campaigns yet</h3>
            <p className="text-xs text-[#667085] max-w-sm">
              Create your first drip campaign to automatically send message sequences when contacts are categorized into different lead stages.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Campaign</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dripList.map((drip) => (
            <div key={drip.id} className="sendiee-card p-5 space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#101828]">{drip.name}</span>
                  <span className="text-[10px] font-mono font-bold bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded-full">
                    {drip.status}
                  </span>
                </div>
                <p className="text-xs text-[#667085] mt-1">
                  Triggered when lead moves to <strong>{drip.trigger}</strong> stage.
                </p>
              </div>
              <div className="pt-2 border-t border-[#F2F4F7] flex justify-between items-center text-[11px] text-[#667085] font-mono">
                <span>Delay: {drip.delay}</span>
                <span className="text-[#7C3AED] font-bold">{drip.enrolled} enrolled</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Drip Modal */}
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
                <Droplets className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101828]">New Drip Sequence</h3>
                <p className="text-xs text-[#667085]">Trigger multi-day automated WhatsApp nurturing</p>
              </div>
            </div>

            <form onSubmit={handleCreateDrip} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#475467]">Drip Sequence Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3-Day Abandoned Cart Sequence"
                  value={dripName}
                  onChange={(e) => setDripName(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475467]">Trigger Lead Stage</label>
                <select
                  value={triggerStage}
                  onChange={(e) => setTriggerStage(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="Hot">🔥 Hot Lead</option>
                  <option value="Interested">Product Interested</option>
                  <option value="Cold">Cold / Dormant Contact</option>
                  <option value="Converted">Post-Purchase Re-order</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475467]">Dispatch Delay</label>
                <select
                  value={delayDays}
                  onChange={(e) => setDelayDays(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="1">After 1 Day</option>
                  <option value="2">After 2 Days</option>
                  <option value="3">After 3 Days</option>
                  <option value="7">After 7 Days</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-xs mt-2 cursor-pointer"
              >
                Activate Drip Campaign
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
