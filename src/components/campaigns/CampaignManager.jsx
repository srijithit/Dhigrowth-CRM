import React, { useState } from 'react';
import {
  Rocket,
  Plus,
  Search,
  ChevronDown,
  Calendar,
  RotateCw,
  ArrowUpRight,
  Clock,
  LayoutGrid,
  Send,
  CheckCircle2,
  MessageSquare,
  Info,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CampaignManager = () => {
  const { campaigns, createCampaign, showToast, setIsUpgradeModalOpen, setActiveTab } = useApp();

  const [campaignList, setCampaignList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [formName, setFormName] = useState('');
  const [formChannel, setFormChannel] = useState('WhatsApp');
  const [formAudience, setFormAudience] = useState('VIP Customers & Hot Leads');

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newCamp = {
      id: `camp-${Date.now()}`,
      name: formName,
      channel: formChannel,
      audience: formAudience,
      sent: 2450,
      delivered: 2410,
      read: 2310,
      replied: 840,
      revenue: '₹1,24,000',
      roas: '14.2x',
      status: 'Live & Active',
    };

    setCampaignList((prev) => [newCamp, ...prev]);
    createCampaign(newCamp);
    setFormName('');
    setIsModalOpen(false);
    showToast(`Created Broadcast Campaign "${formName}" successfully!`, 'success');
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
            <span className="text-[#101828] font-semibold">Campaign Manager</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#101828] tracking-tight mt-1">
            Campaign Manager
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Campaign</span>
        </button>
      </div>

      {/* 2. Top Monthly Allocation Cards (2 Cards Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: CAMPAIGNS / MONTH */}
        <div className="sendiee-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
              <Send className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider font-mono">
                CAMPAIGNS / MONTH
              </div>
              <div className="text-base font-bold text-[#101828]">
                {campaignList.length} <span className="text-[#98A2B3] text-xs font-normal">/ 300</span>
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

        {/* Card 2: CONVERSATIONS / MONTH */}
        <div className="sendiee-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
              <MessageSquare className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider font-mono">
                CONVERSATIONS / MONTH
              </div>
              <div className="text-base font-bold text-[#101828]">
                0 <span className="text-[#98A2B3] text-xs font-normal">/ 1,000,000</span>
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
      </div>

      {/* 3. Four Metric Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: CAMPAIGNS */}
        <div className="sendiee-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] flex items-center justify-center text-[#7C3AED]">
            <LayoutGrid className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider font-mono">
              CAMPAIGNS
            </div>
            <div className="text-xl font-bold text-[#101828]">{campaignList.length}</div>
          </div>
        </div>

        {/* Card 2: MESSAGES SENT */}
        <div className="sendiee-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F4F0FD] flex items-center justify-center text-[#7C3AED]">
            <Send className="w-5 h-5 text-[#7C3AED]" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider font-mono">
              MESSAGES SENT
            </div>
            <div className="text-xl font-bold text-[#101828]">0</div>
          </div>
        </div>

        {/* Card 3: AVG SUCCESS */}
        <div className="sendiee-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] flex items-center justify-center text-[#0284C7]">
            <CheckCircle2 className="w-5 h-5 text-[#0284C7]" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider font-mono">
              AVG SUCCESS
            </div>
            <div className="text-xl font-bold text-[#101828]">0%</div>
          </div>
        </div>

        {/* Card 4: REPLIES */}
        <div className="sendiee-card p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-[#10B981]">
            <MessageSquare className="w-5 h-5 text-[#10B981]" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#667085] uppercase tracking-wider font-mono flex items-center gap-1">
              <span>REPLIES</span>
              <Info className="w-3 h-3 text-[#98A2B3]" />
            </div>
            <div className="text-xl font-bold text-[#101828]">0</div>
          </div>
        </div>
      </div>

      {/* 4. Filter Toolbar */}
      <div className="sendiee-card p-3 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
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

          {/* All Status Dropdown */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-1.5 pr-8 rounded-xl text-xs text-[#344054] font-medium focus:outline-none focus:border-[#7C3AED] cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active & Live</option>
              <option value="draft">Drafts</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#98A2B3] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>

          {/* Date Picker Button */}
          <button className="flex items-center gap-2 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-1.5 rounded-xl text-xs text-[#667085] hover:text-[#101828]">
            <span>Start date</span>
            <span>&rarr;</span>
            <span>End date</span>
            <Calendar className="w-3.5 h-3.5 text-[#98A2B3]" />
          </button>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => showToast('Campaign analytics refreshed', 'info')}
          className="flex items-center gap-1.5 bg-[#F9FAFB] hover:bg-[#F2F4F7] border border-[#EAECF0] px-3.5 py-1.5 rounded-xl text-xs font-semibold text-[#475467] hover:text-[#101828] transition-colors cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#667085]" />
          <span>Refresh</span>
        </button>
      </div>

      {/* 5. Main Empty State matching screenshot */}
      {campaignList.length === 0 ? (
        <div className="sendiee-card p-16 flex flex-col items-center justify-center text-center space-y-3 min-h-[380px]">
          <div className="w-16 h-16 rounded-full bg-[#FAF5FF] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
            <Rocket className="w-8 h-8 text-[#7C3AED]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#101828]">No campaigns yet</h3>
            <p className="text-xs text-[#667085] max-w-sm">
              Reach your audience instantly. Create your first WhatsApp campaign and start sending in minutes.
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
        <div className="sendiee-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAECF0] bg-[#F9FAFB] text-[#667085] font-mono text-[10px] uppercase">
                  <th className="p-4 font-semibold">Campaign</th>
                  <th className="p-4 font-semibold">Audience</th>
                  <th className="p-4 font-semibold">Delivered</th>
                  <th className="p-4 font-semibold">Replied</th>
                  <th className="p-4 font-semibold">Revenue</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECF0]">
                {campaignList.map((camp) => (
                  <tr key={camp.id} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="p-4 font-bold text-[#101828]">{camp.name}</td>
                    <td className="p-4 text-[#475467] font-mono">{camp.audience}</td>
                    <td className="p-4 font-mono font-bold text-[#101828]">{camp.delivered}</td>
                    <td className="p-4 font-mono font-bold text-[#7C3AED]">{camp.replied}</td>
                    <td className="p-4 font-mono font-bold text-[#16A34A]">{camp.revenue}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DCFCE7] text-[#16A34A]">
                        {camp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Campaign Modal */}
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
                <Send className="w-5 h-5 text-[#7C3AED]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#101828]">Create Broadcast Campaign</h3>
                <p className="text-xs text-[#667085]">Instant WhatsApp Cloud API Message Blast</p>
              </div>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#475467]">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VIP Festive Flash Sale"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475467]">Channel</label>
                <select
                  value={formChannel}
                  onChange={(e) => setFormChannel(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="WhatsApp">WhatsApp Cloud API</option>
                  <option value="Instagram">Instagram Direct</option>
                  <option value="Messenger">Messenger</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#475467]">Target Audience Segment</label>
                <select
                  value={formAudience}
                  onChange={(e) => setFormAudience(e.target.value)}
                  className="w-full mt-1 bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-2 rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                >
                  <option value="VIP Customers & Hot Leads">🔥 VIP Customers & Hot Leads (2,450 contacts)</option>
                  <option value="Abandoned Cart in Last 7 Days">🛒 Abandoned Cart in Last 7 Days (1,120 contacts)</option>
                  <option value="All Verified Customers">👥 All Verified Customers (4,890 contacts)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-xs mt-2 cursor-pointer"
              >
                Schedule & Dispatch Campaign
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
