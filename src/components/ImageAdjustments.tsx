/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Non-Destructive Image Adjustments
 */

import React from 'react';
import { ImageAdjustments as AdjustmentsType } from '../types';
import { RotateCcw, Sun, Contrast, Droplets, Sparkles, Eye } from 'lucide-react';

interface ImageAdjustmentsProps {
  adjustments: AdjustmentsType;
  onChange: (adjustments: AdjustmentsType) => void;
  onReset: () => void;
}

export const ImageAdjustments: React.FC<ImageAdjustmentsProps> = ({
  adjustments,
  onChange,
  onReset,
}) => {
  const isDefault =
    adjustments.brightness === 0 &&
    adjustments.contrast === 0 &&
    adjustments.saturation === 0 &&
    adjustments.blur === 0 &&
    adjustments.sharpness === 0;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Color & Clarity Tuning
        </span>

        <button
          onClick={onReset}
          disabled={isDefault}
          className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Adjustments</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 pt-1">
        {/* Brightness */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-neutral-400" />
              <span>Brightness</span>
            </span>
            <span className="font-mono text-neutral-400">{adjustments.brightness > 0 ? `+${adjustments.brightness}` : adjustments.brightness}%</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={adjustments.brightness}
            onChange={(e) => onChange({ ...adjustments, brightness: Number(e.target.value) })}
            className="accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Contrast */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Contrast className="w-3.5 h-3.5 text-neutral-400" />
              <span>Contrast</span>
            </span>
            <span className="font-mono text-neutral-400">{adjustments.contrast > 0 ? `+${adjustments.contrast}` : adjustments.contrast}%</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={adjustments.contrast}
            onChange={(e) => onChange({ ...adjustments, contrast: Number(e.target.value) })}
            className="accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Saturation */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-neutral-400" />
              <span>Saturation</span>
            </span>
            <span className="font-mono text-neutral-400">{adjustments.saturation > 0 ? `+${adjustments.saturation}` : adjustments.saturation}%</span>
          </div>
          <input
            type="range"
            min="-50"
            max="50"
            value={adjustments.saturation}
            onChange={(e) => onChange({ ...adjustments, saturation: Number(e.target.value) })}
            className="accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Blur */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-neutral-400" />
              <span>Soft Blur</span>
            </span>
            <span className="font-mono text-neutral-400">{adjustments.blur}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={adjustments.blur}
            onChange={(e) => onChange({ ...adjustments, blur: Number(e.target.value) })}
            className="accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Sharpness */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between text-xs text-neutral-600 dark:text-neutral-300">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              <span>Edge Clarity</span>
            </span>
            <span className="font-mono text-neutral-400">{adjustments.sharpness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={adjustments.sharpness}
            onChange={(e) => onChange({ ...adjustments, sharpness: Number(e.target.value) })}
            className="accent-indigo-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
