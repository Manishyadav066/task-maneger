import { PlanPricing, Testimonial } from '../types/landing.types';

export const landingService = {
  getHeroStats() {
    return {
      projects: 24,
      tasks: 148,
      completed: 92,
      teamMembers: 18,
      velocity: '94%',
    };
  },

  getTrustedStats() {
    return [
      { value: '500+', label: 'Projects Managed', sub: 'Across 40+ countries' },
      { value: '10,000+', label: 'Tasks Completed', sub: 'Zero sprint delays' },
      { value: '95%', label: 'Productivity Boost', sub: 'Measured in sprint speed' },
      { value: '4.9/5', label: 'Customer Rating', sub: 'On G2 & Capterra' },
    ];
  },

  getPricingPlans(): PlanPricing[] {
    return [
      {
        id: 'starter',
        name: 'Starter',
        price: { monthly: '₹0', yearly: '₹0' },
        period: 'Free forever',
        description: 'Ideal for individual creators, freelancers, and small squads.',
        features: [
          '1 Shared Workspace',
          'Up to 3 Active Projects',
          'Kanban Board & List View',
          'Basic Task Analytics',
          'Community Support',
        ],
        cta: 'Start Free',
        popular: false,
      },
      {
        id: 'pro',
        name: 'Pro Team',
        badge: 'Most Popular',
        price: { monthly: '₹499', yearly: '₹399' },
        period: '/user/month',
        description: 'Best for growing startups, fast agencies, and product teams.',
        features: [
          'Unlimited Workspaces & Projects',
          'Advanced Sprint Analytics & Reports',
          'Team Real-time Collaboration & Comments',
          'Unlimited Cloud File Storage',
          'AI Copilot Task Generator (500 runs/mo)',
          'Role-Based Access Controls',
        ],
        popular: true,
        cta: 'Start 14-Day Free Trial',
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: { monthly: 'Custom', yearly: 'Custom' },
        period: 'tailored billing',
        description: 'Custom security, unlimited AI runs, and dedicated support for large organizations.',
        features: [
          'Unlimited Everything',
          'Full AI Copilot & Daily Standups',
          'SSO / SAML Authentication',
          'Custom Workflows & Webhooks',
          'Dedicated Customer Success Manager',
          '99.99% Uptime SLA',
        ],
        popular: false,
        cta: 'Talk to Sales',
      },
    ];
  },
};
