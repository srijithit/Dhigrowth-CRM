import React, { useState } from 'react';
import {
  Users,
  Building2,
  Plus,
  ExternalLink,
  Copy,
  Check,
  Shield,
  ShieldCheck,
  Key,
  Globe,
  Radio,
  Trash2,
  LogIn,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Server,
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
    login,
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
    showToast(`Copied isolated localhost URL for tenant "${slug}"!`, 'success');
    setTimeout(() => setCopiedSlug(null), 2500);
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

  const handleImpersonate = (tenant) => {
    login(tenant.username, tenant.password);
    showToast(`Switched active workspace session to ${tenant.name} (${tenant.workspaceId})`, 'success');
  };

  const filteredTenants = (tenants || []).filter((t) => {
    const matchQuery =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.workspaceId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.companyName?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchQuery) return false;
    if (activeTabFilter === 'admin') return t.isAdmin;
    if (activeTabFilter === 'active') return t.status === 'Active';
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 border border-indigo-800/40 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Multi-Tenant Architecture Active
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <ShieldCheck className="w-3.5 h-3.5" /> Super Admin Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tenant Organizations & Localhost Isolation
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Create and manage isolated customer accounts. Each tenant receives a separate database partition (<code className="text-emerald-300 bg-black/40 px-1.5 py-0.5 rounded text-xs">workspace_id</code>), granular feature permissions, and a direct localhost launch URL with independent browser storage.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              Add New Tenant / User
            </button>
          </div>
        </div>

        {/* Quick Multi-Port Localhost Explainer Bar */}
        <div className="mt-6 pt-5 border-t border-indigo-800/40 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-3">
            <Globe className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-cyan-300">Option 1: Isolated Localhost URL (Instant)</span>
              <p className="text-slate-400 mt-0.5">
                Click <b className="text-white">Launch</b> on any tenant below. It opens <code className="text-cyan-300 bg-cyan-950/60 px-1 rounded">localhost:5173/?tenant=slug</code> with separate session storage keys and partition filters.
              </p>
            </div>
          </div>
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60 flex items-start gap-3">
            <Server className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold text-purple-300">Option 2: Multi-Port Localhost (Port 5174)</span>
              <p className="text-slate-400 mt-0.5">
                Run <code className="text-purple-300 bg-purple-950/60 px-1 rounded">npm run dev:tenant2</code> in a new terminal window to serve another completely independent Vite instance on <b className="text-white">localhost:5174</b>.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Tenants</span>
            <Building2 className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">{tenants?.length || 0}</p>
          <span className="text-xs text-emerald-500 font-medium">All isolated partitions</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Users</span>
            <Users className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
            {(tenants || []).filter((t) => t.status === 'Active').length}
          </p>
          <span className="text-xs text-emerald-500 font-medium">100% operational</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Super Admins</span>
            <Shield className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
            {(tenants || []).filter((t) => t.isAdmin).length}
          </p>
          <span className="text-xs text-purple-400 font-medium">Master organization</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Session</span>
            <Radio className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2 truncate">
            {currentUser?.name || 'Super Admin'}
          </p>
          <span className="text-xs text-cyan-500 font-mono truncate block">
            {currentUser?.workspaceId || 'ws_default_dhigrowth'}
          </span>
        </div>
      </div>

      {/* Control Bar: Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, slug, workspace ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-stretch sm:self-auto text-xs font-medium">
          <button
            onClick={() => setActiveTabFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTabFilter === 'all'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            All Tenants ({tenants?.length || 0})
          </button>
          <button
            onClick={() => setActiveTabFilter('active')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTabFilter === 'active'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Active Only
          </button>
          <button
            onClick={() => setActiveTabFilter('admin')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              activeTabFilter === 'admin'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Admins
          </button>
        </div>
      </div>

      {/* Tenants Directory List */}
      <div className="space-y-4">
        {filteredTenants.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-3 stroke-[1.5]" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No Tenants Found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              No tenant matched your filter criteria. Click "Add New Tenant / User" to spin up an isolated customer workspace.
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
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
                className={`bg-white dark:bg-slate-900 border transition-all rounded-2xl p-5 shadow-sm hover:shadow-md ${
                  isSelf
                    ? 'border-indigo-500/60 ring-2 ring-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Tenant Identity */}
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 shadow-sm ${
                        tenant.isAdmin
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                          : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                      }`}
                    >
                      {tenant.name ? tenant.name.substring(0, 2).toUpperCase() : 'TN'}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base sm:text-lg">
                          {tenant.name}
                        </h3>
                        {tenant.companyName && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                            {tenant.companyName}
                          </span>
                        )}
                        {tenant.isAdmin ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700/50">
                            <Shield className="w-3 h-3" /> Super Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50">
                            Client Tenant
                          </span>
                        )}
                        {isSelf && (
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                            Current Session
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-500 dark:text-slate-400">
                        <span>
                          Username: <strong className="text-slate-700 dark:text-slate-200">{tenant.username}</strong>
                        </span>
                        {tenant.email && <span>Email: {tenant.email}</span>}
                        <span>
                          Plan: <strong className="text-indigo-600 dark:text-indigo-400">{tenant.plan || 'Pro'}</strong>
                        </span>
                        <span>
                          Credits: <strong>{tenant.credits ?? 500}</strong>
                        </span>
                      </div>

                      {/* Workspace ID & Credentials Box */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          <Layers className="w-3 h-3 text-indigo-500" />
                          <span>Partition:</span>
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{tenant.workspaceId}</span>
                        </div>

                        {/* Password display toggle */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                          <Key className="w-3 h-3 text-amber-500" />
                          <span>Password:</span>
                          <span className="font-semibold">
                            {isPasswordShown ? tenant.password : '••••••••'}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(tenant.id)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-0.5"
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
                    {/* Launch Localhost Isolated Window */}
                    <a
                      href={`${window.location.origin}/?tenant=${tenant.slug || tenant.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold transition-all shadow-sm"
                      title="Open dedicated isolated localhost session in a new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Launch Localhost
                    </a>

                    {/* Copy Localhost URL */}
                    <button
                      onClick={() => handleCopyLink(tenant.slug || tenant.username)}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
                      title="Copy URL with tenant query param"
                    >
                      {copiedSlug === (tenant.slug || tenant.username) ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    {/* Impersonate / Switch Workspace */}
                    {!isSelf && (
                      <button
                        onClick={() => handleImpersonate(tenant)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-semibold transition-colors"
                        title="Sign into this workspace immediately"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        Impersonate
                      </button>
                    )}

                    {/* Delete Tenant (Guard primary admin) */}
                    {!tenant.isAdmin && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete tenant "${tenant.name}" and all associated credentials?`)) {
                            deleteTenantUser(tenant.id);
                          }
                        }}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Delete Tenant"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Feature Permissions Quick Toggles */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Granted Feature Permissions
                    </span>
                    <span className="text-[11px] text-slate-400">Click any badge to toggle access</span>
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
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                            isAllowed
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 line-through'
                          }`}
                          title={`Toggle ${perm.label} for ${tenant.name}`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{perm.label}</span>
                          {isAllowed ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <AlertCircle className="w-3 h-3 text-slate-400" />
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

      {/* Add New Tenant Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Add New Tenant / User</h3>
                  <p className="text-xs text-slate-500">
                    Spawns an isolated customer workspace with custom credentials and localhost URL
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-lg p-1"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateTenant} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    User Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Organization / Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Apex Logistics"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
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
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    URL Slug: <code className="text-emerald-500">?tenant={formData.username || 'username'}</code>
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="e.g. Ramesh@2026"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ramesh@company.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Plan Tier
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Starter Plan">Starter Plan (Free)</option>
                    <option value="Pro Plan">Pro Plan (₹2,499/mo)</option>
                    <option value="Enterprise Scale">Enterprise Scale (₹9,999/mo)</option>
                  </select>
                </div>
              </div>

              {/* Granular Feature Permissions Checklist */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
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
                      className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer text-xs"
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
                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold shadow-lg shadow-emerald-500/25 flex items-center gap-2"
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
