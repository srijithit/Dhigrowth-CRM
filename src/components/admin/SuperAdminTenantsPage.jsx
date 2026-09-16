import React, { useState } from 'react';
import {
  Users,
  Building2,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Shield,
  Key,
  Radio,
  Trash2,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SuperAdminTenantsPage = () => {
  const {
    tenants,
    createTenantUser,
    deleteTenantUser,
    toggleTenantPermission,
    currentUser,
    showToast,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(null);
  const [visiblePasswords, setVisiblePasswords] = useState({});
  const [activeTabFilter, setActiveTabFilter] = useState('all'); // 'all', 'active', 'admin'

  // New Tenant Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    companyName: '',
    plan: 'Pro Plan',
    credits: 500,
    permissions: {
      send_due_all: true,
      team_inbox: true,
      ai_studio: true,
      meta_api: true,
      crm_leads: true,
      campaigns: true,
    },
  });

  const handleCopyLink = (slug) => {
    const url = `${window.location.origin}/?tenant=${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    showToast(`Copied workspace URL for tenant "${slug}"!`, 'success');
    setTimeout(() => setCopiedSlug(null), 3000);
  };

  const togglePasswordVisibility = (id) => {
    setVisiblePasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateTenant = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.username.trim() || !formData.password.trim()) {
      showToast('Please fill in Name, Username, and Password', 'error');
      return;
    }

    const created = createTenantUser(formData);
    if (created) {
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        username: '',
        email: '',
        password: '',
        companyName: '',
        plan: 'Pro Plan',
        credits: 500,
        permissions: {
          send_due_all: true,
          team_inbox: true,
          ai_studio: true,
          meta_api: true,
          crm_leads: true,
          campaigns: true,
        },
      });
    }
  };

  const filteredTenants = (tenants || []).filter((t) => {
    const matchQuery =
      t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.workspaceId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchQuery) return false;
    if (activeTabFilter === 'admin') return t.isAdmin;
    if (activeTabFilter === 'active') return t.status === 'active' || t.status === 'Active';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 font-sans">
      {/* Clean Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#101828]">
            Tenant Organizations & Users
          </h1>
          <p className="text-[#475467] text-xs sm:text-sm mt-0.5">
            Manage isolated customer accounts, workspaces, and user permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs shadow-xs transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            Add New Tenant / User
          </button>
        </div>
      </div>

      {/* Metrics Row (Crisp Light Theme) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#EAECF0] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Total Tenants</span>
            <Building2 className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <p className="text-2xl font-bold text-[#101828] mt-2">{tenants?.length || 0}</p>
          <span className="text-xs text-[#10B981] font-semibold">All isolated partitions</span>
        </div>

        <div className="bg-white border border-[#EAECF0] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Active Users</span>
            <Users className="w-4 h-4 text-[#10B981]" />
          </div>
          <p className="text-2xl font-bold text-[#101828] mt-2">
            {(tenants || []).filter((t) => t.status === 'Active' || t.status === 'active').length}
          </p>
          <span className="text-xs text-[#10B981] font-semibold">100% operational</span>
        </div>

        <div className="bg-white border border-[#EAECF0] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Super Admins</span>
            <Shield className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <p className="text-2xl font-bold text-[#101828] mt-2">
            {(tenants || []).filter((t) => t.isAdmin).length}
          </p>
          <span className="text-xs text-[#7C3AED] font-semibold">Master organization</span>
        </div>

        <div className="bg-white border border-[#EAECF0] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">Active Session</span>
            <Radio className="w-4 h-4 text-cyan-600" />
          </div>
          <p className="text-sm font-bold text-[#101828] mt-2 truncate">
            {currentUser?.name || 'Super Admin'}
          </p>
          <span className="text-xs text-[#0284C7] font-mono truncate block mt-0.5">
            {currentUser?.workspaceId || 'ws_default_dhigrowth'}
          </span>
        </div>
      </div>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-xl border border-[#EAECF0] shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#98A2B3]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, slug, workspace ID..."
            className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#D0D5DD] rounded-lg text-sm text-[#101828] placeholder-[#98A2B3] focus:outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#7C3AED]/15"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-[#F2F4F7] rounded-lg self-stretch sm:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTabFilter === 'all'
                ? 'bg-white text-[#7C3AED] shadow-2xs font-bold'
                : 'text-[#475467] hover:text-[#101828]'
            }`}
          >
            All Tenants ({tenants?.length || 0})
          </button>
          <button
            onClick={() => setActiveTabFilter('active')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTabFilter === 'active'
                ? 'bg-white text-[#7C3AED] shadow-2xs font-bold'
                : 'text-[#475467] hover:text-[#101828]'
            }`}
          >
            Active Only
          </button>
          <button
            onClick={() => setActiveTabFilter('admin')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTabFilter === 'admin'
                ? 'bg-white text-[#7C3AED] shadow-2xs font-bold'
                : 'text-[#475467] hover:text-[#101828]'
            }`}
          >
            Admins
          </button>
        </div>
      </div>

      {/* Tenants Directory List */}
      <div className="space-y-4">
        {filteredTenants.length === 0 ? (
          <div className="bg-white border border-[#EAECF0] rounded-2xl p-12 text-center shadow-2xs">
            <Users className="w-12 h-12 text-[#98A2B3] mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-lg font-bold text-[#101828]">No Tenants Found</h3>
            <p className="text-sm text-[#667085] mt-1 max-w-sm mx-auto">
              No tenant matched your filter criteria. Click "Add New Tenant / User" to spin up an isolated customer workspace.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Tenant
            </button>
          </div>
        ) : (
          filteredTenants.map((tenant) => {
            const isSelf = currentUser?.id === tenant.id || currentUser?.username === tenant.username;
            const isPasswordShown = !!visiblePasswords[tenant.id];

            return (
              <div
                key={tenant.id}
                className={`bg-white border transition-all rounded-2xl p-5 shadow-2xs hover:shadow-md ${
                  isSelf
                    ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/10'
                    : 'border-[#EAECF0]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Tenant Identity */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg shrink-0 shadow-2xs ${
                        tenant.isAdmin
                          ? 'bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white'
                          : 'bg-gradient-to-br from-[#10B981] to-[#14B8A6] text-white'
                      }`}
                    >
                      {tenant.name ? tenant.name.substring(0, 2).toUpperCase() : 'TN'}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-[#101828] text-base sm:text-lg">
                          {tenant.name}
                        </h3>
                        {tenant.companyName && (
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#F2F4F7] text-[#344054] font-medium border border-[#E4E7EC]">
                            {tenant.companyName}
                          </span>
                        )}
                        {tenant.isAdmin ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4F0FD] text-[#7C3AED] border border-[#E9D8FD]">
                            <Shield className="w-3 h-3" /> Super Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#047857] border border-[#A7F3D0]">
                            Client Tenant
                          </span>
                        )}
                        {isSelf && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F4F0FD] text-[#7C3AED] border border-[#E9D8FD]">
                            Current Session
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-[#475467]">
                        <span>
                          Username: <strong className="text-[#101828]">{tenant.username}</strong>
                        </span>
                        {tenant.email && <span>Email: {tenant.email}</span>}
                        <span>
                          Plan: <strong className="text-[#7C3AED]">{tenant.plan || 'Pro'}</strong>
                        </span>
                        <span>
                          Credits: <strong className="text-[#101828]">{tenant.credits ?? 500}</strong>
                        </span>
                      </div>

                      {/* Workspace ID & Credentials Box */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F9FAFB] border border-[#EAECF0] font-mono text-[11px] text-[#344054]">
                          <Layers className="w-3 h-3 text-[#7C3AED]" />
                          <span>Partition:</span>
                          <span className="font-bold text-[#7C3AED]">{tenant.workspaceId}</span>
                        </div>

                        {/* Password display toggle */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F9FAFB] border border-[#EAECF0] font-mono text-[11px] text-[#344054]">
                          <Key className="w-3 h-3 text-amber-500" />
                          <span>Password:</span>
                          <span className="font-bold text-[#101828]">
                            {isPasswordShown ? tenant.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(tenant.id)}
                            className="text-[#98A2B3] hover:text-[#344054] ml-0.5 cursor-pointer"
                            title={isPasswordShown ? 'Hide Password' : 'Show Password'}
                          >
                            {isPasswordShown ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Launch & Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 lg:self-center">
                    {/* Launch Window */}
                    <a
                      href={`${window.location.origin}/?tenant=${tenant.slug || tenant.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F4F0FD] hover:bg-[#EDE5FA] text-[#7C3AED] border border-[#E9D8FD] text-xs font-bold transition-all shadow-2xs"
                      title="Open dedicated workspace in a new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Launch
                    </a>

                    {/* Copy Workspace URL */}
                    <button
                      onClick={() => handleCopyLink(tenant.slug || tenant.username)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[#F9FAFB] hover:bg-[#F2F4F7] text-[#344054] border border-[#EAECF0] text-xs font-medium transition-colors cursor-pointer"
                      title="Copy URL with tenant link"
                    >
                      {copiedSlug === (tenant.slug || tenant.username) ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#10B981]" />
                          <span className="text-[#047857] font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#98A2B3]" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    {/* Delete Tenant (Guard primary admin) */}
                    {!tenant.isAdmin && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete tenant "${tenant.name}" and all associated credentials?`)) {
                            deleteTenantUser(tenant.id);
                          }
                        }}
                        className="p-2 rounded-lg text-[#98A2B3] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors cursor-pointer"
                        title="Delete Tenant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Feature Permissions Quick Toggles */}
                <div className="mt-4 pt-4 border-t border-[#F2F4F7]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#667085] uppercase tracking-wider">
                      Granted Feature Permissions
                    </span>
                    <span className="text-[11px] text-[#98A2B3]">Click any badge to toggle access</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { key: 'send_due_all', label: 'Send Due to All', icon: Zap },
                      { key: 'team_inbox', label: 'Team Inbox', icon: Users },
                      { key: 'ai_studio', label: 'AI Studio', icon: Sparkles },
                      { key: 'meta_api', label: 'Meta WhatsApp API', icon: Key },
                      { key: 'crm_leads', label: 'CRM Leads', icon: Layers },
                      { key: 'campaigns', label: 'Broadcast Campaigns', icon: Radio },
                    ].map((perm) => {
                      const isAllowed = tenant.permissions?.[perm.key] !== false;
                      const Icon = perm.icon;
                      return (
                        <button
                          key={perm.key}
                          onClick={() => toggleTenantPermission(tenant.id, perm.key)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            isAllowed
                              ? 'bg-[#ECFDF5] text-[#047857] border-[#A7F3D0]'
                              : 'bg-[#F2F4F7] text-[#98A2B3] border-[#EAECF0] line-through'
                          }`}
                          title={`Toggle ${perm.label} for ${tenant.name}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{perm.label}</span>
                          {isAllowed ? (
                            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-[#98A2B3]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add New Tenant Modal (Light Theme) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white border border-[#EAECF0] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#EAECF0] flex items-center justify-between bg-[#F9FAFB]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#047857] flex items-center justify-center border border-[#A7F3D0]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#101828]">Add New Tenant / User</h3>
                  <p className="text-xs text-[#667085]">
                    Spawns an isolated customer workspace with custom credentials and direct access
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#98A2B3] hover:text-[#101828] text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateTenant} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1.5">
                    User Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-sm text-[#101828] focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1.5">
                    Organization / Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Apex Logistics"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-sm text-[#101828] focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1.5">
                    Login Username <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        username: e.target.value.toLowerCase().replace(/\s+/g, ''),
                      })
                    }
                    placeholder="e.g. ramesh"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-sm text-[#101828] font-mono focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15"
                  />
                  <span className="text-[11px] text-[#667085] mt-1 block">
                    URL Slug: <code className="text-[#047857] font-bold">?tenant={formData.username || 'username'}</code>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1.5">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="e.g. Ramesh@2026"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-sm text-[#101828] font-mono focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1.5">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@company.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-sm text-[#101828] focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#344054] mb-1.5">
                    Plan Tier
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-[#D0D5DD] rounded-lg text-sm text-[#101828] focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/15"
                  >
                    <option value="Starter Plan">Starter Plan (Free)</option>
                    <option value="Pro Plan">Pro Plan (₹2,499/mo)</option>
                    <option value="Enterprise Scale">Enterprise Scale (₹9,999/mo)</option>
                  </select>
                </div>
              </div>

              {/* Granular Feature Permissions Checklist */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-[#344054] mb-2">
                  Feature Permissions
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { key: 'send_due_all', label: 'Send Due to All' },
                    { key: 'team_inbox', label: 'Team Inbox' },
                    { key: 'ai_studio', label: 'AI Auto-Reply' },
                    { key: 'meta_api', label: 'Meta WhatsApp API' },
                    { key: 'crm_leads', label: 'CRM Leads' },
                    { key: 'campaigns', label: 'Broadcasts' },
                  ].map((perm) => (
                    <label
                      key={perm.key}
                      className="flex items-center gap-2 p-2 rounded-lg bg-[#F9FAFB] border border-[#EAECF0] cursor-pointer text-xs hover:bg-[#F2F4F7] transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.permissions[perm.key]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            permissions: { ...formData.permissions, [perm.key]: e.target.checked },
                          })
                        }
                        className="rounded border-[#D0D5DD] text-[#10B981] focus:ring-[#10B981]"
                      />
                      <span className="text-[#344054] font-semibold">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#EAECF0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-[#D0D5DD] text-[#344054] text-sm font-semibold hover:bg-[#F9FAFB] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-sm font-bold shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  Create Tenant Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
