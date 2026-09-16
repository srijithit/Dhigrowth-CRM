import React from 'react';
import { LogOut, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminTopBar = () => {
  const { logout, setActiveTab } = useApp();

  return (
    <div className="bg-white text-[#101828] px-4 lg:px-8 py-2 border-b border-[#EAECF0] flex items-center justify-end gap-3 sticky top-0 z-50 shadow-2xs font-sans">
      <button
        type="button"
        onClick={() => setActiveTab('super-admin')}
        className="px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer bg-[#F4F0FD] hover:bg-[#EDE5FA] text-[#7C3AED] border border-[#E9D8FD] shadow-2xs"
        title="Open Tenant Directory & Localhost Manager"
      >
        <Users className="w-4 h-4" />
        <span>Tenant Directory</span>
      </button>

      <div className="h-4 w-px bg-[#EAECF0]" />

      <button
        type="button"
        onClick={logout}
        className="p-1.5 rounded-lg text-[#98A2B3] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
        title="Sign Out of Admin Session"
      >
        <LogOut className="w-4 h-4" />
      </button>
    </div>
  );
};
