import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/layout/Toast';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { TeamInbox } from './components/inbox/TeamInbox';
import { AiStudio } from './components/ai-studio/AiStudio';
import { ToolsPage } from './components/tools/ToolsPage';
import { LeadStudioPage } from './components/lead-studio/LeadStudioPage';
import { LeadSegmentationPage } from './components/segmentation/LeadSegmentationPage';
import { CampaignManager } from './components/campaigns/CampaignManager';
import { DripCampaignsPage } from './components/campaigns/DripCampaignsPage';
import { AutomationsPage } from './components/automations/AutomationsPage';
import { TemplatesPage } from './components/templates/TemplatesPage';
import { FileManagerPage } from './components/files/FileManagerPage';
import { LeadsCrm } from './components/leads/LeadsCrm';
import { MetaCapiEvents } from './components/capi/MetaCapiEvents';
import { ConnectedChannelsPage } from './components/channels/ConnectedChannelsPage';
import { WhatsAppBusinessPage } from './components/channels/WhatsAppBusinessPage';
import { InstagramChannelPage } from './components/channels/InstagramChannelPage';
import { MessengerChannelPage } from './components/channels/MessengerChannelPage';
import { LineChannelPage } from './components/channels/LineChannelPage';
import { ShopifyIntegrationPage } from './components/integrations/ShopifyIntegrationPage';
import { ZohoIntegrationPage } from './components/integrations/ZohoIntegrationPage';
import { ApiWebhooksPage } from './components/api-keys/ApiWebhooksPage';
import { IntegrationsHubPage } from './components/integrations/IntegrationsHubPage';
import { OrganizationSettingsPage } from './components/settings/OrganizationSettingsPage';
import { WalletPage } from './components/wallet/WalletPage';
import { PlansPricingPage } from './components/plans/PlansPricingPage';
import { UsageLimitsPage } from './components/usage/UsageLimitsPage';
import { InsightsPage } from './components/insights/InsightsPage';
import { UpgradeModal } from './components/modals/UpgradeModal';
import { UsageModal } from './components/modals/UsageModal';
import { SearchCommandPalette } from './components/modals/SearchCommandPalette';
import { SendieeWidgetModal } from './components/modals/SendieeWidgetModal';
import { LoginPage } from './components/auth/LoginPage';
import { MetaApiSettings } from './components/settings/MetaApiSettings';
import { ClientPortal } from './components/portal/ClientPortal';
import { AdminTopBar } from './components/layout/AdminTopBar';
import { SuperAdminTenantsPage } from './components/admin/SuperAdminTenantsPage';
import { CheckoutModal } from './components/billing/CheckoutModal';
import { FeaturePaywall } from './components/common/FeaturePaywall';

