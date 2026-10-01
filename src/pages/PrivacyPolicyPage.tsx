/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Privacy Policy
 */

import React from 'react';
import { ShieldCheck, Lock, Trash2, EyeOff } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-neutral-800 dark:text-neutral-200">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8">
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Legal &amp; Privacy
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-neutral-900 dark:text-white mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Effective Date: March 2026 · Transparent Image Processing Guarantee
        </p>
      </div>

      <div className="space-y-8 text-sm leading-relaxed">
        {/* Core Principles */}
        <section className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40">
          <h2 className="font-display font-bold text-base text-neutral-900 dark:text-white mb-2 flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Our Privacy-First Commitment</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm">
            At RemoveBG AI, we believe your visual assets belong exclusively to you. We do not store, catalog, train public AI models on, or resell your uploaded photographs.
          </p>
        </section>

        {/* 1. Uploaded Images & Processing */}
        <section className="space-y-3">
          <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
            1. Image Processing &amp; Automatic File Cleanup
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Depending on your device setup and network configuration:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-neutral-600 dark:text-neutral-400">
            <li>
              <strong>Client-Side Processing (Default):</strong> Most background removal requests execute directly on your device inside your web browser via WebAssembly (Wasm) and WebGPU. In this mode, image pixels never travel across the network to our servers.
            </li>
            <li>
              <strong>Self-Hosted Server Processing:</strong> When backend execution is utilized, images are held strictly in temporary memory buffers or sandboxed temporary files only for the exact duration required to compute the neural segmentation mask.
            </li>
            <li>
              <strong>Automatic File Purging:</strong> Any temporary files created on self-hosted servers are purged automatically via an active background worker following an expiration interval (default <code className="bg-neutral-100 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono text-xs">IMAGE_RETENTION_SECONDS=300</code>). No permanent image database exists.
            </li>
          </ul>
        </section>

        {/* 2. Advertising & Google AdSense */}
        <section className="space-y-3">
          <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
            2. Google AdSense &amp; Advertising Cookies
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            RemoveBG AI is supported through Google AdSense. Google and third-party vendors use cookies to serve ads based on prior visits to our website or other websites on the internet.
          </p>
          <p className="text-neutral-600 dark:text-neutral-400">
            Google’s use of advertising cookies enables it and its partners to serve ads based on your visit to our sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">Google Ads Settings</a> or through our in-app Cookie Preferences manager.
          </p>
        </section>

        {/* 3. Non-Personal Analytics */}
        <section className="space-y-3">
          <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
            3. Non-Personal Telemetry
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            We collect non-personally identifiable usage statistics (such as page views, button clicks, and error codes) strictly to evaluate server capacity and improve inference speeds. We <strong>never</strong> send image data, pixel matrices, filenames, or biometric markers to analytics platforms.
          </p>
        </section>

        {/* 4. User Rights */}
        <section className="space-y-3">
          <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white">
            4. Your Rights Under GDPR &amp; CCPA
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400">
            Because we do not maintain accounts, passwords, or persistent user profiles, we hold zero personal identifiable databases. You have the right to inspect cookie preferences, clear local browser storage, and revoke advertising consent at any time.
          </p>
        </section>

        {/* 5. Contact */}
        <section className="space-y-2 border-t border-neutral-200 dark:border-neutral-800 pt-6">
          <h3 className="font-display font-bold text-base text-neutral-900 dark:text-white">
            5. Contact Information
          </h3>
          <p className="text-neutral-500 text-xs">
            For privacy inquiries regarding RemoveBG AI, reach out through the open-source project repository or community portal.
          </p>
        </section>
      </div>
    </div>
  );
};
