/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Background Replacement Studio
 * 
 * Options:
 * - Transparent (checkerboard)
 * - Solid Color (White, Black, Studio Grey, Custom Color Picker)
 * - Gradient (Curated Studio Gradients, Angle controls)
 * - Custom Image (Upload custom background with Scale, Fit, Position controls)
 */

import React, { useRef } from 'react';
import { BackgroundSettings } from '../types';
import { Image, Palette, Sparkles, UploadCloud, RotateCcw } from 'lucide-react';

interface BackgroundCustomizerProps {
  settings: BackgroundSettings;
  onChange: (settings: BackgroundSettings) => void;
}

const COLOR_PRESETS = [
  { name: 'Pure White', value: '#ffffff' },
  { name: 'Studio Black', value: '#0f172a' },
  { name: 'Warm Cream', value: '#fefce8' },
  { name: 'Cool Slate', value: '#e2e8f0' },
  { name: 'Soft Rose', value: '#ffe4e6' },
  { name: 'Sky Cyan', value: '#e0f2fe' },
  { name: 'Mint Sage', value: '#dcfce7' },
  { name: 'Vibrant Indigo', value: '#4f46e5' },
];

const GRADIENT_PRESETS = [
  { name: 'Studio Soft', start: '#f8fafc', end: '#cbd5e1', angle: 135 },
  { name: 'Sunset Glow', start: '#f43f5e', end: '#fb923c', angle: 45 },
  { name: 'Ocean Breeze', start: '#0ea5e9', end: '#6366f1', angle: 120 },
  { name: 'Emerald Luxe', start: '#059669', end: '#10b981', angle: 90 },
  { name: 'Midnight Velvet', start: '#090d16', end: '#1e1b4b', angle: 180 },
  { name: 'Cotton Candy', start: '#f472b6', end: '#a855f7', angle: 60 },
];

export const BackgroundCustomizer: React.FC<BackgroundCustomizerProps> = ({
  settings,
  onChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTypeChange = (type: BackgroundSettings['type']) => {
    onChange({ ...settings, type });
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange({
      ...settings,
      type: 'image',
      imageSrc: url,
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
      {/* Background Category Tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Background Backdrop
        </span>

        <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg">
          <button
            onClick={() => handleTypeChange('transparent')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              settings.type === 'transparent'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Transparent
          </button>
          <button
            onClick={() => handleTypeChange('color')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              settings.type === 'color'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Color
          </button>
          <button
            onClick={() => handleTypeChange('gradient')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              settings.type === 'gradient'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Gradient
          </button>
          <button
            onClick={() => handleTypeChange('image')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              settings.type === 'image'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Image
          </button>
        </div>
      </div>

      {/* SOLID COLOR CONTROLS */}
      {settings.type === 'color' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-600 dark:text-neutral-300">Preset Swatches</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-mono">{settings.color}</span>
              <input
                type="color"
                value={settings.color}
                onChange={(e) => onChange({ ...settings, color: e.target.value })}
                className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                title="Custom color picker"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => onChange({ ...settings, color: preset.value })}
                className={`h-8 rounded-lg border flex items-center justify-center transition-all ${
                  settings.color.toLowerCase() === preset.value.toLowerCase()
                    ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-105'
                    : 'border-neutral-200 dark:border-neutral-700 hover:scale-102'
                }`}
                style={{ backgroundColor: preset.value }}
                title={preset.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* GRADIENT CONTROLS */}
      {settings.type === 'gradient' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300">
            <span>Gradient Presets</span>
            <div className="flex items-center gap-2">
              <span>Angle: {settings.gradient.angle}°</span>
              <input
                type="range"
                min="0"
                max="360"
                value={settings.gradient.angle}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    gradient: { ...settings.gradient, angle: Number(e.target.value) },
                  })
                }
                className="w-20 accent-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {GRADIENT_PRESETS.map((grad) => (
              <button
                key={grad.name}
                onClick={() =>
                  onChange({
                    ...settings,
                    gradient: {
                      start: grad.start,
                      end: grad.end,
                      angle: grad.angle,
                      presetName: grad.name,
                    },
                  })
                }
                className={`h-10 rounded-lg border transition-all ${
                  settings.gradient.presetName === grad.name
                    ? 'border-indigo-600 ring-2 ring-indigo-500/30 scale-105'
                    : 'border-neutral-200 dark:border-neutral-700 hover:scale-102'
                }`}
                style={{
                  background: `linear-gradient(${grad.angle}deg, ${grad.start}, ${grad.end})`,
                }}
                title={grad.name}
              />
            ))}
          </div>
        </div>
      )}

      {/* CUSTOM IMAGE CONTROLS */}
      {settings.type === 'image' && (
        <div className="flex flex-col gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomImageUpload}
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
          />

          <div className="flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <UploadCloud className="w-4 h-4 text-indigo-500" />
              <span>{settings.imageSrc ? 'Replace Background Image' : 'Upload Background Image'}</span>
            </button>

            {settings.imageSrc && (
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-md">
                {(['cover', 'contain', 'fill'] as const).map((fit) => (
                  <button
                    key={fit}
                    onClick={() => onChange({ ...settings, imageFit: fit })}
                    className={`px-2 py-0.5 text-[11px] font-medium rounded capitalize ${
                      settings.imageFit === fit
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            )}
          </div>

          {settings.imageSrc && (
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-neutral-500">Scale</span>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={settings.imageScale}
                onChange={(e) =>
                  onChange({ ...settings, imageScale: Number(e.target.value) })
                }
                className="flex-1 accent-indigo-600"
              />
              <span className="text-xs font-mono text-neutral-400 w-12 text-right">
                {Math.round(settings.imageScale * 100)}%
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
