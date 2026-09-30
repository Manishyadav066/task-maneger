export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
}

export interface MetricCard {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
}

export interface PlanPricing {
  id: string;
  name: string;
  badge?: string;
  price: {
    monthly: string;
    yearly: string;
  };
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  cta: string;
}

export interface AITaskExample {
  title: string;
  category: string;
  subtasks: string[];
  duration: string;
}
