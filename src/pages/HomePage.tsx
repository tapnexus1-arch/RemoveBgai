/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Main Studio Homepage
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  Sparkles,
  Sliders,
  Download,
  RotateCcw,
  CheckCircle2,
  Lock,
  Zap,
  Layers,
  ArrowRight,
  ChevronDown,
  HelpCircle,
  FileCheck,
  ShieldAlert,
  Loader2,
  Palette,
} from 'lucide-react';
import { BeforeAfterViewer } from '../components/BeforeAfterViewer';
import { ImageEditor } from '../components/ImageEditor';
import { BackgroundCustomizer } from '../components/BackgroundCustomizer';
import { ImageAdjustments as AdjustmentsControl } from '../components/ImageAdjustments';
import { ExportModal } from '../components/ExportModal';
import { GoogleAd } from '../components/GoogleAd';
import { remove_background } from '../services/backgroundRemovalService';
import { BackgroundSettings, ImageAdjustments } from '../types';
import { FAQ_ITEMS } from '../data/faqData';
import { BLOG_POSTS } from '../data/blogPosts';
import { analytics } from '../services/analyticsService';

// Sample demonstration images for 1-click testing
const SAMPLE_IMAGES = [
  {
    name: 'Portrait Model',
    category: 'Portrait',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Sneaker Product',
    category: 'E-Commerce',
    url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Golden Retriever',
    category: 'Pet',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Vintage Sports Car',
    category: 'Vehicle',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  },
];

