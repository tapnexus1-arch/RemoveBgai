/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Before / After Comparison Viewer
 * 
 * Features:
 * - Interactive Split-screen slider with touch & mouse drag
 * - Side-by-side side comparison mode
 * - Pan & Zoom (Zoom in, Zoom out, Fit, Reset)
 * - Crisp transparency checkerboard preview
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, Columns, SplitSquareVertical } from 'lucide-react';
import { ViewMode } from '../types';

interface BeforeAfterViewerProps {
  originalUrl: string;
  resultUrl: string;
  onOpenEditor?: () => void;
  className?: string;
}

export const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({
  originalUrl,
  resultUrl,
  className = '',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50); // 0 to 100%
  const [viewMode, setViewMode] = useState<ViewMode>('slider');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const initialPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Handle slider drag calculation
  const handleSliderMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If clicking close to the slider line, drag the slider
    if (viewMode === 'slider' && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const clickPercent = ((e.clientX - rect.left) / rect.width) * 100;
      if (Math.abs(clickPercent - sliderPosition) < 6 || zoom === 1) {
        setIsDraggingSlider(true);
        handleSliderMove(e.clientX);
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        return;
      }
    }

    // Otherwise, if zoomed in, initiate pan
    if (zoom > 1) {
      setIsPanning(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      initialPanRef.current = { ...pan };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingSlider) {
      handleSliderMove(e.clientX);
    } else if (isPanning && zoom > 1) {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: initialPanRef.current.x + dx,
        y: initialPanRef.current.y + dy,
      });
    }
  };

  const handlePointerUp = () => {
    setIsDraggingSlider(false);
    setIsPanning(false);
  };

  const handleZoomIn = () => setZoom((z) => Math.min(4, +(z + 0.25).toFixed(2)));
  const handleZoomOut = () => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`flex flex-col rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm overflow-hidden ${className}`}>
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 bg-neutral-50/80 dark:bg-neutral-900/80 gap-2">
        {/* Mode selector */}
        <div className="flex items-center gap-1 bg-neutral-200/70 dark:bg-neutral-800 p-0.5 rounded-lg">
          <button
            onClick={() => setViewMode('slider')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'slider'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
            title="Split-screen slider"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Slider</span>
          </button>

          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'side-by-side'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
            title="Side by side"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Side by Side</span>
          </button>

          <button
            onClick={() => setViewMode('cutout-only')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'cutout-only'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Cutout
          </button>
        </div>

        {/* Zoom & Pan tools */}
        <div className="flex items-center gap-1 text-neutral-600 dark:text-neutral-300">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
            title="Zoom out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-medium px-1.5 tabular-nums min-w-[42px] text-center">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
            title="Zoom in"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-neutral-300 dark:bg-neutral-700 mx-1" />

          <button
            onClick={handleResetZoom}
            className="flex items-center gap-1 p-1.5 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs transition-colors"
            title="Reset zoom & position"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fit</span>
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative w-full h-[400px] sm:h-[500px] md:h-[560px] select-none overflow-hidden touch-none flex items-center justify-center ${
          zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
        }`}
      >
        {/* SIDE-BY-SIDE MODE */}
        {viewMode === 'side-by-side' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full h-full divide-y sm:divide-y-0 sm:divide-x divide-neutral-200 dark:divide-neutral-800">
            {/* Original */}
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
              <span className="absolute top-3 left-3 z-10 text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
                Original
              </span>
              <img
                src={originalUrl}
                alt="Original"
                className="max-h-full max-w-full object-contain pointer-events-none transition-transform"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                }}
              />
            </div>

            {/* Cutout on Checkerboard */}
            <div className="relative w-full h-full flex flex-col items-center justify-center p-4 bg-checkerboard overflow-hidden">
              <span className="absolute top-3 left-3 z-10 text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-indigo-600/90 text-white backdrop-blur-sm shadow-xs">
                Transparent PNG
              </span>
              <img
                src={resultUrl}
                alt="Removed Background"
                className="max-h-full max-w-full object-contain pointer-events-none transition-transform"
                style={{
                  transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                }}
              />
            </div>
          </div>
        ) : viewMode === 'cutout-only' ? (
          /* CUTOUT ONLY PREVIEW */
          <div className="relative w-full h-full flex items-center justify-center bg-checkerboard p-4 overflow-hidden">
            <span className="absolute top-3 left-3 z-10 text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-indigo-600/90 text-white backdrop-blur-sm">
              Removed Background
            </span>
            <img
              src={resultUrl}
              alt="Removed Background"
              className="max-h-full max-w-full object-contain pointer-events-none transition-transform"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              }}
            />
          </div>
        ) : (
          /* SLIDER MODE */
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-checkerboard">
            {/* Labels */}
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-sm">
                Original
              </span>
            </div>
            <div className="absolute top-3 right-3 z-10 pointer-events-none">
              <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-indigo-600/90 text-white backdrop-blur-sm">
                Removed BG
              </span>
            </div>

            {/* Inner zoom container */}
            <div
              className="relative max-h-full max-w-full flex items-center justify-center"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: 'center center',
              }}
            >
              {/* Layer 1: Cutout on Checkerboard (Underneath) */}
              <img
                src={resultUrl}
                alt="Background Removed"
                className="max-h-[380px] sm:max-h-[480px] md:max-h-[520px] max-w-full object-contain pointer-events-none"
              />

              {/* Layer 2: Original image (Clipped to slider percentage) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{
                  clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                }}
              >
                <img
                  src={originalUrl}
                  alt="Original"
                  className="max-h-[380px] sm:max-h-[480px] md:max-h-[520px] max-w-full object-contain pointer-events-none"
                />
              </div>
            </div>

            {/* Vertical Divider Line with Grab Handle */}
            <div
              className="absolute top-0 bottom-0 z-20 pointer-events-none flex items-center justify-center"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="w-0.5 h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
              <div className="absolute w-8 h-8 rounded-full bg-white dark:bg-neutral-800 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 shadow-md flex items-center justify-center cursor-ew-resize pointer-events-auto active:scale-95 transition-transform">
                <SplitSquareVertical className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
