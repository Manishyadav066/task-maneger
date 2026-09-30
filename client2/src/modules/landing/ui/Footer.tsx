import React from 'react';
import { Layers, Github, Twitter, Linkedin, Heart } from 'lucide-react';

interface FooterProps {
  onOpenSignIn: () => void;
  onOpenDashboard: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSignIn, onOpenDashboard }) => {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">
                TaskFlow <span className="text-indigo-600">AI</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed font-normal">
              The AI-powered project management platform built to plan projects, assign tasks, track progress, collaborate with teams, and deliver with peak velocity.
            </p>
            <div className="flex items-center gap-2 pt-1 text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Product</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <a href="#features" className="hover:text-indigo-600 transition-colors">
                  Workspace Management
                </a>
              </li>
              <li>
                <a href="#showcase" className="hover:text-indigo-600 transition-colors">
                  Interactive Showcase
                </a>
              </li>
              <li>
                <a href="#ai-features" className="hover:text-indigo-600 transition-colors">
                  AI Task Generator
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-indigo-600 transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenDashboard}
                  className="hover:text-indigo-600 transition-colors cursor-pointer text-left font-bold text-indigo-600"
                >
                  Live Dashboard Preview
                </button>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Resources</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <a href="#files" className="hover:text-indigo-600 transition-colors">
                  Documentation & Files
                </a>
              </li>
              <li>
                <span className="text-slate-400">API Reference (/api/v1)</span>
              </li>
              <li>
                <span className="text-slate-400">Changelog (v2.4.0)</span>
              </li>
              <li>
                <span className="text-slate-400">Security & Compliance</span>
              </li>
            </ul>
          </div>

          {/* Account & Access */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Account</h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <button
                  onClick={onOpenSignIn}
                  className="hover:text-indigo-600 transition-colors cursor-pointer font-bold text-slate-800"
                >
                  Sign In to Workspace
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenSignIn}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Create New Account
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDashboard}
                  className="hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Demo Quick-Login
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} TaskFlow AI Technologies Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-700 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-700 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-700 cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
