import { useState } from 'react';
import { landingService } from '../services/landingService';

export const useLanding = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeScreenTab, setActiveScreenTab] = useState<'overview' | 'projects' | 'analytics'>('overview');
  const [aiPromptInput, setAiPromptInput] = useState('Build Ecommerce Website');
  const [aiOutputVisible, setAiOutputVisible] = useState(true);

  const heroStats = landingService.getHeroStats();
  const trustedStats = landingService.getTrustedStats();
  const pricingPlans = landingService.getPricingPlans();

  const handleRunAiDemo = (preset?: string) => {
    if (preset) {
      setAiPromptInput(preset);
    }
    setAiOutputVisible(true);
  };

  return {
    billingCycle,
    setBillingCycle,
    activeScreenTab,
    setActiveScreenTab,
    aiPromptInput,
    setAiPromptInput,
    aiOutputVisible,
    handleRunAiDemo,
    heroStats,
    trustedStats,
    pricingPlans,
  };
};
