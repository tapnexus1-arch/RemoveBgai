/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Terms of Service
 */

import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-neutral-800 dark:text-neutral-200">
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6 mb-8">
        <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Legal
        </span>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-neutral-900 dark:text-white mt-1">
          Terms of Service
        </h1>
        <p className="text-xs text-neutral-500 mt-2">Last Updated: March 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
        <section>
          <h2 className="font-display font-bold text-base text-neutral-900 dark:text-white mb-2">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using RemoveBG AI, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-neutral-900 dark:text-white mb-2">
            2. Permitted Use &amp; Commercial Rights
          </h2>
          <p>
            RemoveBG AI is provided free for both personal and commercial projects. You retain 100% full ownership, copyright, and intellectual property rights over any images you process through the application.
          </p>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-neutral-900 dark:text-white mb-2">
            3. Prohibited Conduct
          </h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>Upload unlawful, defamatory, harassing, or infringing visual materials.</li>
            <li>Attempt to reverse-engineer rate limiting or flood the infrastructure with malicious automated denial-of-service traffic.</li>
            <li>Simulate false ad impressions or disrupt Google AdSense delivery mechanisms.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-bold text-base text-neutral-900 dark:text-white mb-2">
            4. Disclaimer of Warranties
          </h2>
          <p>
            RemoveBG AI is provided "as is" without warranty of any kind. While our open-source neural network yields state-of-the-art results on typical photography, we do not guarantee 100% segmentation accuracy on all extreme lighting or low-contrast scenarios.
          </p>
        </section>
      </div>
    </div>
  );
};
