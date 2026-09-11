import React, { useState } from 'react';
import {
  BarChart3,
  DollarSign,
  MessageSquare,
  Sparkles,
  Bot,
  Mail,
  Flame,
  Users,
  RotateCw,
  Globe,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Zap,
  Activity,
  Calendar,
  Send,
  Radio,
  FileText,
  PieChart as PieIcon,
  Headphones
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InsightsPage = () => {
  const { showToast, setActiveTab } = useApp();

  const [demoData, setDemoData] = useState(false);
  const [platform, setPlatform] = useState('all');
  const [timeRange, setTimeRange] = useState('30d');
  const [creditsInterval, setCreditsInterval] = useState('Daily');
  const [spendInterval, setSpendInterval] = useState('Daily');
  const [convInterval, setConvInterval] = useState('Daily');
  const [aiUsageInterval, setAiUsageInterval] = useState('Daily');

  const PLATFORMS = [
    { id: 'all', label: 'All Platforms', icon: Globe },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'instagram', label: 'Instagram', icon: Activity },
    { id: 'messenger', label: 'Messenger', icon: Zap },
    { id: 'line', label: 'LINE', icon: Bot },
  ];

  // Heatmap Days & Hours
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const HOURS = [
    '12a', '1a', '2a', '3a', '4a', '5a', '6a', '7a', '8a', '9a', '10a', '11a',
    '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p', '8p', '9p', '10p', '11p'
  ];

  // Helper to generate simulated heatmap intensity
  const getHeatmapColor = (dayIdx, hourIdx) => {
    if (!demoData) return 'bg-[#FAF8F5] border border-[#EBE7E0]';
    // Peak hours around 10am - 8pm on weekdays
    const isPeakTime = hourIdx >= 10 && hourIdx <= 20 && dayIdx >= 1 && dayIdx <= 5;
    if (isPeakTime) {
      if ((hourIdx + dayIdx) % 3 === 0) return 'bg-[#7C3AED] border border-[#6D28D9]';
      if ((hourIdx + dayIdx) % 2 === 0) return 'bg-[#9333EA] border border-[#7E22CE]';
      return 'bg-[#C084FC] border border-[#A855F7]';
    }
    const isMidTime = (hourIdx >= 8 && hourIdx < 10) || (hourIdx > 20 && hourIdx <= 22);
    if (isMidTime) {
      return (hourIdx + dayIdx) % 2 === 0 ? 'bg-[#E9D5FF] border border-[#D8B4FE]' : 'bg-[#FAF8F5] border border-[#EBE7E0]';
    }
    return 'bg-[#FAF8F5] border border-[#EBE7E0]';
  };

  const TOP_USERS_DEMO = [
    { rank: 1, name: 'Priya Sharma', phone: '+91 97914 71277', channel: 'WhatsApp', msgs: 142, convs: 18, spend: '$4.82' },
    { rank: 2, name: 'David Miller', phone: '+1 415 892 4192', channel: 'Instagram', msgs: 98, convs: 14, spend: '$3.15' },
    { rank: 3, name: 'Tariq Al-Mansoor', phone: '+971 50 234 8910', channel: 'WhatsApp', msgs: 84, convs: 11, spend: '$2.70' },
    { rank: 4, name: 'Aarav Patel', phone: '+91 98201 44521', channel: 'WhatsApp', msgs: 76, convs: 9, spend: '$2.45' },
    { rank: 5, name: 'Elena Rostova', phone: '+44 20 7946 0912', channel: 'Messenger', msgs: 65, convs: 8, spend: '$2.10' },
    { rank: 6, name: 'Kenji Sato', phone: '+81 90 1234 5678', channel: 'LINE', msgs: 54, convs: 7, spend: '$1.75' },
    { rank: 7, name: 'Ananya Deshmukh', phone: '+91 91672 88401', channel: 'WhatsApp', msgs: 48, convs: 6, spend: '$1.55' },
    { rank: 8, name: 'Lucas Silva', phone: '+55 11 98765 4321', channel: 'Instagram', msgs: 42, convs: 5, spend: '$1.35' },
    { rank: 9, name: 'Fatima Zahra', phone: '+971 52 876 5432', channel: 'WhatsApp', msgs: 36, convs: 4, spend: '$1.15' },
    { rank: 10, name: 'Marcus Chen', phone: '+65 9123 4567', channel: 'Messenger', msgs: 30, convs: 4, spend: '$0.95' },
  ];

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-[1300px] mx-auto font-sans">
      {/* 1. Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-medium text-[#667085]">
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#101828]">
              Dashboard
            </button>
            <span>&gt;</span>
            <span className="text-[#101828] font-semibold">Insights</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#101828] tracking-tight mt-1">
            Insights
          </h1>
        </div>

        {/* Demo Data Switch + Refresh */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#EAECF0] px-3.5 py-1.5 rounded-2xl shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span className="text-xs font-semibold text-[#344054]">Demo data</span>
            <button
              onClick={() => {
                const nextState = !demoData;
                setDemoData(nextState);
                showToast(nextState ? 'Loaded demo analytics mode' : 'Showing live workspace metrics', 'info');
              }}
              className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                demoData ? 'bg-[#7C3AED]' : 'bg-[#EAECF0]'
              }`}
            >
              <div
                className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                  demoData ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => showToast('Analytics data refreshed', 'success')}
            className="flex items-center gap-1.5 bg-white hover:bg-[#F9FAFB] border border-[#EAECF0] px-3.5 py-1.5 rounded-2xl text-xs font-semibold text-[#344054] hover:text-[#101828] transition-colors cursor-pointer shadow-2xs"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#667085]" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Platform Bar & Date Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Platform Selector */}
        <div className="flex items-center gap-1 bg-[#F9FAFB] border border-[#EAECF0] p-1 rounded-2xl overflow-x-auto">
          {PLATFORMS.map((p) => {
            const Icon = p.icon;
            const isActive = platform === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-white text-[#7C3AED] shadow-2xs font-bold'
                    : 'text-[#667085] hover:text-[#101828]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#7C3AED]' : 'text-[#667085]'}`} />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Date Selector */}
        <div className="relative">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none bg-white border border-[#EAECF0] px-4 py-2 pr-9 rounded-2xl text-xs font-bold text-[#101828] focus:outline-none focus:border-[#7C3AED] shadow-2xs cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="month">This Month</option>
          </select>
          <ChevronDown className="w-4 h-4 text-[#98A2B3] absolute right-3 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* 3. Timezone Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-[#FAF5FF] border border-[#E9D8FD] flex items-center justify-between text-xs text-[#6941C6]">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#7C3AED] shrink-0" />
          <span>
            All data is displayed in timezone: <strong>Asia/Calcutta</strong>
          </span>
        </div>
        <button
          onClick={() => showToast('Timezone is synchronized to your browser settings', 'info')}
          className="font-bold text-[#7C3AED] hover:underline cursor-pointer"
        >
          Update timezone
        </button>
      </div>

      {/* 4. Demo Mode Notice Banner (Visible when demoData is ON) */}
      {demoData && (
        <div className="p-3.5 rounded-2xl bg-[#F6F3FF] border border-[#E9D8FD] flex items-center justify-between text-xs text-[#7C3AED] animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#7C3AED] shrink-0" />
            <span>
              <strong>Demo Mode:</strong> This is simulated data to preview analytics features. Toggle off to view real data.
            </span>
          </div>
        </div>
      )}

      {/* =========================================================
          SECTION 1: CREDITS & COST
      ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#101828]">
          <div className="w-5 h-5 rounded-full bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
            <DollarSign className="w-3.5 h-3.5" />
          </div>
          <h2>Credits & Cost</h2>
        </div>

        {/* Row 1: AI Credits Consumed (Left) + Cost by AI Process (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card: AI Credits Consumed (7 cols) */}
          <div className="lg:col-span-7 sendiee-card p-6 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#101828]">
                <TrendingUp className="w-4 h-4 text-[#7C3AED]" />
                <span>AI Credits Consumed</span>
              </div>

              <div className="flex items-center bg-[#F9FAFB] border border-[#EAECF0] p-0.5 rounded-xl text-[10px] font-semibold">
                {['Daily', 'Weekly', 'Monthly'].map((i) => (
                  <button
                    key={i}
                    onClick={() => setCreditsInterval(i)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      creditsInterval === i
                        ? 'bg-white text-[#7C3AED] shadow-2xs font-bold'
                        : 'text-[#667085]'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div>
                <strong className="text-base font-bold text-[#101828]">
                  {demoData ? '167.62' : '$0.00'}
                </strong>{' '}
                <span className="text-[#667085]">Total Credits</span>
              </div>
              <div>
                <strong className="text-base font-bold text-[#101828]">
                  {demoData ? '104' : '0'}
                </strong>{' '}
                <span className="text-[#667085]">Conversations</span>
              </div>
            </div>

            {/* Chart Area */}
            <div className="h-44 flex items-center justify-center border border-dashed border-[#EAECF0] rounded-2xl bg-[#FAF8F5] overflow-hidden p-2">
              {demoData ? (
                <div className="w-full h-full flex flex-col justify-end relative">
                  <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="purpleArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,90 Q40,65 80,75 T160,50 T240,65 T320,35 T400,60 T500,20 L500,120 L0,120 Z"
                      fill="url(#purpleArea)"
                    />
                    <path
                      d="M0,90 Q40,65 80,75 T160,50 T240,65 T320,35 T400,60 T500,20"
                      fill="none"
                      stroke="#7C3AED"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <div className="flex justify-between text-[9px] font-mono text-[#98A2B3] px-2 pt-1 border-t border-[#EAECF0]">
                    <span>1 Sep</span>
                    <span>8 Sep</span>
                    <span>15 Sep</span>
                    <span>22 Sep</span>
                    <span>30 Sep</span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-1 text-xs text-[#98A2B3]">
                  <BarChart3 className="w-8 h-8 mx-auto text-[#D0D5DD]" />
                  <div>No data available for the selected period.</div>
                </div>
              )}
            </div>
          </div>

          {/* Card: Cost by AI Process (5 cols) */}
          <div className="lg:col-span-5 sendiee-card p-6 space-y-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#101828]">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span>Cost by AI Process</span>
            </div>

            <div className="h-44 flex items-center justify-center border border-dashed border-[#EAECF0] rounded-2xl bg-[#FAF8F5]">
              {demoData ? (
                <div className="w-full flex items-center justify-around p-3 gap-4">
                  {/* SVG Donut Chart */}
                  <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#7C3AED" strokeWidth="4.5" strokeDasharray="52.6 47.4" strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="28.5 71.5" strokeDashoffset="-52.6" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray="11.2 88.8" strokeDashoffset="-81.1" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#EC4899" strokeWidth="4.5" strokeDasharray="7.7 92.3" strokeDashoffset="-92.3" />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-xs font-bold text-[#101828] font-mono">$62.83</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-1.5 text-[11px] font-medium text-[#344054]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                      <span>General Chat: <strong>52.6%</strong> ($33.05)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                      <span>Follow-Up: <strong>28.5%</strong> ($17.91)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span>Lead Segment: <strong>11.2%</strong> ($7.04)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#EC4899]" />
                      <span>Sen AI: <strong>7.7%</strong> ($4.83)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-1 text-xs text-[#98A2B3]">
                  <BarChart3 className="w-8 h-8 mx-auto text-[#D0D5DD]" />
                  <div>No data available for the selected period.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Amount Spent Over Time (Full Width) */}
        <div className="sendiee-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#101828]">
              <DollarSign className="w-4 h-4 text-[#7C3AED]" />
              <span>Amount Spent Over Time</span>
            </div>

            <div className="flex items-center bg-[#F9FAFB] border border-[#EAECF0] p-0.5 rounded-xl text-[10px] font-semibold">
              {['Daily', 'Weekly', 'Monthly'].map((i) => (
                <button
                  key={i}
                  onClick={() => setSpendInterval(i)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    spendInterval === i
                      ? 'bg-white text-[#7C3AED] shadow-2xs font-bold'
                      : 'text-[#667085]'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Color-coded Legend Stats */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div>
              <strong className="font-bold text-[#101828] text-sm">
                {demoData ? '$72.86' : '$0.00'}
              </strong>{' '}
              <span className="text-[#667085] font-sans">Total Spend</span>
            </div>
            <div className="text-[#7C3AED]">
              <strong className="font-bold">{demoData ? '$33.05' : '$0.00'}</strong>{' '}
              <span className="font-sans">General Chat</span>
            </div>
            <div className="text-[#F59E0B]">
              <strong className="font-bold">{demoData ? '$17.91' : '$0.00'}</strong>{' '}
              <span className="font-sans">Follow-Up</span>
            </div>
            <div className="text-[#10B981]">
              <strong className="font-bold">{demoData ? '$15.00' : '$0.00'}</strong>{' '}
              <span className="font-sans">Lead Segmentation</span>
            </div>
            <div className="text-[#EC4899]">
              <strong className="font-bold">{demoData ? '$6.90' : '$0.00'}</strong>{' '}
              <span className="font-sans">Sen AI</span>
            </div>
          </div>

          <div className="h-44 flex items-center justify-center border border-dashed border-[#EAECF0] rounded-2xl bg-[#FAF8F5] overflow-hidden p-2">
            {demoData ? (
              <div className="w-full h-full flex flex-col justify-end relative">
                <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                  {/* Line 1: General Chat (Purple) */}
                  <path d="M0,80 Q50,40 100,60 T200,45 T300,70 T400,30 T500,25" fill="none" stroke="#7C3AED" strokeWidth="2.5" />
                  {/* Line 2: Follow-Up (Orange) */}
                  <path d="M0,95 Q50,75 100,85 T200,65 T300,85 T400,50 T500,45" fill="none" stroke="#F59E0B" strokeWidth="2" />
                  {/* Line 3: Lead Segmentation (Green) */}
                  <path d="M0,105 Q50,90 100,98 T200,80 T300,95 T400,70 T500,60" fill="none" stroke="#10B981" strokeWidth="2" />
                  {/* Line 4: Sen AI (Pink) */}
                  <path d="M0,112 Q50,105 100,108 T200,95 T300,105 T400,85 T500,80" fill="none" stroke="#EC4899" strokeWidth="1.5" />
                </svg>
                <div className="flex justify-between text-[9px] font-mono text-[#98A2B3] px-2 pt-1 border-t border-[#EAECF0]">
                  <span>1 Sep</span>
                  <span>8 Sep</span>
                  <span>15 Sep</span>
                  <span>22 Sep</span>
                  <span>30 Sep</span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-1 text-xs text-[#98A2B3]">
                <BarChart3 className="w-8 h-8 mx-auto text-[#D0D5DD]" />
                <div>No data available for the selected period.</div>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Three Sub Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Avg Spend / Conversation */}
          <div className="sendiee-card p-5 space-y-2">
            <div className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Avg Spend / Conversation</span>
            </div>
            <div className="text-2xl font-bold text-[#101828]">
              {demoData ? '$0.67' : '$0.00'}
            </div>
            <div className="text-xs text-[#667085]">
              {demoData ? 'Average spend per conversation' : 'No data available for this period.'}
            </div>
          </div>

          {/* Card 2: Cost by Platform */}
          <div className="sendiee-card p-5 space-y-2">
            <div className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Cost by Platform</span>
            </div>
            {demoData ? (
              <div className="text-xs space-y-1.5 pt-1">
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="font-semibold text-[#16A34A]">WhatsApp</span>
                    <span className="font-mono font-bold">$41.80</span>
                  </div>
                  <div className="w-full bg-[#EAECF0] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#22C55E] h-full" style={{ width: '66%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="font-semibold text-[#E1306C]">Instagram</span>
                    <span className="font-mono font-bold">$12.50</span>
                  </div>
                  <div className="w-full bg-[#EAECF0] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#E1306C] h-full" style={{ width: '20%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="font-semibold text-[#0866FF]">Messenger</span>
                    <span className="font-mono font-bold">$7.25</span>
                  </div>
                  <div className="w-full bg-[#EAECF0] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#0866FF] h-full" style={{ width: '11%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="font-semibold text-[#00B900]">LINE</span>
                    <span className="font-mono font-bold">$1.28</span>
                  </div>
                  <div className="w-full bg-[#EAECF0] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#00B900] h-full" style={{ width: '3%' }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#98A2B3] pt-2">No data available for the selected period.</div>
            )}
          </div>

          {/* Card 3: Cost vs Last Period */}
          <div className="sendiee-card p-5 space-y-2">
            <div className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Cost vs Last Period</span>
            </div>
            {demoData ? (
              <div className="space-y-1.5 pt-1 text-xs">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#101828]">$62.83</span>
                  <span className="text-xs text-[#16A34A] font-bold">+39.3%</span>
                </div>
                <div className="text-[11px] text-[#667085]">
                  Previous period: <strong className="text-[#101828] font-mono">$45.10</strong>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-xs text-[#667085]">
                  This period: <strong className="text-[#101828]">$0.00</strong> | <strong className="text-[#101828]">$0.00</strong> Total Cost
                </div>
                <div className="text-xs text-[#98A2B3] pt-2">No data available for the selected period.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 2: CONVERSATIONS
      ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#101828]">
          <div className="w-5 h-5 rounded-full bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
          <h2>Conversations</h2>
        </div>

        {/* Row 1: Conversations Trend (7 cols) + Conversations by Platform (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 sendiee-card p-6 space-y-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#101828]">
                <MessageSquare className="w-4 h-4 text-[#7C3AED]" />
                <span>Conversations Trend</span>
              </div>

              <div className="flex items-center bg-[#F9FAFB] border border-[#EAECF0] p-0.5 rounded-xl text-[10px] font-semibold">
                {['Daily', 'Weekly', 'Monthly'].map((i) => (
                  <button
                    key={i}
                    onClick={() => setConvInterval(i)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      convInterval === i
                        ? 'bg-white text-[#7C3AED] shadow-2xs font-bold'
                        : 'text-[#667085]'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs">
              <strong className="text-base font-bold text-[#101828]">
                {demoData ? '104' : '0'}
              </strong>{' '}
              <span className="text-[#667085]">Total Conversations</span>
            </div>

            <div className="h-44 flex items-center justify-center border border-dashed border-[#EAECF0] rounded-2xl bg-[#FAF8F5] overflow-hidden p-2">
              {demoData ? (
                <div className="w-full h-full flex flex-col justify-end relative">
                  <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="blueArea" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0284C7" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,80 Q50,70 100,55 T200,60 T300,40 T400,65 T500,30 L500,120 L0,120 Z"
                      fill="url(#blueArea)"
                    />
                    <path
                      d="M0,80 Q50,70 100,55 T200,60 T300,40 T400,65 T500,30"
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="2.5"
                    />
                  </svg>
                  <div className="flex justify-between text-[9px] font-mono text-[#98A2B3] px-2 pt-1 border-t border-[#EAECF0]">
                    <span>1 Sep</span>
                    <span>8 Sep</span>
                    <span>15 Sep</span>
                    <span>22 Sep</span>
                    <span>30 Sep</span>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-1 text-xs text-[#98A2B3]">
                  <BarChart3 className="w-8 h-8 mx-auto text-[#D0D5DD]" />
                  <div>No data available for the selected period.</div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 sendiee-card p-6 space-y-4 flex flex-col justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#101828]">
              <Globe className="w-4 h-4 text-[#7C3AED]" />
              <span>Conversations by Platform</span>
            </div>

            <div className="h-44 flex items-center justify-center border border-dashed border-[#EAECF0] rounded-2xl bg-[#FAF8F5]">
              {demoData ? (
                <div className="w-full flex items-center justify-around p-3 gap-4">
                  {/* SVG Donut Chart */}
                  <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#22C55E" strokeWidth="4.5" strokeDasharray="68.3 31.7" strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#E1306C" strokeWidth="4.5" strokeDasharray="18.3 81.7" strokeDashoffset="-68.3" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#0866FF" strokeWidth="4.5" strokeDasharray="9.6 90.4" strokeDashoffset="-86.6" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#00B900" strokeWidth="4.5" strokeDasharray="3.8 96.2" strokeDashoffset="-96.2" />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-xs font-bold text-[#101828] font-mono">104</span>
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="space-y-1.5 text-[11px] font-medium text-[#344054]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                      <span>WhatsApp: <strong>68.3%</strong> (71)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E1306C]" />
                      <span>Instagram: <strong>18.3%</strong> (19)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0866FF]" />
                      <span>Messenger: <strong>9.6%</strong> (10)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#00B900]" />
                      <span>LINE: <strong>3.8%</strong> (4)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-1 text-xs text-[#98A2B3]">
                  <BarChart3 className="w-8 h-8 mx-auto text-[#D0D5DD]" />
                  <div>No data available for the selected period.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Two Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="sendiee-card p-5 space-y-3">
            <div className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Avg Messages / Conversation</span>
            </div>
            <div className="text-2xl font-bold text-[#101828]">
              {demoData ? '16.4' : '0.0'}
            </div>
            {demoData ? (
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-[#16A34A] font-semibold">WhatsApp: 18.2 msgs</span>
                  <span className="text-[#E1306C] font-semibold">Instagram: 14.5 msgs</span>
                </div>
                <div className="w-full bg-[#EAECF0] h-1.5 rounded-full overflow-hidden flex">
                  <div className="bg-[#22C55E] h-full" style={{ width: '55%' }} />
                  <div className="bg-[#E1306C] h-full" style={{ width: '35%' }} />
                  <div className="bg-[#0866FF] h-full" style={{ width: '10%' }} />
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#98A2B3]">No data available for the selected period.</div>
            )}
          </div>

          <div className="sendiee-card p-5 space-y-3">
            <div className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Avg Conversation Duration</span>
            </div>
            <div className="text-2xl font-bold text-[#101828]">
              {demoData ? '8m 12s' : '0m 0s'}
            </div>
            {demoData ? (
              <div className="flex items-end gap-2 h-10 pt-1">
                <div className="flex-1 bg-[#0284C7] rounded-t" style={{ height: '35%' }} title="< 1 min" />
                <div className="flex-1 bg-[#0284C7] rounded-t" style={{ height: '70%' }} title="1-5 min" />
                <div className="flex-1 bg-[#0284C7] rounded-t" style={{ height: '100%' }} title="5-15 min" />
                <div className="flex-1 bg-[#0284C7] rounded-t" style={{ height: '45%' }} title="15-30 min" />
                <div className="flex-1 bg-[#0284C7] rounded-t" style={{ height: '20%' }} title="> 30 min" />
              </div>
            ) : (
              <div className="text-xs text-[#98A2B3]">No data available for the selected period.</div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 3: AI PERFORMANCE
      ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#101828]">
          <div className="w-5 h-5 rounded-full bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <h2>AI Performance</h2>
        </div>

        {/* AI Usage Over Time (Full Width) */}
        <div className="sendiee-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#101828]">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span>AI Usage Over Time</span>
            </div>

            <div className="flex items-center bg-[#F9FAFB] border border-[#EAECF0] p-0.5 rounded-xl text-[10px] font-semibold">
              {['Daily', 'Weekly', 'Monthly'].map((i) => (
                <button
                  key={i}
                  onClick={() => setAiUsageInterval(i)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    aiUsageInterval === i
                      ? 'bg-white text-[#7C3AED] shadow-2xs font-bold'
                      : 'text-[#667085]'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* Chips: Text, Images, Audio, Tools */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
              <span className="text-[#344054]">Text</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
              <span className="text-[#344054]">Images</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span className="text-[#344054]">Audio</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="text-[#344054]">Tools</span>
            </div>
          </div>

          <div className="h-44 flex items-center justify-center border border-dashed border-[#EAECF0] rounded-2xl bg-[#FAF8F5] overflow-hidden p-2">
            {demoData ? (
              <div className="w-full h-full flex flex-col justify-end relative">
                <svg className="w-full h-full" viewBox="0 0 500 120" preserveAspectRatio="none">
                  <path d="M0,85 Q50,45 100,55 T200,35 T300,50 T400,25 T500,15" fill="none" stroke="#7C3AED" strokeWidth="2.5" />
                  <path d="M0,95 Q50,80 100,90 T200,75 T300,85 T400,60 T500,55" fill="none" stroke="#0284C7" strokeWidth="2" />
                  <path d="M0,105 Q50,95 100,100 T200,90 T300,98 T400,80 T500,75" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                  <path d="M0,115 Q50,110 100,112 T200,105 T300,110 T400,95 T500,90" fill="none" stroke="#10B981" strokeWidth="1.5" />
                </svg>
                <div className="flex justify-between text-[9px] font-mono text-[#98A2B3] px-2 pt-1 border-t border-[#EAECF0]">
                  <span>1 Sep</span>
                  <span>8 Sep</span>
                  <span>15 Sep</span>
                  <span>22 Sep</span>
                  <span>30 Sep</span>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-1 text-xs text-[#98A2B3]">
                <BarChart3 className="w-8 h-8 mx-auto text-[#D0D5DD]" />
                <div>No data available for the selected period.</div>
              </div>
            )}
          </div>
        </div>

        {/* Tool Usage Trend & Model Cost Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="sendiee-card p-5 space-y-3">
            <div className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Tool Usage Trend</span>
            </div>
            <div className="text-xs text-[#667085]">
              <strong className="text-lg font-bold text-[#101828]">
                {demoData ? '348' : '0'}
              </strong>{' '}
              Total Tool Calls
            </div>

            <div className="h-28 flex items-center justify-center border border-dashed border-[#EAECF0] rounded-xl bg-[#FAF8F5] p-2">
              {demoData ? (
                <div className="w-full h-full flex items-end gap-1.5 px-2">
                  {[12, 18, 14, 26, 34, 22, 38, 45, 30, 52, 42, 58].map((v, i) => (
                    <div key={i} className="flex-1 bg-[#10B981] rounded-t hover:bg-[#059669] transition-colors" style={{ height: `${v}%` }} />
                  ))}
                </div>
              ) : (
                <span className="text-xs text-[#98A2B3]">No tool usage data for this period.</span>
              )}
            </div>
          </div>

          <div className="sendiee-card p-5 space-y-3">
            <div className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Model Cost Breakdown</span>
            </div>
            {demoData ? (
              <div className="space-y-2 text-xs pt-1">
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 font-mono">
                    <span>Claude 3.5 Sonnet</span>
                    <span className="font-bold text-[#7C3AED]">$34.12</span>
                  </div>
                  <div className="w-full bg-[#EAECF0] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#7C3AED] h-full" style={{ width: '54%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 font-mono">
                    <span>GPT-4o</span>
                    <span className="font-bold text-[#0284C7]">$18.40</span>
                  </div>
                  <div className="w-full bg-[#EAECF0] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#0284C7] h-full" style={{ width: '29%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 font-mono">
                    <span>Gemini 1.5 Pro</span>
                    <span className="font-bold text-[#10B981]">$7.85</span>
                  </div>
                  <div className="w-full bg-[#EAECF0] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#10B981] h-full" style={{ width: '12%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[11px] mb-0.5 font-mono">
                    <span>Llama 3.1</span>
                    <span className="font-bold text-[#F59E0B]">$2.46</span>
                  </div>
                  <div className="w-full bg-[#EAECF0] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#F59E0B] h-full" style={{ width: '5%' }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-28 flex items-center justify-center border border-dashed border-[#EAECF0] rounded-xl bg-[#FAF8F5] text-xs text-[#98A2B3]">
                No model cost data for this period.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 4: MESSAGES
      ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#101828]">
          <div className="w-5 h-5 rounded-full bg-[#F4F0FD] border border-[#E9D8FD] flex items-center justify-center text-[#7C3AED]">
            <Mail className="w-3.5 h-3.5" />
          </div>
          <h2>Messages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Incoming Messages Donut */}
          <div className="sendiee-card p-6 space-y-3">
            <div className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Incoming Messages</span>
            </div>

            <div className="h-40 flex items-center justify-center border border-dashed border-[#EAECF0] rounded-2xl bg-[#FAF8F5]">
              {demoData ? (
                <div className="w-full flex items-center justify-around p-3 gap-4">
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#7C3AED" strokeWidth="4.5" strokeDasharray="85 15" strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#0284C7" strokeWidth="4.5" strokeDasharray="8 92" strokeDashoffset="-85" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="4 96" strokeDashoffset="-93" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray="3 97" strokeDashoffset="-97" />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-xs font-bold text-[#101828] font-mono">85%</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] font-medium text-[#344054]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                      <span>Text: <strong>85%</strong> (410)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
                      <span>Image: <strong>8%</strong> (38)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                      <span>Audio: <strong>4%</strong> (20)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                      <span>Doc: <strong>3%</strong> (14)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-1 text-xs text-[#98A2B3]">
                  <BarChart3 className="w-7 h-7 mx-auto text-[#D0D5DD]" />
                  <div>No data available for the selected period.</div>
                </div>
              )}
            </div>
          </div>

          {/* Outgoing Responses Donut */}
          <div className="sendiee-card p-6 space-y-3">
            <div className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Outgoing Responses</span>
            </div>

            <div className="h-40 flex items-center justify-center border border-dashed border-[#EAECF0] rounded-2xl bg-[#FAF8F5]">
              {demoData ? (
                <div className="w-full flex items-center justify-around p-3 gap-4">
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#7C3AED" strokeWidth="4.5" strokeDasharray="88 12" strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="12 88" strokeDashoffset="-88" />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-xs font-bold text-[#101828] font-mono">88%</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] font-medium text-[#344054]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                      <span>Text: <strong>88%</strong> (438)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                      <span>Audio: <strong>12%</strong> (60)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-1 text-xs text-[#98A2B3]">
                  <BarChart3 className="w-7 h-7 mx-auto text-[#D0D5DD]" />
                  <div>No data available for the selected period.</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Audio Messages Trend */}
        <div className="sendiee-card p-6 space-y-3">
          <div className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>Audio Messages Trend</span>
          </div>
          <div className="h-32 flex items-center justify-center border border-dashed border-[#EAECF0] rounded-2xl bg-[#FAF8F5]">
            {demoData ? (
              <div className="w-full h-full p-2 flex items-end gap-2">
                {[5, 12, 8, 16, 22, 14, 28, 35, 20, 38, 30, 42].map((v, idx) => (
                  <div key={idx} className="flex-1 bg-[#F59E0B] rounded-t hover:bg-[#D97706] transition-colors" style={{ height: `${v * 2}%` }} />
                ))}
              </div>
            ) : (
              <div className="text-center space-y-1 text-xs text-[#98A2B3]">
                <BarChart3 className="w-7 h-7 mx-auto text-[#D0D5DD]" />
                <div>No audio messages data for this period.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 5: PEAK HOURS HEATMAP
      ========================================================= */}
      <div className="sendiee-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-[#101828]">
            <Flame className="w-4 h-4 text-[#7C3AED]" />
            <span>Peak Hours Heatmap</span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-[#667085] font-mono">
            <span>Less</span>
            <div className="w-3 h-3 rounded-xs bg-[#FAF8F5] border border-[#EBE7E0]" />
            <div className="w-3 h-3 rounded-xs bg-[#E9D5FF]" />
            <div className="w-3 h-3 rounded-xs bg-[#C084FC]" />
            <div className="w-3 h-3 rounded-xs bg-[#9333EA]" />
            <div className="w-3 h-3 rounded-xs bg-[#7C3AED]" />
            <span>More</span>
          </div>
        </div>

        {/* 7x24 Heatmap Grid matching user screenshot */}
        <div className="overflow-x-auto pb-2">
          <div className="min-w-[700px] space-y-1.5">
            {/* Hours Header */}
            <div className="grid grid-cols-25 gap-1 text-[10px] font-mono text-[#98A2B3] text-center">
              <div className="text-left font-bold">Day</div>
              {HOURS.map((hr) => (
                <div key={hr}>{hr}</div>
              ))}
            </div>

            {/* 7 Day Rows */}
            {DAYS.map((day, dayIdx) => (
              <div key={day} className="grid grid-cols-25 gap-1 items-center">
                <div className="text-[11px] font-semibold text-[#475467] font-mono">{day}</div>
                {HOURS.map((hr, hrIdx) => (
                  <div
                    key={hr}
                    title={`${day} at ${hr}: ${demoData ? 'Active engagement' : '0 events'}`}
                    className={`h-7 rounded-xs transition-colors cursor-pointer ${getHeatmapColor(dayIdx, hrIdx)}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          SECTION 6: TOP USERS
      ========================================================= */}
      <div className="sendiee-card p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#101828]">
          <Users className="w-4 h-4 text-[#7C3AED]" />
          <span>Top Users</span>
        </div>

        {demoData ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#EAECF0] bg-[#F9FAFB] text-[#667085] font-mono text-[10px] uppercase">
                  <th className="p-3 font-semibold">Rank</th>
                  <th className="p-3 font-semibold">User</th>
                  <th className="p-3 font-semibold">Channel</th>
                  <th className="p-3 font-semibold">Messages</th>
                  <th className="p-3 font-semibold">Conversations</th>
                  <th className="p-3 font-semibold">Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAECF0]">
                {TOP_USERS_DEMO.map((u) => (
                  <tr key={u.phone} className="hover:bg-[#F9FAFB] transition-colors">
                    <td className="p-3 font-mono font-bold">
                      <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] ${
                        u.rank === 1 ? 'bg-[#FEF08A] text-[#854D0E]' : u.rank === 2 ? 'bg-[#E2E8F0] text-[#475467]' : u.rank === 3 ? 'bg-[#FED7AA] text-[#9A3412]' : 'bg-[#F2F4F7] text-[#667085]'
                      }`}>
                        {u.rank}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-[#101828]">
                      {u.name} <span className="font-normal text-[#667085] text-[11px] font-mono">({u.phone})</span>
                    </td>
                    <td className="p-3 font-mono">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.channel === 'WhatsApp' ? 'bg-[#DCFCE7] text-[#16A34A]' : u.channel === 'Instagram' ? 'bg-[#FCE7F3] text-[#DB2777]' : u.channel === 'Messenger' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'bg-[#DCFCE7] text-[#00B900]'
                      }`}>
                        {u.channel}
                      </span>
                    </td>
                    <td className="p-3 font-mono font-bold text-[#101828]">{u.msgs}</td>
                    <td className="p-3 font-mono text-[#475467]">{u.convs}</td>
                    <td className="p-3 font-mono font-bold text-[#7C3AED]">{u.spend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-32 flex items-center justify-center border border-dashed border-[#EAECF0] rounded-2xl bg-[#FAF8F5] text-xs text-[#98A2B3]">
            <div className="text-center space-y-1">
              <Users className="w-7 h-7 mx-auto text-[#D0D5DD]" />
              <div>No data available for the selected period.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
