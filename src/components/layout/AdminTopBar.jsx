import React from 'react';
import { LogOut, Users, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminTopBar = () => {
  const { logout, setActiveTab } = useApp();

  return (
    <div className="bg-[#0F172A] text-white px-4 lg:px-8 py-2.5 border-b border-[#1E293B] flex items-center justify-between gap-3 sticky top-0 z-50 shadow-md">
      {/* Left: Super Admin Console Identity */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xs shadow-sm">
          👑
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold tracking-wide text-white uppercase font-mono">
              Super Admin Console
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              MULTI-TENANT
            </span>
          </div>
          <p className="text-[11px] text-[#94A3B8]">
            Master Management & Tenant Directory
          </p>
        </div>
      </div>

      {/* Right: Only Tenant Directory & Sign Out */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('super-admin')}
          className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm border border-emerald-400/30"
          title="Open Tenant Directory & Localhost Manager"
        >
          <Users className="w-4 h-4" />
          <span>Tenant Directory</span>
        </button>

        <div className="h-4 w-px bg-[#334155]" />

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
