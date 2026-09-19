import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DRIP_FILE = path.resolve(__dirname, 'dripStore.json');

const DEFAULT_STARTER_DRIPS = [
  {
    id: 'drip_hot_fasttrack',
    name: 'Hot Lead Fast-Track Nurture',
    category: 'lead_stage',
    trigger: 'Hot',
    delay: '1 day(s)',
    status: 'Active',
    enrolled: 124,
    delivered: 120,
    steps: [
      { step: 1, delay: 'Instant', action: 'Send Product Deck & Client Case Studies' },
      { step: 2, delay: 'After 1 Day', action: 'Offer 1-on-1 Consultation Call Link' },
    ],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastTriggerAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
  },
  {
    id: 'drip_cart_recovery',
    name: 'Abandoned Cart 24-Hour Recovery',
    category: 'cart_recovery',
    trigger: 'Interested',
    delay: '2 day(s)',
    status: 'Active',
    enrolled: 86,
    delivered: 82,
    steps: [
      { step: 1, delay: 'After 1 Hour', action: 'Send 10% Discount Promo Code (LAUNCH10)' },
      { step: 2, delay: 'After 24 Hours', action: 'Send Direct WhatsApp Checkout Link' },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    lastTriggerAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'drip_post_purchase',
    name: 'Post-Purchase VIP Loyalty Sequence',
    category: 'post_purchase',
    trigger: 'Converted',
    delay: '7 day(s)',
    status: 'Active',
    enrolled: 210,
    delivered: 204,
    steps: [
      { step: 1, delay: 'Day 3', action: 'Product Setup & Onboarding Guide' },
      { step: 2, delay: 'Day 7', action: 'Google Review Request & Feedback Survey' },
      { step: 3, delay: 'Day 14', action: '₹500 Referral Bonus Invitation' },
    ],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    lastTriggerAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'drip_cold_reactivation',
    name: 'Cold Lead Re-engagement Winback',
    category: 'lead_stage',
    trigger: 'Cold',
    delay: '15 day(s)',
    status: 'Active',
    enrolled: 95,
    delivered: 91,
    steps: [
      { step: 1, delay: 'Day 15', action: 'Share Major New Feature & AI Enhancements' },
      { step: 2, delay: 'Day 30', action: 'Exclusive Reactivation 20% Voucher' },
    ],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    lastTriggerAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

let store = {
  workspaces: {},
};

export function initDripStore() {
  try {
    if (fs.existsSync(DRIP_FILE)) {
      const data = JSON.parse(fs.readFileSync(DRIP_FILE, 'utf-8'));
      store = { workspaces: data.workspaces || {} };
      console.log(`💧 [DripService] Loaded drip campaigns for ${Object.keys(store.workspaces).length} workspaces`);
    } else {
      store.workspaces['b0000000-0000-0000-0000-000000000001'] = [...DEFAULT_STARTER_DRIPS];
      saveDripToDisk();
      console.log('💧 [DripService] Seeded starter drip campaigns store');
    }
  } catch (err) {
    console.warn('[DripService] Init error:', err.message);
    store.workspaces['b0000000-0000-0000-0000-000000000001'] = [...DEFAULT_STARTER_DRIPS];
  }
}

function saveDripToDisk() {
  try {
    fs.writeFileSync(DRIP_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[DripService] Save error:', err.message);
  }
}

export function getWorkspaceDrips(workspaceId = 'b0000000-0000-0000-0000-000000000001') {
  if (!store.workspaces[workspaceId] || store.workspaces[workspaceId].length === 0) {
    store.workspaces[workspaceId] = JSON.parse(JSON.stringify(DEFAULT_STARTER_DRIPS));
    saveDripToDisk();
  }
  return store.workspaces[workspaceId];
}

export function createDripCampaign({
  workspaceId = 'b0000000-0000-0000-0000-000000000001',
  name,
  category = 'lead_stage',
  trigger = 'Hot',
  delay = '1 day(s)',
  steps = [],
}) {
  const list = getWorkspaceDrips(workspaceId);
  const newDrip = {
    id: `drip_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name?.trim() || 'New Drip Campaign',
    category,
    trigger,
    delay: delay || '1 day(s)',
    status: 'Active',
    enrolled: 0,
    delivered: 0,
    steps: steps.length > 0 ? steps : [
      { step: 1, delay: 'Instant', action: 'Send Introduction & Welcome Greeting' },
      { step: 2, delay: delay, action: 'Follow-up with Demo Booking Link' },
    ],
    createdAt: new Date().toISOString(),
    lastTriggerAt: null,
  };

  list.unshift(newDrip);
  saveDripToDisk();
  return newDrip;
}

export function updateDripCampaign(workspaceId, dripId, updates = {}) {
  const list = getWorkspaceDrips(workspaceId);
  const idx = list.findIndex((d) => d.id === dripId);
  if (idx === -1) {
    throw new Error(`Drip campaign ${dripId} not found`);
  }

  const updated = {
    ...list[idx],
    ...updates,
    id: list[idx].id,
    createdAt: list[idx].createdAt,
    updatedAt: new Date().toISOString(),
  };

  list[idx] = updated;
  saveDripToDisk();
  return updated;
}

export function deleteDripCampaign(workspaceId, dripId) {
  const list = getWorkspaceDrips(workspaceId);
  const beforeLen = list.length;
  store.workspaces[workspaceId] = list.filter((d) => d.id !== dripId);

  if (store.workspaces[workspaceId].length === beforeLen) {
    throw new Error(`Drip campaign ${dripId} not found`);
  }

  saveDripToDisk();
  return { success: true, deletedId: dripId };
}

export function toggleDripStatus(workspaceId, dripId) {
  const list = getWorkspaceDrips(workspaceId);
  const drip = list.find((d) => d.id === dripId);
  if (!drip) {
    throw new Error(`Drip campaign ${dripId} not found`);
  }

  drip.status = drip.status === 'Active' ? 'Paused' : 'Active';
  drip.updatedAt = new Date().toISOString();
  saveDripToDisk();
  return drip;
}

export function testTriggerDrip(workspaceId, dripId) {
  const list = getWorkspaceDrips(workspaceId);
  const drip = list.find((d) => d.id === dripId);
  if (!drip) {
    throw new Error(`Drip campaign ${dripId} not found`);
  }

  drip.enrolled = (drip.enrolled || 0) + 1;
  drip.delivered = (drip.delivered || 0) + 1;
  drip.lastTriggerAt = new Date().toISOString();
  saveDripToDisk();

  return {
    success: true,
    drip,
    message: `Drip sequence "${drip.name}" triggered! Contact enrolled into Step 1.`,
  };
}
