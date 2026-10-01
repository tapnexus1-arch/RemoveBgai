/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Granular Cookie & Privacy Consent Manager
 * 
 * Separates:
 * - Essential Functionality (always on, stores theme and editor settings)
 * - Analytics (strictly non-personal telemetry)
 * - Advertising (Google AdSense personalized vs non-personalized cookies)
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Settings, X, Check } from 'lucide-react';
import { analytics } from '../services/analyticsService';

export const CookieConsent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytics: false,
    advertising: true,
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('removebg_cookie_consent');
      if (!saved) {
        // Show after a brief delay so it doesn't block immediate viewport interaction
        const timer = setTimeout(() => setIsOpen(true), 1200);
        return () => clearTimeout(timer);
      } else {
        const parsed = JSON.parse(saved);
        setPreferences(parsed);
        analytics.setConsent(parsed.analytics);
      }
    } catch (_) {
      // ignore storage access errors in restricted iframes
    }
  }, []);

  const saveConsent = (updated: { essential: boolean; analytics: boolean; advertising: boolean }) => {
    setPreferences(updated);
    try {
      localStorage.setItem('removebg_cookie_consent', JSON.stringify(updated));
    } catch (_) {}
    analytics.setConsent(updated.analytics);
    setIsOpen(false);
  };

  const handleAcceptAll = () => {
    saveConsent({ essential: true, analytics: true, advertising: true });
  };

  const handleDeclineOptional = () => {
    saveConsent({ essential: true, analytics: false, advertising: false });
  };

  const handleSaveCustom = () => {
    saveConsent(preferences);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl p-4 sm:p-5 text-neutral-800 dark:text-neutral-200 animate-slide-up">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <h4 className="text-sm font-semibold font-display text-neutral-900 dark:text-white">
            Privacy & Cookie Preferences
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
            We prioritize your privacy. Images are processed locally or temporary on self-hosted instances with zero permanent storage. We use cookies to deliver Google AdSense monetization and essential site settings.
          </p>

          {showDetails && (
            <div className="mt-3 space-y-2 border-t border-neutral-100 dark:border-neutral-800 pt-3 text-xs">
              <label className="flex items-center justify-between opacity-80 cursor-not-allowed">
                <span>Essential & Security (Always Active)</span>
                <input type="checkbox" checked disabled className="accent-indigo-600" />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Google AdSense (Monetization)</span>
                <input
                  type="checkbox"
                  checked={preferences.advertising}
                  onChange={(e) =>
                    setPreferences({ ...preferences, advertising: e.target.checked })
                  }
                  className="accent-indigo-600"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Non-Personal Telemetry</span>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences({ ...preferences, analytics: e.target.checked })
                  }
                  className="accent-indigo-600"
                />
              </label>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-4">
            <button
              onClick={handleAcceptAll}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Accept All
            </button>

            {showDetails ? (
              <button
                onClick={handleSaveCustom}
                className="px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium transition-colors"
              >
                Save Preferences
              </button>
            ) : (
              <button
                onClick={() => setShowDetails(true)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs font-medium transition-colors"
              >
                <Settings className="w-3 h-3" />
                <span>Customize</span>
              </button>
            )}

            <button
              onClick={handleDeclineOptional}
              className="px-3 py-1.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 text-xs transition-colors"
            >
              Essential Only
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
