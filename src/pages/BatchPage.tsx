/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Batch Processing Page
 */

import React from 'react';
import { BatchProcessor } from '../components/BatchProcessor';
import { GoogleAd } from '../components/GoogleAd';
import { Layers, FileArchive, CheckCircle2, ShieldCheck } from 'lucide-react';

export const BatchPage: React.FC = () => {
  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Ad placement */}
      <GoogleAd position="header-banner" minHeight="60px" />

      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="font-display font-bold text-2xl sm:text-4xl text-neutral-900 dark:text-white">
          Batch Background Removal
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          Upload dozens of images simultaneously. Processed with open-source AI and packaged into an instant ZIP archive.
        </p>
      </div>

      {/* Batch processor component */}
      <BatchProcessor />

      {/* Ad placement below queue */}
      <div className="mt-12">
        <GoogleAd position="below-editor" />
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 border-t border-neutral-200 dark:border-neutral-800 pt-10 text-xs">
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white mb-1">
            <FileArchive className="w-4 h-4 text-indigo-500" />
            <span>Local ZIP Bundling</span>
          </div>
          <p className="text-neutral-500 leading-relaxed">
            All cutouts are assembled into a ZIP file in your browser via JSZip. No third-party ZIP conversion service is ever invoked.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Concurrency Throttling</span>
          </div>
          <p className="text-neutral-500 leading-relaxed">
            The queue manages execution limits to prevent system memory overload while maintaining fast processing.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-2 font-semibold text-neutral-900 dark:text-white mb-1">
            <CheckCircle2 className="w-4 h-4 text-purple-500" />
            <span>Original 8-bit Alpha</span>
          </div>
          <p className="text-neutral-500 leading-relaxed">
            Every exported PNG retains its full alpha channel with transparent backgrounds and sharp borders.
          </p>
        </div>
      </div>
    </div>
  );
};
