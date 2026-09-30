import React from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { PlanPricing } from '../types/landing.types';

interface PricingSectionProps {
  plans: PlanPricing[];
  billingCycle: 'monthly' | 'yearly';
  onBillingCycleChange: (cycle: 'monthly' | 'yearly') => void;
  onSelectPlan: (planId: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  plans,
  billingCycle,
  onBillingCycleChange,
  onSelectPlan,
}) => {
  return (
    <section id="pricing" className="py-16 sm:py-24 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold mb-3">
            <span>Transparent Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple, Transparent Plans For Teams of Any Size
          </h2>
          <p className="text-base text-slate-600 mt-3">
            No hidden seat surcharges. Upgrade or downgrade anytime with prorated billing.
          </p>

          {/* Billing Cycle Toggle (Light Mode) */}
          <div className="mt-8 inline-flex items-center p-1 bg-slate-100 border border-slate-200/80 rounded-2xl">
            <button
              onClick={() => onBillingCycleChange('monthly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => onBillingCycleChange('yearly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Annual Billing</span>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const displayPrice =
              plan.id === 'starter'
                ? 'Free'
                : plan.id === 'enterprise'
                ? 'Custom'
                : billingCycle === 'yearly'
                ? plan.price.yearly
                : plan.price.monthly;

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all relative ${
                  plan.popular
                    ? 'bg-white border-2 border-indigo-600 shadow-xl shadow-indigo-100/50 scale-[1.02]'
                    : 'bg-white border border-slate-200/80 shadow-xs hover:shadow-md'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Most Popular</span>
                  </div>
                )}

                <div>
                  <div className="text-lg font-bold text-slate-900 mb-1">{plan.name}</div>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">{plan.description}</p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-slate-100">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight">
                      {displayPrice}
                    </span>
                    {plan.period && plan.id !== 'starter' && plan.id !== 'enterprise' && (
                      <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 mb-8">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Included in {plan.name}:
                    </div>
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                        <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  id={`pricing-plan-${plan.id}-btn`}
                  onClick={() => onSelectPlan(plan.id)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    plan.popular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