interface HomePageProps {
  onSelectTab: (tab: string) => void;
  onSelectBlog: (slug: string) => void;
  uploadInputRef: React.RefObject<HTMLInputElement | null>;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTab,
  onSelectBlog,
  uploadInputRef,
}) => {
  // Processing & File States
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<string>('');
  const [processingProgress, setProcessingProgress] = useState<number | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals & Panels
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Customization States
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    type: 'transparent',
    color: '#ffffff',
    gradient: { start: '#f43f5e', end: '#fb923c', angle: 45 },
    imageSrc: null,
    imageScale: 1,
    imagePosition: { x: 0, y: 0 },
    imageFit: 'cover',
  });

  const [adjustments, setAdjustments] = useState<ImageAdjustments>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    blur: 0,
    sharpness: 0,
  });

  // Handle uploaded image file
  const handleImageSelected = async (file: File) => {
    // Validate file
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type.toLowerCase())) {
      setErrorMessage('Unsupported format. Please upload JPG, PNG, or WEBP.');
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File exceeds maximum upload limit of 25MB.');
      return;
    }

    setErrorMessage(null);
    setOriginalFile(file);
    const origUrl = URL.createObjectURL(file);
    setOriginalUrl(origUrl);
    setResultUrl(null);
    setResultBlob(null);

    // Automatically trigger AI background removal
    runAiRemoval(file);
  };

  // Run AI removal pipeline with stage tracking
  const runAiRemoval = async (fileOrBlob: File | Blob) => {
    setIsProcessing(true);
    setProcessingStage('Preparing image...');
    setProcessingProgress(10);
    analytics.track('processing_started');

    try {
      const cutoutBlob = await remove_background(fileOrBlob, (stage, progress) => {
        setProcessingStage(stage);
        if (progress !== undefined) setProcessingProgress(progress);
      });

      const cutoutUrl = URL.createObjectURL(cutoutBlob);
      setResultBlob(cutoutBlob);
      setResultUrl(cutoutUrl);
      analytics.track('processing_completed');
    } catch (err: any) {
      console.error('Background removal error:', err);
      setErrorMessage(err?.message || 'Failed to remove background. Please try another image.');
      analytics.track('processing_failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Load sample image
  const handleLoadSample = async (sampleUrl: string, sampleName: string) => {
    try {
      setIsProcessing(true);
      setProcessingStage('Fetching sample...');
      const response = await fetch(sampleUrl);
      const blob = await response.blob();
      const file = new File([blob], `${sampleName.toLowerCase().replace(/\s+/g, '_')}.jpg`, {
        type: 'image/jpeg',
      });
      handleImageSelected(file);
    } catch (e) {
      setErrorMessage('Could not load sample photo. Please upload your own image.');
      setIsProcessing(false);
    }
  };

  const handleEditorSaved = (newBlob: Blob, newUrl: string) => {
    setResultBlob(newBlob);
    setResultUrl(newUrl);
    setIsEditorOpen(false);
    analytics.track('editor_saved' as any);
  };

  const handleResetAdjustments = () => {
    setAdjustments({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      sharpness: 0,
    });
  };

  const handleClearCurrent = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setOriginalFile(null);
    setOriginalUrl(null);
    setResultBlob(null);
    setResultUrl(null);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Google AdSense Placement: Top Header Banner */}
      <GoogleAd position="header-banner" minHeight="60px" />

      {/* HERO SECTION */}
      <section className="relative px-4 sm:px-6 pt-8 pb-12 sm:pt-14 sm:pb-20 max-w-7xl mx-auto w-full text-center">
        {/* Anti-slop clean typography without pills or generic floating badges */}
        <h1 className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-[1.15]">
          Remove Image Backgrounds in Seconds
        </h1>

        <p className="mt-4 sm:mt-5 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Free AI-powered background remover. Create transparent PNG images instantly.
        </p>

        {/* Hero Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 sm:mt-8">
          <button
            onClick={() => uploadInputRef.current?.click()}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow transition-all active:scale-98"
          >
            Remove Background
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('how-it-works-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-sm rounded-xl transition-all"
          >
            How It Works
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={uploadInputRef as any}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageSelected(file);
          }}
        />

        {/* MAIN UPLOAD / STUDIO CONTAINER */}
        <div className="mt-10 max-w-4xl mx-auto w-full">
          {!originalUrl ? (
            /* Upload Drop Area */
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleImageSelected(file);
              }}
              onClick={() => uploadInputRef.current?.click()}
              className="relative group flex flex-col items-center justify-center p-10 sm:p-16 rounded-3xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 dark:hover:border-indigo-400 bg-white/70 dark:bg-neutral-900/60 backdrop-blur-xs cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h2 className="font-display font-semibold text-lg sm:text-xl text-neutral-900 dark:text-white">
                Drag &amp; Drop Your Image
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                or click to browse your files
              </p>

              <div className="flex items-center gap-2 mt-4 text-[11px] text-neutral-400 font-mono">
                <span>Supported: JPG · JPEG · PNG · WEBP</span>
                <span>·</span>
                <span>Max: 25 MB</span>
              </div>

              {/* Sample Images for Immediate Testing */}
              <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800/80 w-full max-w-lg">
                <p className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-3">
                  Or test with sample images:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_IMAGES.map((sample) => (
                    <button
                      key={sample.name}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadSample(sample.url, sample.name);
                      }}
                      className="group/sample relative flex flex-col items-center p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 bg-neutral-50 dark:bg-neutral-800/50 transition-all text-left"
                    >
                      <img
                        src={sample.url}
                        alt={sample.name}
                        className="w-full h-14 object-cover rounded-lg"
                      />
                      <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-300 mt-1 truncate w-full text-center">
                        {sample.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Active Working Studio Canvas */
            <div className="flex flex-col gap-6 text-left">
              {/* Status or Error Banner */}
              {errorMessage && (
                <div className="flex items-center justify-between p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  <button
                    onClick={() => runAiRemoval(originalFile || (originalUrl as any))}
                    className="font-semibold underline ml-2 hover:text-rose-900"
                  >
                    Retry
                  </button>
                </div>
              )}

              {/* Real Processing Stage Indicator */}
              {isProcessing && (
                <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="relative mb-3">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  </div>
                  <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
                    {processingStage || 'Processing with AI model...'}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Isolating fine contours, hair strands, and transparent boundaries
                  </p>
                  {processingProgress !== undefined && (
                    <div className="w-64 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full mt-4 overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${processingProgress}%` }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* BEFORE / AFTER VIEWER */}
              {resultUrl && (
                <>
                  <BeforeAfterViewer
                    originalUrl={originalUrl}
                    resultUrl={resultUrl}
                  />

                  {/* Action Bar Under Viewer */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditorOpen(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-800 dark:text-neutral-200 transition-colors"
                      >
                        <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Manual Eraser / Restore</span>
                      </button>

                      <button
                        onClick={handleClearCurrent}
                        className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Upload another image"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => setIsExportOpen(true)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs hover:shadow transition-all active:scale-98"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Cutout</span>
                    </button>
                  </div>

                  {/* BACKGROUND OPTIONS */}
                  <BackgroundCustomizer
                    settings={backgroundSettings}
                    onChange={setBackgroundSettings}
                  />

                  {/* IMAGE ADJUSTMENTS */}
                  <AdjustmentsControl
                    adjustments={adjustments}
                    onChange={setAdjustments}
                    onReset={handleResetAdjustments}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Google AdSense Placement: Below Hero Tool */}
      <GoogleAd position="below-hero" />

      {/* HOW IT WORKS SECTION */}
      <section
        id="how-it-works-section"
        className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-neutral-200 dark:border-neutral-800"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Simple 3-Step Process
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white mt-1">
            How RemoveBG AI Works
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2">
            State-of-the-art vision models segment subjects without human intervention.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
            <span className="font-mono text-xs font-semibold text-neutral-400">01</span>
            <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white mt-2">
              Upload Any Photo
            </h3>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Drop any JPG, PNG, or WEBP photo. Whether it is an e-commerce sneaker, portrait headshot, or pet snapshot.
            </p>
          </div>

          <div className="flex flex-col p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
            <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400">02</span>
            <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white mt-2">
              Neural Salient Segmentation
            </h3>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              The AI calculates semantic depth and isolates foreground contours, producing clean hair and translucent boundary matting.
            </p>
          </div>

          <div className="flex flex-col p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
            <span className="font-mono text-xs font-semibold text-neutral-400">03</span>
            <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white mt-2">
              Refine &amp; Export
            </h3>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Fine-tune with the eraser brush, replace the background with custom colors or gradients, and download full-resolution PNGs.
            </p>
          </div>
        </div>
      </section>

      {/* CORE FEATURES BENTO GRID */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Engineered for Precision
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white mt-1">
            Built for Creatives &amp; E-Commerce
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
              Instant AI Inference
            </h3>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Zero wait queues or third-party rate limits. The model executes directly on your hardware using WebAssembly and WebGPU acceleration.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
              100% Privacy-First Architecture
            </h3>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Your images are processed locally or temporary on self-hosted instances. Images are never permanently retained or sold to third parties.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-display font-semibold text-base text-neutral-900 dark:text-white">
              High-Precision Mask Editor
            </h3>
            <p className="text-xs text-neutral-500 mt-2 leading-relaxed">
              Manually erase stray shadows or restore subtle details with intuitive brush controls, edge feathering, and undo history.
            </p>
          </div>
        </div>
      </section>

      {/* Google AdSense Placement: Between Content Sections */}
      <GoogleAd position="between-sections" />

      {/* USE CASES */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Versatile Applications
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white mt-1">
            Perfect for Every Workflow
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <h4 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1.5">
              E-Commerce Stores
            </h4>
            <p className="text-neutral-500 leading-relaxed">
              Create pure white background product photos compliant with Amazon, eBay, Etsy, and Shopify guidelines.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <h4 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1.5">
              Portraits &amp; Headshots
            </h4>
            <p className="text-neutral-500 leading-relaxed">
              Extract clean profile pictures for LinkedIn, resumes, and enterprise team directories with smooth hair matting.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <h4 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1.5">
              Marketing &amp; Ads
            </h4>
            <p className="text-neutral-500 leading-relaxed">
              Place isolated hero assets onto vibrant banners, promotional flyers, and social media carousels.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <h4 className="font-semibold text-neutral-900 dark:text-white text-sm mb-1.5">
              Developers &amp; Designers
            </h4>
            <p className="text-neutral-500 leading-relaxed">
              Export transparent PNG assets for Figma design systems, website landing pages, and mobile UI mocks.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto w-full border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
            Common Inquiries
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white mt-1">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.slice(0, 6).map((item, idx) => {
            const isOpen = expandedFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-medium text-sm text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => onSelectTab('faq')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            View all questions in the knowledge base →
          </button>
        </div>
      </section>

      {/* BLOG PREVIEWS */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Educational Guides
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-white mt-1">
              Latest Articles &amp; Tips
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('blog')}
            className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1"
          >
            <span>All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BLOG_POSTS.slice(0, 3).map((post) => (
            <div
              key={post.slug}
              onClick={() => onSelectBlog(post.slug)}
              className="group cursor-pointer flex flex-col p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-indigo-500/50 transition-all"
            >
              <div className="flex items-center gap-2 text-[11px] text-neutral-400 mb-2">
                <span>{post.category}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="font-display font-bold text-base text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs text-neutral-500 mt-2 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Read Guide</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Google AdSense Placement: Before Footer */}
      <GoogleAd position="before-footer" />

      {/* IMAGE EDITOR MODAL */}
      {isEditorOpen && originalUrl && resultUrl && (
        <ImageEditor
          originalUrl={originalUrl}
          resultUrl={resultUrl}
          onSave={handleEditorSaved}
          onClose={() => setIsEditorOpen(false)}
        />
      )}

      {/* EXPORT MODAL */}
      {isExportOpen && resultUrl && (
        <ExportModal
          originalName={originalFile?.name || 'cutout'}
          resultUrl={resultUrl}
          backgroundSettings={backgroundSettings}
          adjustments={adjustments}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}
    </div>
  );
};
