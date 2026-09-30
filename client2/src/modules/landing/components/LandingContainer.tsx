import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  LogIn,
} from 'lucide-react';
import { useLanding } from '../hooks/useLanding';
import { HeroSection } from '../ui/HeroSection';
import { TrustedBy } from '../ui/TrustedBy';
import { FeaturesSection } from '../ui/FeaturesSection';
import { DashboardPreview } from '../ui/DashboardPreview';
import { CollaborationSection } from '../ui/CollaborationSection';
import { AIFeatures } from '../ui/AIFeatures';
import { FilesSection } from '../ui/FilesSection';
import { PricingSection } from '../ui/PricingSection';
import { CTASection } from '../ui/CTASection';
import { Footer } from '../ui/Footer';

interface LandingContainerProps {
  onStartFree: () => void;
  onSignIn: () => void;
  onOpenDashboard: () => void;
  isAuthenticated?: boolean;
}

export const LandingContainer: React.FC<LandingContainerProps> = ({
  onStartFree,
  onSignIn,
  onOpenDashboard,
  isAuthenticated = false,
}) => {
  const {
    billingCycle,
    setBillingCycle,
    pricingPlans,
    trustedStats,
  } = useLanding();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Top Banner */}
      <div className="bg-indigo-50/80 border-b border-indigo-100/60 py-2 px-4 text-center text-xs text-indigo-900 font-medium">
        <span className="font-bold bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full mr-2">NEW</span>
        <span>TaskFlow 2.4 Released with Instant Sprint Planning & Deep Task Decomposition</span>
        <button
          onClick={onOpenDashboard}
          className="ml-2 font-bold underline hover:text-indigo-700 cursor-pointer"
        >
          Test Live Demo →
        </button>
      </div>

      {/* Main Navbar (Light Mode, Clean, Sticky Glass Effect) */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-extrabold text-slate-900 tracking-tight">
                  TaskFlow <span className="text-indigo-600">AI</span>
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
              <a href="#features" className="hover:text-indigo-600 transition-colors">
                Features
              </a>
              <a href="#showcase" className="hover:text-indigo-600 transition-colors">
                Dashboard
              </a>
              <a href="#ai-features" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                <span>AI Copilot</span>
                <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-full font-bold">USP</span>
              </a>
              <a href="#files" className="hover:text-indigo-600 transition-colors">
                Collaboration & Files
              </a>
              <a href="#pricing" className="hover:text-indigo-600 transition-colors">
                Pricing
              </a>
            </nav>

            {/* Desktop CTA Action Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <button
                id="landing-nav-dashboard-btn"
                onClick={onOpenDashboard}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                <span>Live Dashboard</span>
              </button>

              <button
                id="landing-nav-signin-btn"
                onClick={onSignIn}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-slate-500" />
                <span>Sign In</span>
              </button>

              <button
                id="landing-nav-startfree-btn"
                onClick={onStartFree}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <span>Start Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Hamburger */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1.5"
            >
              Features
            </a>
            <a
              href="#showcase"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1.5"
            >
              Dashboard Showcase
            </a>
            <a
              href="#ai-features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1.5"
            >
              AI Copilot
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold text-slate-700 py-1.5"
            >
              Pricing
            </a>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDashboard();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 font-bold text-xs text-slate-800 flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-600" />
                <span>Explore Live Dashboard</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onSignIn();
                }}
                className="w-full py-2.5 rounded-xl border border-slate-200 font-bold text-xs text-slate-700 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onStartFree();
                }}
                className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2"
              >
                <span>Start Free</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 1. Hero Section */}
      <HeroSection onStartFree={onStartFree} onOpenDashboard={onOpenDashboard} />

      {/* 2. Trusted By Teams & Stats */}
      <TrustedBy stats={trustedStats} />

      {/* 3. Features Section (Why TaskFlow AI: Workspaces, Projects, Tasks) */}
      <FeaturesSection onExploreFeature={onOpenDashboard} />

      {/* 4. Dashboard Showcase (Overview, Projects, Analytics) */}
      <DashboardPreview onOpenDashboard={onOpenDashboard} />

      {/* 5. Team Collaboration */}
      <CollaborationSection />

      {/* 6. AI Features (USP - Task Generator, Daily Summary, Health) */}
      <AIFeatures />

      {/* 7. Files & Activity Notifications */}
      <FilesSection />

      {/* 8. Pricing Section */}
      <PricingSection
        plans={pricingPlans}
        billingCycle={billingCycle}
        onBillingCycleChange={setBillingCycle}
        onSelectPlan={() => onStartFree()}
      />

      {/* 9. Final CTA Section */}
      <CTASection onStartFree={onStartFree} onBookDemo={onOpenDashboard} />

      {/* 10. Footer */}
      <Footer onOpenSignIn={onSignIn} onOpenDashboard={onOpenDashboard} />
    </div>
  );
};
