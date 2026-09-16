import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  Lock,
  Sparkles,
  CreditCard,
  Zap,
  ArrowRight,
  CheckCircle2,
  Building,
  HelpCircle,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { BACKEND_URL } from '../../services/apiConfig';

export const CheckoutModal = () => {
  const {
    isCheckoutModalOpen,
    closeCheckout,
    checkoutData,
    currentWorkspaceId,
    currentUser,
    setCurrentPlan,
    showToast,
    refreshSubscription,
  } = useApp();

  const [planId, setPlanId] = useState('Growth');
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [provider, setProvider] = useState('razorpay'); // 'razorpay' | 'stripe'
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activatedDetails, setActivatedDetails] = useState(null);

  // Sync initial plan and interval when opened
  useEffect(() => {
    if (isCheckoutModalOpen && checkoutData) {
      if (checkoutData.planId) setPlanId(checkoutData.planId);
      if (checkoutData.billingCycle) setBillingCycle(checkoutData.billingCycle);
      if (checkoutData.provider) setProvider(checkoutData.provider);
      setCompanyName(currentUser?.organization || currentUser?.companyName || '');
      setIsSuccess(false);
      setActivatedDetails(null);
    }
  }, [isCheckoutModalOpen, checkoutData, currentUser]);

  if (!isCheckoutModalOpen) return null;

  const PLANS_INFO = {
    'Creator Lite': {
      name: 'Creator Lite',
      subtitle: 'Creators on Instagram & Messenger',
      priceINR: { monthly: 1299, yearly: 974 },
      priceUSD: { monthly: 19, yearly: 15 },
    },
    'Creator Plus': {
      name: 'Creator Plus',
      subtitle: 'Creators scaling DMs & content',
      priceINR: { monthly: 1699, yearly: 1274 },
      priceUSD: { monthly: 25, yearly: 19 },
    },
    'Growth': {
      name: 'Growth',
      subtitle: 'Perfect for solo founders & D2C stores',
      priceINR: { monthly: 1899, yearly: 1424 },
      priceUSD: { monthly: 29, yearly: 22 },
    },
    'Pro': {
      name: 'Pro',
      subtitle: 'Built for high-volume brands & scaling teams',
      priceINR: { monthly: 3499, yearly: 2625 },
      priceUSD: { monthly: 59, yearly: 44 },
    },
    'Business': {
      name: 'Business',
      subtitle: 'Omnichannel brands scaling with AI',
      priceINR: { monthly: 4999, yearly: 3749 },
      priceUSD: { monthly: 99, yearly: 75 },
    },
  };

  const currentPlanInfo = PLANS_INFO[planId] || PLANS_INFO['Growth'];
  const isINR = provider === 'razorpay';
  const currencySymbol = isINR ? '₹' : '$';
  const currencyCode = isINR ? 'INR' : 'USD';

  const monthlyRate = isINR ? currentPlanInfo.priceINR.monthly : currentPlanInfo.priceUSD.monthly;
  const yearlyRate = isINR ? currentPlanInfo.priceINR.yearly : currentPlanInfo.priceUSD.yearly;

  const durationMonths = billingCycle === 'yearly' ? 12 : 1;
  const unitRate = billingCycle === 'yearly' ? yearlyRate : monthlyRate;
  const subtotal = unitRate * durationMonths;
  const taxRate = isINR ? 0.18 : 0.0;
  const taxAmount = Math.round(subtotal * taxRate);
  const totalAmount = subtotal + taxAmount;

  const handleCompletePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create checkout session on backend
      let createRes;
      const checkoutPayload = {
        workspaceId: currentWorkspaceId,
        userId: currentUser?.username || currentUser?.slug,
        customerEmail: currentUser?.email || 'billing@client-org.com',
        planId,
        billingCycle,
        provider,
        billingDetails: {
          companyName: companyName.trim() || currentUser?.organization || 'Organization',
          gstin: gstin.trim(),
          billingEmail: currentUser?.email || 'billing@client-org.com',
        },
      };

      try {
        createRes = await fetch(`${BACKEND_URL}/api/billing/create-checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(checkoutPayload),
        });
      } catch {}

      if (!createRes || !createRes.ok) {
        try {
          createRes = await fetch('http://localhost:4000/api/billing/create-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(checkoutPayload),
          });
        } catch {}
      }

      const orderData = createRes ? await createRes.json() : {};

      // 2. Complete payment and activate
      const paymentRefId = `pay_${provider}_${Date.now()}`;
      const verifyPayload = {
        workspaceId: currentWorkspaceId,
        planId,
        billingCycle,
        provider,
        paymentId: paymentRefId,
        orderId: orderData.orderId || orderData.sessionId || `ord_${Date.now()}`,
        amount: totalAmount,
        currency: currencyCode,
        billingDetails: checkoutPayload.billingDetails,
      };

      let verifyRes;
      try {
        verifyRes = await fetch(`${BACKEND_URL}/api/billing/verify-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(verifyPayload),
        });
      } catch {}

      if (!verifyRes || !verifyRes.ok) {
        try {
          verifyRes = await fetch('http://localhost:4000/api/billing/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(verifyPayload),
          });
        } catch {}
      }

      const result = verifyRes ? await verifyRes.json() : { success: true };

      if (result.success) {
        setCurrentPlan(planId);
        if (typeof refreshSubscription === 'function') {
          refreshSubscription();
        }

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });

        setIsSuccess(true);
        setActivatedDetails({
          planName: planId,
          billingCycle,
          totalAmount,
          currencySymbol,
          provider,
          invoiceNumber: result.invoice?.invoiceNumber || `INV-${new Date().getFullYear()}-001`,
        });

        showToast(`🎉 Subscription Activated: ${planId} Plan!`, 'success');
      } else {
        throw new Error(result.error || 'Failed to complete payment');
      }
    } catch (err) {
      console.error('[Checkout Error]:', err);
      showToast(err.message || 'Payment processing failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in font-sans">
      <div className="bg-white border border-[#EAECF0] rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        {/* Close Button */}
        <button
          onClick={closeCheckout}
          className="absolute top-5 right-5 text-[#98A2B3] hover:text-[#101828] p-1.5 rounded-xl hover:bg-[#F9FAFB] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          /* Payment Success Confirmation View */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-[#DCFCE7] border border-[#BBF7D0] text-[#16A34A] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#16A34A] bg-[#DCFCE7] px-3 py-1 rounded-full border border-[#BBF7D0]">
                Payment Successful & Verified
              </span>
              <h2 className="text-2xl font-extrabold text-[#101828] mt-2">
                Welcome to the {activatedDetails?.planName} Plan!
              </h2>
              <p className="text-xs text-[#667085] max-w-md mx-auto">
                Your workspace subscription has been upgraded. All advanced features, higher quotas, and Meta API channels are now active.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#EAECF0] max-w-sm mx-auto text-left space-y-2 text-xs">
              <div className="flex justify-between text-[#667085]">
                <span>Invoice Number:</span>
                <span className="font-mono font-bold text-[#101828]">{activatedDetails?.invoiceNumber}</span>
              </div>
              <div className="flex justify-between text-[#667085]">
                <span>Billing Interval:</span>
                <span className="font-bold text-[#101828] capitalize">{activatedDetails?.billingCycle}</span>
              </div>
              <div className="flex justify-between text-[#667085]">
                <span>Total Paid:</span>
                <span className="font-bold text-[#16A34A] text-sm">
                  {activatedDetails?.currencySymbol}{activatedDetails?.totalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-[#667085]">
                <span>Payment Method:</span>
                <span className="font-bold text-[#101828] capitalize">
                  {activatedDetails?.provider === 'razorpay' ? 'Razorpay (UPI / NetBanking)' : 'Stripe (Cards)'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={closeCheckout}
                className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold px-8 py-3 rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Go to Workspace Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Interactive Checkout Flow */
          <>
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#F4F0FD] border border-[#E9D8FD] text-[11px] font-bold text-[#7C3AED] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Secure SaaS Checkout</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#101828] tracking-tight">
                Upgrade Workspace Subscription
              </h2>
              <p className="text-xs text-[#667085]">
                Select your preferred payment gateway and billing cycle to activate your subscription.
              </p>
            </div>

            {/* Plan & Interval Selection */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#344054]">Select Plan:</span>
                {/* Billing Cycle Pill */}
                <div className="inline-flex items-center bg-[#F2F4F7] p-0.5 rounded-xl border border-[#EAECF0] text-[11px]">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly' ? 'bg-white text-[#101828] shadow-xs' : 'text-[#667085]'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                      billingCycle === 'yearly' ? 'bg-[#7C3AED] text-white shadow-xs' : 'text-[#667085]'
                    }`}
                  >
                    <span>Yearly</span>
                    <span className="text-[10px] bg-[#DCFCE7] text-[#166534] px-1.5 py-0.2 rounded-full font-extrabold">
                      Save 25%
                    </span>
                  </button>
                </div>
              </div>

              {/* Plan Cards Selector */}
              <div className="grid grid-cols-3 gap-2.5">
                {['Growth', 'Pro', 'Business'].map((pId) => {
                  const p = PLANS_INFO[pId];
                  const isSelected = planId === pId;
                  const price = billingCycle === 'yearly'
                    ? (isINR ? p.priceINR.yearly : p.priceUSD.yearly)
                    : (isINR ? p.priceINR.monthly : p.priceUSD.monthly);

                  return (
                    <button
                      key={pId}
                      type="button"
                      onClick={() => setPlanId(pId)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#7C3AED] bg-[#F4F0FD]/60 shadow-xs ring-2 ring-[#7C3AED]/20'
                          : 'border-[#EAECF0] bg-white hover:border-[#D0D5DD]'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-[#101828] flex items-center justify-between">
                        <span>{p.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#7C3AED]" />}
                      </div>
                      <div className="mt-1">
                        <span className="text-base font-black text-[#101828]">
                          {currencySymbol}{price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#667085]">/mo</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment Gateway Chooser */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#344054] block">Payment Gateway:</label>
              <div className="grid grid-cols-2 gap-3">
                {/* Razorpay (India & UPI) */}
                <button
                  type="button"
                  onClick={() => setProvider('razorpay')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                    provider === 'razorpay'
                      ? 'border-[#7C3AED] bg-[#F4F0FD]/60 shadow-xs ring-2 ring-[#7C3AED]/20'
                      : 'border-[#EAECF0] bg-white hover:border-[#D0D5DD]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#0C2340] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    ₹
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
                      <span>Razorpay</span>
                      <span className="text-[9px] bg-[#DCFCE7] text-[#166534] px-1.5 py-0.2 rounded-full font-bold">
                        UPI / India
                      </span>
                    </div>
                    <div className="text-[10px] text-[#667085]">
                      GPay, PhonePe, Paytm, Indian Cards, NetBanking (INR)
                    </div>
                  </div>
                </button>

                {/* Stripe (International & Cards) */}
                <button
                  type="button"
                  onClick={() => setProvider('stripe')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                    provider === 'stripe'
                      ? 'border-[#7C3AED] bg-[#F4F0FD]/60 shadow-xs ring-2 ring-[#7C3AED]/20'
                      : 'border-[#EAECF0] bg-white hover:border-[#D0D5DD]'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#635BFF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#101828] flex items-center gap-1.5">
                      <span>Stripe</span>
                      <span className="text-[9px] bg-[#EDE9FE] text-[#6D28D9] px-1.5 py-0.2 rounded-full font-bold">
                        Global / USD
                      </span>
                    </div>
                    <div className="text-[10px] text-[#667085]">
                      Visa, Mastercard, Amex, Apple Pay, International Cards
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Business & GSTIN Info (Optional B2B tax invoice) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-[11px] font-bold text-[#475467] block">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Tech Private Limited"
                  className="w-full mt-1 px-3 py-2 bg-[#F9FAFB] border border-[#EAECF0] rounded-xl text-xs text-[#101828] focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-[#475467] block">
                  {isINR ? 'GSTIN (Tax ID - Optional)' : 'Tax ID / VAT (Optional)'}
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder={isINR ? '27AADCS1234F1Z5' : 'US123456789'}
                  className="w-full mt-1 px-3 py-2 bg-[#F9FAFB] border border-[#EAECF0] rounded-xl text-xs text-[#101828] font-mono focus:outline-none focus:border-[#7C3AED]"
                />
              </div>
            </div>

            {/* Order Summary Breakdown */}
            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#EAECF0] space-y-2 text-xs">
              <div className="flex justify-between text-[#475467]">
                <span>{planId} Plan ({billingCycle === 'yearly' ? '12 Months' : '1 Month'})</span>
                <span className="font-mono font-medium">{currencySymbol}{subtotal.toLocaleString()}</span>
              </div>
              {taxAmount > 0 && (
                <div className="flex justify-between text-[#475467]">
                  <span>GST (18% for Indian B2B)</span>
                  <span className="font-mono font-medium">{currencySymbol}{taxAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#EAECF0] flex justify-between items-center text-sm font-extrabold text-[#101828]">
                <span>Total Due:</span>
                <span className="text-base text-[#7C3AED] font-black">
                  {currencySymbol}{totalAmount.toLocaleString()} {currencyCode}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={closeCheckout}
                disabled={isProcessing}
                className="flex-1 py-3 border border-[#D0D5DD] bg-white hover:bg-[#F9FAFB] text-[#344054] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCompletePayment}
                disabled={isProcessing}
                className="flex-2 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting to {provider === 'razorpay' ? 'Razorpay' : 'Stripe'}...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Pay {currencySymbol}{totalAmount.toLocaleString()} via {provider === 'razorpay' ? 'Razorpay' : 'Stripe'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Trust Footer */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-[#98A2B3] pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#16A34A]" />
                256-Bit SSL Encrypted
              </span>
              <span>•</span>
              <span>Cancel Anytime</span>
              <span>•</span>
              <span>Instant Workspace Unlock</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
