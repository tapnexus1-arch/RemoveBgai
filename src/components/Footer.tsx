/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Quiet Footer
 */

import React from 'react';
import { Shield, Lock, Cpu, Sparkles } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8">
        {/* Brand & Mission */}
        <div className="max-w-sm space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-display font-bold text-xs">
              BG
            </div>
            <span className="font-display font-bold text-base tracking-tight text-neutral-900 dark:text-white">
              RemoveBG AI
            </span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            Free, open-source AI image background removal. High-precision transparency cutouts processed directly on your device or self-hosted infrastructure. Zero cloud tracking.
          </p>
          <div className="flex items-center gap-4 text-xs text-neutral-400 pt-1">
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Client/Local Privacy</span>
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-indigo-500" />
              <span>Open-Source AI Model</span>
            </span>
          </div>
        </div>

        {/* Navigation mirrors */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-xs">
          <div>
            <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2.5">
              Product
            </h5>
            <ul className="space-y-2 text-neutral-500 dark:text-neutral-400">
              <li>
                <button onClick={() => onSelectTab('home')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  AI Background Remover
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('batch')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Batch Processor
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('how-it-works')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('faq')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  FAQ & Formats
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2.5">
              Knowledge
            </h5>
            <ul className="space-y-2 text-neutral-500 dark:text-neutral-400">
              <li>
                <button onClick={() => onSelectTab('blog')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Guides & Tutorials
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('blog')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Transparent PNG Guide
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('blog')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Product Photography
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('admin')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-2.5">
              Trust & Legal
            </h5>
            <ul className="space-y-2 text-neutral-500 dark:text-neutral-400">
              <li>
                <button onClick={() => onSelectTab('privacy')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('terms')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab('cookie-settings')} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  AdSense & Cookie Policy
                </button>
              </li>
              <li>
                <a href="#github" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Self-Hosted Docker Docs
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-neutral-100 dark:border-neutral-900 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 gap-2">
        <p>© {new Date().getFullYear()} RemoveBG AI. Open-source background segmentation utility. Free for personal & commercial use.</p>
        <p className="flex items-center gap-2">
          <span>Powered by Open-Source ONNX Vision Models</span>
        </p>
      </div>
    </footer>
  );
};
