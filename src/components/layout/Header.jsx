import React from 'react';
import { Search, Percent, ChevronDown, LogOut, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header = () => {
  const {
    credits,
    activeTab,
    setIsSearchOpen,
    setIsUpgradeModalOpen,
    isWorkspaceDropdownOpen,
    setIsWorkspaceDropdownOpen,
    showToast,
    currentUser,
    logout,
    adminViewProfile,
    switchAdminProfile,
  } = useApp();

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'inbox': return 'Inbox';
      case 'leads': return 'Leads';
      case 'insights': return 'Insights';
      case 'files': return 'Files';
      case 'ai-assistants': return 'AI Assistants';
      case 'tools': return 'Tools';
      case 'lead-studio': return 'Lead Studio';
      case 'segmentation': return 'Segmentation';
      case 'campaigns': return 'Campaigns';
      case 'drip-campaigns': return 'Drip Campaigns';
      case 'automations': return 'Automations';
      case 'templates': return 'Templates';
      case 'channels':
      case 'channel-whatsapp':
      case 'channel-instagram':
      case 'channel-messenger':
      case 'channel-line':
        return 'Channels';
      case 'shopify': return 'Shopify Integration';
      case 'zoho': return 'Zoho Integration';
      case 'api': return 'Sendiee REST API';
      case 'meta-api':
      case 'meta_api':
        return 'Meta WhatsApp Cloud API';
      case 'apps': return 'App Marketplace';
      case 'manage': return 'Workspace Settings';
      case 'wallet': return 'AI Credit Wallet';
      case 'plans': return 'Subscription Plans';
      case 'usage':
      case 'limits':
        return 'Usage & Limits';
      default: return 'Dashboard';
    }
  };

  const isKiki = currentUser?.username?.toLowerCase() === 'kiki';
  const isAdmin = currentUser?.isAdmin || currentUser?.username?.toLowerCase() === 'admin';

  return (
    <header className="h-16 bg-white border-b border-[#EAECF0] px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 font-sans">
      {/* Left: Page Title */}
      <h1 className="text-xl font-bold text-[#101828] font-sans">
        {isKiki ? 'Meta WhatsApp Cloud API' : getTitle()}
      </h1>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Admin Profile Switcher Pill */}
        {isAdmin && (
          <div className="flex items-center gap-1 bg-[#F4F0FD] border border-[#E9D8FD] p-1 rounded-xl">
            <span className="text-[10px] font-bold text-[#7C3AED] px-1 font-mono uppercase tracking-wider hidden sm:inline">
              Profile:
            </span>
            <button
              type="button"
              onClick={() => switchAdminProfile('sri')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                adminViewProfile === 'sri'
                  ? 'bg-[#7C3AED] text-white shadow-2xs'
                  : 'text-[#475467] hover:bg-white'
              }`}
              title="View Sri's DhiGrowth CRM"
            >
              <span>👤 Sri (CRM)</span>
              {adminViewProfile === 'sri' && <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />}
            </button>
            <button
              type="button"
              onClick={() => switchAdminProfile('kiki')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                adminViewProfile === 'kiki'
                  ? 'bg-[#7C3AED] text-white shadow-2xs'
                  : 'text-[#475467] hover:bg-white'
              }`}
              title="View Kiki's Separate Client Suite"
            >
              <span>⚡ Kiki (Client)</span>
              {adminViewProfile === 'kiki' && <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />}
            </button>
          </div>
        )}

        {!isKiki && (
          <>
            {/* Search Bar with Ctrl+K trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center bg-[#F9FAFB] hover:bg-[#F2F4F7] border border-[#EAECF0] rounded-xl px-3.5 py-1.5 w-60 lg:w-72 text-left cursor-pointer transition-colors"
            >
              <Search className="w-4 h-4 text-[#98A2B3] mr-2 shrink-0" />
              <span className="w-full text-xs text-[#98A2B3]">Search...</span>
              <span className="text-[11px] font-mono text-[#98A2B3] bg-white border border-[#EAECF0] px-1.5 py-0.5 rounded shadow-2xs shrink-0">
                ctrl K
              </span>
            </button>

            {/* Credits Badge */}
            <button
              onClick={() => setIsUpgradeModalOpen(true)}
              className="flex items-center gap-1.5 bg-[#F9F5FF] hover:bg-[#F4F0FD] border border-[#E9D8FD] px-3 py-1.5 rounded-xl text-xs font-bold text-[#6941C6] cursor-pointer transition-colors"
              title="Click to manage credits and wallet"
            >
              <div className="w-4 h-4 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-[10px]">
                %
              </div>
              <span className="font-mono tracking-tight font-bold">
                ${credits.toFixed(2)} CREDITS
              </span>
            </button>
          </>
        )}

        {isKiki && (
          <div className="px-3 py-1 rounded-xl bg-[#F4F0FD] border border-[#E9D8FD] text-[#7C3AED] text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Channel Admin Access</span>
          </div>
        )}

        {/* User Workspace Pill */}
        <div className="relative">
          <button
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            className="flex items-center gap-2 bg-white hover:bg-[#F9FAFB] border border-[#EAECF0] px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
          >
            <div className="w-6 h-6 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-[10px] font-bold">
              {(currentUser?.name?.[0] || currentUser?.username?.[0] || 'S').toUpperCase()}
            </div>
            <span className="text-xs font-semibold text-[#344054]">
              {currentUser?.username || 'sri'}
            </span>
            <span className="text-xs">👑</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#98A2B3]" />
          </button>

          {isWorkspaceDropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-[#EAECF0] rounded-2xl shadow-xl p-2 z-50 space-y-1 animate-in fade-in">
              <div className="px-3 py-2 border-b border-[#F2F4F7]">
                <div className="text-xs font-bold text-[#101828]">
                  {currentUser?.name || "Sri's Workspace"}
                </div>
                <div className="text-[10px] text-[#667085] font-mono">
                  {currentUser?.email || 'admin@dhigrowth.com'}
                </div>
                <div className="mt-1 inline-block px-1.5 py-0.5 rounded-md bg-[#DCFCE7] text-[#15803D] text-[9px] font-bold font-mono">
                  {currentUser?.role || 'Workspace Owner'}
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('meta-api');
                  setIsWorkspaceDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-xs text-[#344054] hover:bg-[#F4F0FD] hover:text-[#7C3AED] rounded-xl font-medium cursor-pointer transition-colors flex items-center justify-between"
              >
                <span>Meta WhatsApp API</span>
                <span className="text-[9px] bg-[#F4F0FD] text-[#7C3AED] px-1.5 py-0.5 rounded font-mono font-bold border border-[#E9D8FD]">API</span>
              </button>

              {!isKiki && (
                <>
                  <button
                    onClick={() => {
                      setActiveTab('usage');
                      setIsWorkspaceDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#344054] hover:bg-[#F4F0FD] hover:text-[#7C3AED] rounded-xl font-medium cursor-pointer transition-colors"
                  >
                    Usage & Limits
                  </button>

                  <button
                    onClick={() => {
                      setIsUpgradeModalOpen(true);
                      setIsWorkspaceDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#344054] hover:bg-[#F4F0FD] hover:text-[#7C3AED] rounded-xl font-medium cursor-pointer transition-colors"
                  >
                    Subscription & Plans
                  </button>

                  <button
                    onClick={() => {
                      showToast('Switched to Production Sandbox', 'info');
                      setIsWorkspaceDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-[#344054] hover:bg-[#F4F0FD] hover:text-[#7C3AED] rounded-xl font-medium cursor-pointer transition-colors"
                  >
                    Switch Environment
                  </button>
                </>
              )}

              <div className="pt-1 border-t border-[#F2F4F7]">
                <button
                  onClick={() => {
                    setIsWorkspaceDropdownOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-[#DC2626] hover:bg-[#FEF2F2] rounded-xl font-bold cursor-pointer flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-[#DC2626]" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Initial Circle */}
        <button
          onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
          className="w-8 h-8 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer transition-colors"
          title="Account Menu"
        >
          {(currentUser?.name?.[0] || currentUser?.username?.[0] || 'S').toUpperCase()}
        </button>
      </div>
    </header>
  );
};