const AppContent = () => {
  const {
    activeTab,
    isAuthenticated,
    currentUser,
    adminViewProfile,
    switchAdminProfile,
    clientViewMode,
    subscription,
  } = useApp();

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage />
        <Toast />
      </>
    );
  }

  const isAdmin = currentUser?.isAdmin || currentUser?.username?.toLowerCase() === 'admin';
  const isDirectKiki = currentUser?.isExternalClient || currentUser?.username?.toLowerCase() === 'kiki';

  // If user explicitly selected the isolated BYOK Client Portal view:
  const shouldShowClientPortal = (isDirectKiki || (isAdmin && adminViewProfile === 'kiki')) && clientViewMode === 'portal';

  if (shouldShowClientPortal) {
    return (
      <div className="flex flex-col min-h-screen">
        {isAdmin && (
          <AdminTopBar
            activeProfile={adminViewProfile}
            onSwitchProfile={switchAdminProfile}
          />
        )}
        <ClientPortal />
        <Toast />
        <BroadcastDueModal />
      </div>
    );
  }

  const isPaidActive = subscription?.status === 'active';

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'inbox':
        return <TeamInbox />;
      case 'channels':
        return <ConnectedChannelsPage />;
      case 'channel-whatsapp':
      case 'whatsapp':
        return <WhatsAppBusinessPage />;
      case 'channel-instagram':
      case 'instagram':
        return <InstagramChannelPage />;
      case 'channel-messenger':
      case 'messenger':
        return <MessengerChannelPage />;
      case 'channel-line':
      case 'line':
        return <LineChannelPage />;
      case 'shopify':
        return <ShopifyIntegrationPage />;
      case 'zoho':
        return <ZohoIntegrationPage />;
      case 'api':
        return <ApiWebhooksPage />;
      case 'meta-api':
      case 'meta_api':
      case 'meta-settings':
        return <MetaApiSettings />;
      case 'apps':
      case 'integrations':
        return <IntegrationsHubPage />;
      case 'wallet':
        return <WalletPage />;
      case 'plans':
        return <PlansPricingPage />;
      case 'usage':
      case 'limits':
        return <UsageLimitsPage />;
      case 'settings':
      case 'manage':
        return <OrganizationSettingsPage />;
      case 'insights':
        return <InsightsPage />;
      case 'tools':
        return isPaidActive ? (
          <ToolsPage />
        ) : (
          <FeaturePaywall
            featureTitle="AI Function Tools & External Webhooks"
            featureDescription="Connect custom API endpoints, CRM webhooks, and live databases directly into your AI autonomous agents."
            requiredPlan="Growth"
          />
        );
      case 'lead-studio':
        return isPaidActive ? (
          <LeadStudioPage />
        ) : (
          <FeaturePaywall
            featureTitle="AI Lead Studio & Audience Enricher"
            featureDescription="Automatically enrich inbound WhatsApp and Instagram leads with verified company intel, email lookups, and qualification scores."
            requiredPlan="Growth"
          />
        );
      case 'segmentation':
        return isPaidActive ? (
          <LeadSegmentationPage />
        ) : (
          <FeaturePaywall
            featureTitle="Smart Lead Segmentation"
            featureDescription="Filter and segment your contacts with high-precision criteria, custom tags, deal stages, and AI buyer intent."
            requiredPlan="Growth"
          />
        );
      case 'ai-assistants':
      case 'ai-studio':
        return isPaidActive ? (
          <AiStudio />
        ) : (
          <FeaturePaywall
            featureTitle="AI Studio & Autonomous Auto-Pilot Agents"
            featureDescription="Deploy 24/7 autonomous WhatsApp, Instagram, and Messenger AI agents trained on your custom company knowledge base."
            requiredPlan="Growth"
          />
        );
      case 'campaigns':
        return isPaidActive ? (
          <CampaignManager />
        ) : (
          <FeaturePaywall
            featureTitle="Mass Broadcast Campaigns"
            featureDescription="Schedule and blast official Meta pre-approved WhatsApp templates with dynamic variables ({{name}}, {{city}}, {{deal_value}}) to thousands of leads."
            requiredPlan="Growth"
          />
        );
      case 'drip-campaigns':
        return isPaidActive ? (
          <DripCampaignsPage />
        ) : (
          <FeaturePaywall
            featureTitle="Multi-Step Drip Sequences"
            featureDescription="Nurture leads automatically across minutes, hours, or days with conditional branching and automated follow-ups."
            requiredPlan="Pro"
          />
        );
      case 'automations':
        return isPaidActive ? (
          <AutomationsPage />
        ) : (
          <FeaturePaywall
            featureTitle="Event Triggers & Workflow Automations"
            featureDescription="Automate real-time triggers on keyword matches, Shopify order creation, cart abandonment, and CRM status updates."
            requiredPlan="Growth"
          />
        );
      case 'templates':
        return <TemplatesPage />;
      case 'files':
        return <FileManagerPage />;
      case 'leads':
        return <LeadsCrm />;
      case 'capi':
        return isPaidActive ? (
          <MetaCapiEvents />
        ) : (
          <FeaturePaywall
            featureTitle="Meta Conversions API (CAPI)"
            featureDescription="Send server-side purchase and lead conversion events directly to Meta Ads Manager for 10x ROAS attribution."
            requiredPlan="Pro"
          />
        );
      case 'super-admin':
      case 'tenants':
      case 'tenant-management':
        return <SuperAdminTenantsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#F8F9FC] text-[#101828] font-sans antialiased">
      {isAdmin && (
        <AdminTopBar
          activeProfile={adminViewProfile}
          onSwitchProfile={switchAdminProfile}
        />
      )}

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar navigation */}
        <Sidebar />

        {/* Main App Container */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <Header />
          <main className={`flex-1 min-w-0 ${activeTab === 'inbox' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
            {renderActiveView()}
          </main>
        </div>
      </div>

      {/* Interactive Global Modals */}
      <CheckoutModal />
      <UpgradeModal />
      <UsageModal />
      <SearchCommandPalette />
      <SendieeWidgetModal />
      <Toast />
      <BroadcastDueModal />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
