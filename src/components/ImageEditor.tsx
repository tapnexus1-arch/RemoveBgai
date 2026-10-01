/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Precision Alpha Mask Editor
 * 
 * Features:
 * - High-performance HTML5 Canvas rendering
 * - Eraser: clears remaining background artifacts
 * - Restore: brings back original image pixels via brush
 * - Brush size slider & edge smoothing
 * - Undo & Redo history buffer
 * - Reset to AI output
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Eraser, Paintbrush, Undo2, Redo2, RotateCcw, Check, Sliders, X } from 'lucide-react';

interface ImageEditorProps {
  originalUrl: string;
  resultUrl: string;
  onSave: (newBlob: Blob, newUrl: string) => void;
  onClose: () => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  originalUrl,
  resultUrl,
  onSave,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImgRef = useRef<HTMLImageElement | null>(null);
  const initialResultImgRef = useRef<HTMLImageElement | null>(null);

  const [mode, setMode] = useState<'erase' | 'restore'>('erase');
  const [brushSize, setBrushSize] = useState<number>(30);
  const [edgeSmoothing, setEdgeSmoothing] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  // Undo/Redo history stack
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize images and canvas
  useEffect(() => {
    const originalImg = new Image();
    const resultImg = new Image();
    originalImg.crossOrigin = 'anonymous';
    resultImg.crossOrigin = 'anonymous';

    let loadedCount = 0;
    const onLoad = () => {
      loadedCount++;
      if (loadedCount === 2) {
        originalImgRef.current = originalImg;
        initialResultImgRef.current = resultImg;

        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = resultImg.naturalWidth;
        canvas.height = resultImg.naturalHeight;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(resultImg, 0, 0);

        // Push initial state
        const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        setHistory([initialData]);
        setHistoryIndex(0);
        setIsLoaded(true);
      }
    };

    originalImg.onload = onLoad;
    resultImg.onload = onLoad;
    originalImg.src = originalUrl;
    resultImg.src = resultUrl;

    return () => {
      originalImg.onload = null;
      resultImg.onload = null;
    };
  }, [originalUrl, resultUrl]);

  // Push new state to history
  const pushState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => {
      const updated = prev.slice(0, historyIndex + 1);
      if (updated.length >= 20) updated.shift(); // Limit to 20 states for memory
      return [...updated, data];
    });
    setHistoryIndex((prev) => Math.min(prev + 1, 19));
  }, [historyIndex]);

  // Undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const targetState = history[newIndex];
      const canvas = canvasRef.current;
      if (!canvas || !targetState) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.putImageData(targetState, 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  // Redo
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const targetState = history[newIndex];
      const canvas = canvasRef.current;
      if (!canvas || !targetState) return;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.putImageData(targetState, 0, 0);
      setHistoryIndex(newIndex);
    }
  };

  // Reset to original AI cutout
  const handleReset = () => {
    const canvas = canvasRef.current;
    const initialImg = initialResultImgRef.current;
    if (!canvas || !initialImg) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(initialImg, 0, 0);
    pushState();
  };

  // Coordinate mapping from client viewport to canvas pixels
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Brush drawing stroke
  const drawStroke = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.save();

    if (mode === 'erase') {
      // Erase: removes pixels (makes transparent)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);

      if (edgeSmoothing) {
        // Feathered edge for natural cutouts
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize / 2);
        gradient.addColorStop(0, 'rgba(0,0,0,1)');
        gradient.addColorStop(0.7, 'rgba(0,0,0,0.8)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = 'rgba(0,0,0,1)';
      }
      ctx.fill();
    } else {
      // Restore: draws original image pixels into the clipped brush region
      if (originalImgRef.current) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(originalImgRef.current, 0, 0);
        ctx.restore();
      }
    }

    ctx.restore();
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const coords = getCanvasCoords(e);
    drawStroke(coords.x, coords.y);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setCursorPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }

    if (isDrawing) {
      drawStroke(coords.x, coords.y);
    }
  };

  const handlePointerUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      pushState();
    }
  };

  // Save changes
  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        onSave(blob, url);
      }
    }, 'image/png');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950/95 backdrop-blur-md text-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-900/90">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sm tracking-tight font-display text-white">
            Fine-Tune Cutout Mask
          </span>
          <span className="hidden sm:inline text-xs text-neutral-400">
            Erase lingering background or restore original details
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Apply Changes</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Work Area */}
      <div className="relative flex-1 flex items-center justify-center p-4 overflow-hidden bg-checkerboard">
        {!isLoaded && (
          <div className="text-sm text-neutral-400">Loading editor canvas...</div>
        )}

        <div className="relative max-h-full max-w-full shadow-2xl rounded-lg overflow-hidden border border-neutral-700/50">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={() => setCursorPos(null)}
            className="max-h-[65vh] max-w-full object-contain cursor-crosshair touch-none"
          />

          {/* Floating custom brush outline cursor */}
          {cursorPos && (
            <div
              className="pointer-events-none absolute rounded-full border border-white/80 shadow-[0_0_4px_rgba(0,0,0,0.8)] -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${cursorPos.x}px`,
                top: `${cursorPos.y}px`,
                width: `${brushSize}px`,
                height: `${brushSize}px`,
                backgroundColor: mode === 'erase' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)',
              }}
            />
          )}
        </div>
      </div>

      {/* Bottom Tool Dock */}
      <div className="border-t border-neutral-800 bg-neutral-900 px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Tool selector */}
        <div className="flex items-center gap-2">
          <div className="flex bg-neutral-800 p-1 rounded-xl">
            <button
              onClick={() => setMode('erase')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'erase'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Eraser className="w-4 h-4" />
              <span>Erase</span>
            </button>

            <button
              onClick={() => setMode('restore')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                mode === 'restore'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Paintbrush className="w-4 h-4" />
              <span>Restore</span>
            </button>
          </div>

          <div className="h-6 w-px bg-neutral-800 hidden sm:block" />

          {/* Brush size slider */}
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <span>Size</span>
            <input
              type="range"
              min="5"
              max="120"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              className="w-24 sm:w-32 accent-indigo-500 cursor-pointer"
            />
            <span className="font-mono text-neutral-400 w-8">{brushSize}px</span>
          </div>

          {/* Edge smoothing toggle */}
          <label className="hidden md:flex items-center gap-2 text-xs text-neutral-300 cursor-pointer ml-2">
            <input
              type="checkbox"
              checked={edgeSmoothing}
              onChange={(e) => setEdgeSmoothing(e.target.checked)}
              className="rounded accent-indigo-500"
            />
            <span>Soft Edges</span>
          </label>
        </div>

        {/* History & Reset actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white text-xs font-medium transition-colors"
            title="Reset to AI Output"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
