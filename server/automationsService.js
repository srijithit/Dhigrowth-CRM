import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUTOMATIONS_FILE = path.resolve(__dirname, 'automationsStore.json');

const DEFAULT_STARTER_AUTOMATIONS = [
  {
    id: 'auto_welcome_greeting',
    name: 'WhatsApp AI Welcome & Service Menu',
    description: 'Instantly send interactive button card & service menu on first customer message',
    trigger: 'First Inbound Message',
    triggerCondition: 'First message from new contact or 24h inactive',
    action: 'Dispatch Interactive Greeting',
    actionDetails: 'Send button card with App Dev, CRM, and AI Solutions',
    status: 'Active',
    runs: 142,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastRunAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 'auto_app_inquiry',
    name: 'Mobile & Web App Funnel',
    description: 'Auto-respond with portfolio deck when customer asks about apps or websites',
    trigger: 'Keyword Match',
    triggerCondition: 'Matches: "app", "website", "ios", "android", "1"',
    action: 'Send Portfolio & Tech Deck',
    actionDetails: 'Send Flutter & React Native portfolio with consultation link',
    status: 'Active',
    runs: 89,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastRunAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'auto_crm_funnel',
    name: 'WhatsApp CRM & Auto-Pilot Funnel',
    description: 'Explain WhatsApp API features and pricing when requested',
    trigger: 'Keyword Match',
    triggerCondition: 'Matches: "crm", "auto-pilot", "whatsapp api", "2"',
    action: 'Send WhatsApp CRM Overview',
    actionDetails: 'Send Cloud API features, lead funnels, and pricing plans',
    status: 'Active',
    runs: 64,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    lastRunAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'auto_agent_handoff',
    name: 'High-Intent Human Agent Handoff',
    description: 'Assign to live human agent when user asks for quote, call, or urgent help',
    trigger: 'Keyword Match',
    triggerCondition: 'Matches: "quote", "call", "urgent", "human", "talk"',
    action: 'Assign to Agent & Pause AI',
    actionDetails: 'Move to Manual Agent mode and notify team inbox',
    status: 'Active',
    runs: 31,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastRunAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
  },
];

let store = {
  workspaces: {},
};

export function initAutomationsStore() {
  try {
    if (fs.existsSync(AUTOMATIONS_FILE)) {
      const data = JSON.parse(fs.readFileSync(AUTOMATIONS_FILE, 'utf-8'));
      store = { workspaces: data.workspaces || {} };
      console.log(`⚡ [AutomationsService] Loaded automations for ${Object.keys(store.workspaces).length} workspaces`);
    } else {
      store.workspaces['b0000000-0000-0000-0000-000000000001'] = [...DEFAULT_STARTER_AUTOMATIONS];
      saveAutomationsToDisk();
      console.log('⚡ [AutomationsService] Seeded starter automations store');
    }
  } catch (err) {
    console.warn('[AutomationsService] Init error:', err.message);
    store.workspaces['b0000000-0000-0000-0000-000000000001'] = [...DEFAULT_STARTER_AUTOMATIONS];
  }
}

function saveAutomationsToDisk() {
  try {
    fs.writeFileSync(AUTOMATIONS_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[AutomationsService] Save error:', err.message);
  }
}

export function getWorkspaceAutomations(workspaceId = 'b0000000-0000-0000-0000-000000000001') {
  if (!store.workspaces[workspaceId] || store.workspaces[workspaceId].length === 0) {
    store.workspaces[workspaceId] = JSON.parse(JSON.stringify(DEFAULT_STARTER_AUTOMATIONS));
    saveAutomationsToDisk();
  }
  return store.workspaces[workspaceId];
}

export function createAutomation({
  workspaceId = 'b0000000-0000-0000-0000-000000000001',
  name,
  description,
  trigger = 'Keyword Match',
  triggerCondition = '',
  action = 'Send WhatsApp Catalog',
  actionDetails = '',
}) {
  const list = getWorkspaceAutomations(workspaceId);
  const newAuto = {
    id: `auto_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name?.trim() || 'New Automation Rule',
    description: description?.trim() || 'Automatically triggered workflow',
    trigger,
    triggerCondition: triggerCondition || 'Always active',
    action,
    actionDetails: actionDetails || 'Execute default action',
    status: 'Active',
    runs: 0,
    createdAt: new Date().toISOString(),
    lastRunAt: null,
  };

  list.unshift(newAuto);
  saveAutomationsToDisk();
  return newAuto;
}

export function updateAutomation(workspaceId, automationId, updates = {}) {
  const list = getWorkspaceAutomations(workspaceId);
  const idx = list.findIndex((a) => a.id === automationId);
  if (idx === -1) {
    throw new Error(`Automation ${automationId} not found`);
  }

  const updated = {
    ...list[idx],
    ...updates,
    id: list[idx].id,
    createdAt: list[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  saveAutomationsToDisk();
  return updated;
}

export function deleteAutomation(workspaceId, automationId) {
  const list = getWorkspaceAutomations(workspaceId);
  const beforeLen = list.length;
  store.workspaces[workspaceId] = list.filter((a) => a.id !== automationId);

  if (store.workspaces[workspaceId].length === beforeLen) {
    throw new Error(`Automation ${automationId} not found`);
  }

  saveAutomationsToDisk();
  return { success: true, deletedId: automationId };
}

export function toggleAutomationStatus(workspaceId, automationId) {
  const list = getWorkspaceAutomations(workspaceId);
  const auto = list.find((a) => a.id === automationId);
  if (!auto) {
    throw new Error(`Automation ${automationId} not found`);
  }

  auto.status = auto.status === 'Active' ? 'Paused' : 'Active';
  auto.updatedAt = new Date().toISOString();
  saveAutomationsToDisk();
  return auto;
}

export function testTriggerAutomation(workspaceId, automationId) {
  const list = getWorkspaceAutomations(workspaceId);
  const auto = list.find((a) => a.id === automationId);
  if (!auto) {
    throw new Error(`Automation ${automationId} not found`);
  }

  auto.runs = (auto.runs || 0) + 1;
  auto.lastRunAt = new Date().toISOString();
  saveAutomationsToDisk();

  return {
    success: true,
    automation: auto,
    message: `Trigger executed: "${auto.name}" ran successfully!`,
  };
}
