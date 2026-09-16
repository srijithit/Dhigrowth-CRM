import React from 'react';
import { User, LogOut, CheckCircle2, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminTopBar = ({ activeProfile = 'sri', onSwitchProfile }) => {
  const { logout, clientViewMode, toggleClientViewMode, setActiveTab } = useApp();

  return (
    <div className="bg-[#0F172A] text-white px-4 lg:px-8 py-2.5 border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      {/* Left: Admin Scope Info */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex items-center justify-center text-white font-black text-xs shadow-sm">
          👑
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold tracking-wide text-white uppercase font-mono">
              Admin Workspace Switcher
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#334155] text-[#94A3B8] border border-[#475569]">
              SUPER ADMIN
            </span>
          </div>
          <p className="text-[11px] text-[#94A3B8] flex items-center gap-1.5">
            <span>Currently Viewing:</span>
            <span className="font-bold text-white flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-[#4ADE80]" />
              {activeProfile === 'sri' ? "Sri's Profile (Dhigrowth CRM User)" : "Kiki's Profile (Client Workspace)"}
            </span>
          </p>
        </div>
      </div>

      {/* Center/Right: Profile Switcher Buttons */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-[#94A3B8] font-bold mr-1 hidden sm:inline">
          Switch User:
        </span>

        {/* Sri Button */}
        <button
          type="button"
          onClick={() => onSwitchProfile('sri')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeProfile === 'sri'
              ? 'bg-[#7C3AED] text-white ring-2 ring-[#A855F7] shadow-sm'
              : 'bg-[#1E293B] text-[#CBD5E1] hover:bg-[#334155] hover:text-white border border-[#334155]'
          }`}
          title="Switch to Sri's DhiGrowth CRM workspace"
        >
          <User className="w-3.5 h-3.5" />
          <span>Sri (Dhigrowth CRM)</span>
          {activeProfile === 'sri' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
          )}
        </button>

        {/* Kiki Button */}
        <button
          type="button"
          onClick={() => onSwitchProfile('kiki')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeProfile === 'kiki'
              ? 'bg-[#7C3AED] text-white ring-2 ring-[#A855F7] shadow-sm'
              : 'bg-[#1E293B] text-[#CBD5E1] hover:bg-[#334155] hover:text-white border border-[#334155]'
          }`}
          title="Switch to Kiki's Client Workspace"
        >
          <span className="text-xs">⚡</span>
          <span>Kiki (Client Workspace)</span>
          {activeProfile === 'kiki' && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]" />
          )}
        </button>

        {/* View Mode Toggle when viewing Kiki */}
        {activeProfile === 'kiki' && (
          <div className="flex items-center gap-1 bg-[#1E293B] border border-[#334155] p-0.5 rounded-xl ml-1">
            <button
              type="button"
              onClick={() => toggleClientViewMode('crm')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                clientViewMode === 'crm'
                  ? 'bg-[#7C3AED] text-white shadow-2xs'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
              title="View Kiki in Full CRM Layout"
            >
              Full CRM UI
            </button>
            <button
              type="button"
              onClick={() => toggleClientViewMode('portal')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                clientViewMode === 'portal'
                  ? 'bg-[#7C3AED] text-white shadow-2xs'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
              title="View Kiki in BYOK Client Suite"
            >
              Client Suite
            </button>
          </div>
        )}

        {/* Super Admin Tenants Console Button */}
        <button
          type="button"
          onClick={() => setActiveTab('super-admin')}
          className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer bg-emerald-600/90 hover:bg-emerald-600 text-white shadow-sm border border-emerald-500/40 ml-1"
          title="Open Super Admin Tenants Directory & Localhost Manager"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Tenants Directory</span>
        </button>

        <div className="h-4 w-px bg-[#334155] mx-1" />

        {/* Sign Out Button */}
        <button
          type="button"
          onClick={logout}
          className="p-1.5 rounded-lg text-[#94A3B8] hover:text-[#F87171] hover:bg-[#1E293B] transition-colors cursor-pointer"
          title="Sign Out of Admin Session"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
