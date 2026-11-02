'use client';

import { useState } from 'react';
import { X, Check, ArrowLeft, ShieldCheck, Sparkles, Building2 } from 'lucide-react';
import { SUBSCRIPTION_PLANS, formatCurrencyINR } from '@/lib/sampleData';
import { Plan } from '@/types';
import { triggerToast } from '@/hooks/useToast';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlanId?: string;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  currentPlanId = 'growth_pro',
}: SubscriptionModalProps) {
  const [stage, setStage] = useState<1 | 2>(1);
  const [selectedPlan, setSelectedPlan] = useState<Plan>(
    SUBSCRIPTION_PLANS.find((p) => p.id === currentPlanId) || SUBSCRIPTION_PLANS[1]
  );

  if (!isOpen) return null;

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan);
    setStage(2);
  };

  const handleConfirm = () => {
    triggerToast(
      'success',
      'Subscription Activated',
      `Your wholesale seller account has been activated on the ${selectedPlan.name} plan.`
    );
    setStage(1);
    onClose();
  };

  const handleClose = () => {
    setStage(1);
    onClose();
  };

  const gstAmount = Math.round(selectedPlan.price * 0.18);
  const totalAmount = selectedPlan.price + gstAmount;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
    >
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-[#E2E1EC] max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E2E1EC] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            {stage === 2 && (
              <button
                type="button"
                onClick={() => setStage(1)}
                className="h-9 w-9 rounded-lg border border-[#E2E1EC] text-[#5A586E] hover:text-[#100E26] hover:bg-[#F7F7FB] flex items-center justify-center transition-colors"
                title="Back to plan comparison"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-[#EEF2FF] text-[#4E45D5]">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h2
                  className="text-xl font-bold text-[#100E26]"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {stage === 1 ? 'TexLoom Seller Membership Plans' : 'Confirm Wholesale Plan Subscription'}
                </h2>
              </div>
              <p className="text-xs text-[#5A586E] mt-0.5">
                {stage === 1
                  ? 'Choose the tier suited for your daily fabric turnover, active loom count, and pan-India buyer network.'
                  : 'Review order details and tax invoice summary before activating.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#9493A8] hover:text-[#100E26] hover:bg-[#F7F7FB] transition-colors"
            aria-label="Close subscription modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {stage === 1 ? (
            /* STAGE 1: 3 Plan Cards */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SUBSCRIPTION_PLANS.map((plan) => {
                const isPopular = Boolean(plan.popular);

                return (
                  <div
                    key={plan.id}
                    className={`relative rounded-xl border flex flex-col justify-between p-5 transition-all ${
                      isPopular
                        ? 'border-[#4E45D5] ring-2 ring-[#4E45D5]/15 bg-white shadow-md'
                        : 'border-[#E2E1EC] bg-white hover:border-[#CBC9D9]'
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4E45D5] text-white text-[11px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                        Recommended for Mills
                      </div>
                    )}

                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-[#100E26]">{plan.name}</h3>
                        {currentPlanId === plan.id && (
                          <span className="text-[10px] font-semibold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#5A586E] mt-1 min-h-[34px] leading-relaxed">
                        {plan.description}
                      </p>

                      <div className="mt-4 pb-4 border-b border-[#E2E1EC]">
                        <span className="text-3xl font-bold text-[#100E26] font-tabular">
                          {formatCurrencyINR(plan.price)}
                        </span>
                        <span className="text-xs text-[#5A586E] font-medium ml-1">
                          {plan.period}
                        </span>
                      </div>

                      {/* Features List */}
                      <ul className="mt-4 space-y-2.5">
                        {plan.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-xs text-[#100E26]">
                            <span className="mt-0.5 p-0.5 rounded-full bg-[#ECFDF5] text-[#059669] shrink-0">
                              <Check className="w-3 h-3" />
                            </span>
                            <span className="leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-6 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSelectPlan(plan)}
                        className={`w-full h-10 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                          isPopular
                            ? 'bg-[#4E45D5] hover:bg-[#6860EF] text-white shadow-sm'
                            : 'border border-[#E2E1EC] bg-white text-[#100E26] hover:bg-[#F7F7FB]'
                        }`}
                      >
                        Select {plan.name}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* STAGE 2: Selected Plan Details + Billing Summary */
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-[#F7F7FB] border border-[#E2E1EC] rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#4E45D5]">
                      Selected Membership Tier
                    </span>
                    <h3 className="text-2xl font-bold text-[#100E26] mt-1">
                      {selectedPlan.name}
                    </h3>
                    <p className="text-xs text-[#5A586E] mt-1">
                      {selectedPlan.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#100E26] font-tabular">
                      {formatCurrencyINR(selectedPlan.price)}
                    </div>
                    <div className="text-xs text-[#5A586E]">{selectedPlan.period}</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#E2E1EC]/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedPlan.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[#100E26]">
                      <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Summary Box */}
              <div className="border border-[#E2E1EC] rounded-xl p-5 bg-white space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#100E26]">
                  Invoice & Billing Breakdown
                </h4>

                <div className="space-y-2 text-sm text-[#5A586E] pt-2">
                  <div className="flex justify-between font-tabular">
                    <span>Base Tier Subscription ({selectedPlan.name})</span>
                    <span className="text-[#100E26] font-medium">
                      {formatCurrencyINR(selectedPlan.price)}
                    </span>
                  </div>

                  <div className="flex justify-between font-tabular">
                    <span>GST (18% Integrated Goods & Services Tax)</span>
                    <span className="text-[#100E26] font-medium">
                      {formatCurrencyINR(gstAmount)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-[#059669]">
                    <span>TexLoom Wholesale Verified Seller Credit</span>
                    <span>- ₹0 (Promo Applied)</span>
                  </div>

                  <div className="pt-3 border-t border-[#E2E1EC] flex justify-between items-baseline text-base font-bold text-[#100E26] font-tabular">
                    <span>Total Amount Payable</span>
                    <span className="text-2xl text-[#4E45D5]">
                      {formatCurrencyINR(totalAmount)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-lg bg-[#EEF2FF] text-xs text-[#4338CA] flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>
                    Billed monthly to your registered GST profile. Instant activation upon confirmation.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E2E1EC] bg-white flex items-center justify-between shrink-0">
          {stage === 2 ? (
            <>
              <button
                type="button"
                onClick={() => setStage(1)}
                className="h-10 px-4 rounded-lg border border-[#E2E1EC] text-sm font-medium text-[#100E26] hover:bg-[#F7F7FB] transition-colors"
              >
                Back to Plans
              </button>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="h-10 px-4 rounded-lg border border-[#E2E1EC] text-sm font-medium text-[#100E26] hover:bg-[#F7F7FB] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="h-10 px-5 rounded-lg bg-[#4E45D5] hover:bg-[#6860EF] text-white text-sm font-semibold shadow-sm transition-all inline-flex items-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Confirm Subscription</span>
                </button>
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <span className="text-xs text-[#5A586E]">
                Need custom multi-loom composite licensing? Contact seller support.
              </span>
              <button
                type="button"
                onClick={handleClose}
                className="h-10 px-4 rounded-lg border border-[#E2E1EC] text-sm font-medium text-[#100E26] hover:bg-[#F7F7FB] transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
