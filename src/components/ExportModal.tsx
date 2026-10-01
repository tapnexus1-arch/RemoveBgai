/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - High-Fidelity Multi-Format Exporter
 * 
 * Supports:
 * - Formats: PNG (with transparency), JPEG, WEBP
 * - Resolutions: Original, 2048px (2K), 1024px (1K), Custom dimensions
 * - Composite background & adjustments baked into final output
 * - Standardized safe naming: `removed-background-[original-name].[ext]`
 */

import React, { useState, useEffect } from 'react';
import { Download, X, Check, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { BackgroundSettings, ImageAdjustments } from '../types';
import { analytics } from '../services/analyticsService';

interface ExportModalProps {
  originalName: string;
  resultUrl: string;
  backgroundSettings: BackgroundSettings;
  adjustments: ImageAdjustments;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  originalName,
  resultUrl,
  backgroundSettings,
  adjustments,
  isOpen,
  onClose,
}) => {
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState<number>(0.92);
  const [presetSize, setPresetSize] = useState<'original' | '2048' | '1024' | 'custom'>('original');
  const [customWidth, setCustomWidth] = useState<number>(1200);
  const [customHeight, setCustomHeight] = useState<number>(800);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Read natural image dimensions
  useEffect(() => {
    if (!resultUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setCustomWidth(img.naturalWidth);
      setCustomHeight(img.naturalHeight);
    };
    img.src = resultUrl;
  }, [resultUrl]);

  if (!isOpen) return null;

  // Calculate target export dimensions
  const getExportDimensions = () => {
    const { width: origW, height: origH } = originalDimensions;
    if (origW === 0 || origH === 0) return { width: 1000, height: 1000 };

    if (presetSize === 'original') return { width: origW, height: origH };
    if (presetSize === '2048') {
      const scale = Math.min(1, 2048 / Math.max(origW, origH));
      return { width: Math.round(origW * scale), height: Math.round(origH * scale) };
    }
    if (presetSize === '1024') {
      const scale = Math.min(1, 1024 / Math.max(origW, origH));
      return { width: Math.round(origW * scale), height: Math.round(origH * scale) };
    }
    return { width: customWidth, height: customHeight };
  };

  const handleDownload = async () => {
    setIsExporting(true);
    analytics.track('download_clicked', { format, presetSize });

    try {
      const { width: targetW, height: targetH } = getExportDimensions();
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable');

      // 1. Draw Background
      if (backgroundSettings.type === 'color') {
        ctx.fillStyle = backgroundSettings.color;
        ctx.fillRect(0, 0, targetW, targetH);
      } else if (backgroundSettings.type === 'gradient') {
        const rad = (backgroundSettings.gradient.angle * Math.PI) / 180;
        const x1 = targetW / 2 - (Math.cos(rad) * targetW) / 2;
        const y1 = targetH / 2 - (Math.sin(rad) * targetH) / 2;
        const x2 = targetW / 2 + (Math.cos(rad) * targetW) / 2;
        const y2 = targetH / 2 + (Math.sin(rad) * targetH) / 2;

        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        grad.addColorStop(0, backgroundSettings.gradient.start);
        grad.addColorStop(1, backgroundSettings.gradient.end);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, targetW, targetH);
      } else if (backgroundSettings.type === 'image' && backgroundSettings.imageSrc) {
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          bgImg.onload = resolve;
          bgImg.src = backgroundSettings.imageSrc!;
        });

        const scale = backgroundSettings.imageScale;
        const scaledW = targetW * scale;
        const scaledH = (targetW / (bgImg.naturalWidth / bgImg.naturalHeight)) * scale;
        const posX = (targetW - scaledW) / 2;
        const posY = (targetH - scaledH) / 2;
        ctx.drawImage(bgImg, posX, posY, scaledW, scaledH);
      } else if (format === 'jpeg') {
        // JPEG doesn't support transparency, default to pure white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, targetW, targetH);
      }

      // 2. Draw Foreground Cutout with Adjustments
      const fgImg = new Image();
      fgImg.crossOrigin = 'anonymous';
      await new Promise((resolve, reject) => {
        fgImg.onload = resolve;
        fgImg.onerror = reject;
        fgImg.src = resultUrl;
      });

      ctx.save();
      // Apply non-destructive adjustments
      const brightnessFilter = 100 + adjustments.brightness;
      const contrastFilter = 100 + adjustments.contrast;
      const saturateFilter = 100 + adjustments.saturation;
      const blurFilter = adjustments.blur;
      ctx.filter = `brightness(${brightnessFilter}%) contrast(${contrastFilter}%) saturate(${saturateFilter}%) blur(${blurFilter}px)`;

      ctx.drawImage(fgImg, 0, 0, targetW, targetH);
      ctx.restore();

      // 3. Export to Blob
      const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const cleanBaseName = originalName
            ? originalName.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
            : 'image';
          link.download = `removed-background-${cleanBaseName}.${format}`;
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up Object URL
          setTimeout(() => URL.revokeObjectURL(url), 2000);
          setIsExporting(false);
          onClose();
        },
        mimeType,
        quality
      );
    } catch (err) {
      console.error('Export error:', err);
      setIsExporting(false);
    }
  };

  const targetDim = getExportDimensions();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl p-6 text-neutral-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-display font-semibold text-base">Export Cutout</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex flex-col gap-2 pt-4">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Image Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['png', 'jpeg', 'webp'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`py-2 px-3 text-xs font-semibold rounded-lg uppercase border transition-all ${
                  format === fmt
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {fmt}
                {fmt === 'png' && <span className="block text-[10px] font-normal lowercase opacity-75">Transparent</span>}
                {fmt === 'jpeg' && <span className="block text-[10px] font-normal lowercase opacity-75">White BG</span>}
                {fmt === 'webp' && <span className="block text-[10px] font-normal lowercase opacity-75">Web Fast</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Resolution Options */}
        <div className="flex flex-col gap-2 pt-4">
          <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Resolution
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPresetSize('original')}
              className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                presetSize === 'original'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="font-semibold">Original Size</div>
              <div className="text-[11px] text-neutral-400 font-mono">
                {originalDimensions.width} × {originalDimensions.height} px
              </div>
            </button>

            <button
              onClick={() => setPresetSize('2048')}
              className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                presetSize === '2048'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="font-semibold">2K Ultra</div>
              <div className="text-[11px] text-neutral-400 font-mono">Max 2048 px</div>
            </button>

            <button
              onClick={() => setPresetSize('1024')}
              className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                presetSize === '1024'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="font-semibold">1K Standard</div>
              <div className="text-[11px] text-neutral-400 font-mono">Max 1024 px</div>
            </button>

            <button
              onClick={() => setPresetSize('custom')}
              className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                presetSize === 'custom'
                  ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                  : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              <div className="font-semibold">Custom Size</div>
              <div className="text-[11px] text-neutral-400 font-mono">User specified</div>
            </button>
          </div>

          {presetSize === 'custom' && (
            <div className="flex items-center gap-2 pt-2">
              <input
                type="number"
                value={customWidth}
                onChange={(e) => setCustomWidth(Math.max(50, Number(e.target.value)))}
                className="w-full px-2 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
                placeholder="Width"
              />
              <span className="text-neutral-400">×</span>
              <input
                type="number"
                value={customHeight}
                onChange={(e) => setCustomHeight(Math.max(50, Number(e.target.value)))}
                className="w-full px-2 py-1.5 rounded-md border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
                placeholder="Height"
              />
            </div>
          )}
        </div>

        {/* Quality slider for JPG/WEBP */}
        {(format === 'jpeg' || format === 'webp') && (
          <div className="flex flex-col gap-1 pt-3">
            <div className="flex justify-between text-xs text-neutral-500">
              <span>Export Quality</span>
              <span className="font-mono">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1"
              step="0.02"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="accent-indigo-600 cursor-pointer"
            />
          </div>
        )}

        {/* Action Button */}
        <div className="pt-6">
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-xl shadow-md transition-all active:scale-98 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating Image...' : `Download ${format.toUpperCase()} (${targetDim.width}×${targetDim.height})`}</span>
          </button>
          <p className="text-[11px] text-center text-neutral-400 mt-2">
            Direct instant browser export · No cloud watermarks or limits
          </p>
        </div>
      </div>
    </div>
  );
};
