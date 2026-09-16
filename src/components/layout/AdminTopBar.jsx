import React from 'react';
import { LogOut, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminTopBar = () => {
  const { logout, setActiveTab } = useApp();

  return (
    <div className="bg-[#0F172A] text-white px-4 lg:px-8 py-2 border-b border-[#1E293B] flex items-center justify-end gap-3 sticky top-0 z-50 shadow-md">

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
