/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Official Google AdSense Integration Component
 * 
 * Strict AdSense Compliance:
 * - NO deceptive ad placements
 * - NO fake advertisement mockups or simulated ad graphics
 * - Clean responsive <ins className="adsbygoogle"> integration
 * - Safe spacing away from interactive controls and upload/download buttons
 * - Graceful fallback when ad blockers are active or client ID is not configured
 */

import React, { useEffect, useRef, useState } from 'react';

export type AdSlotPosition = 
  | 'header-banner'
  | 'below-hero'
  | 'between-sections'
  | 'sidebar-desktop'
  | 'below-editor'
  | 'before-footer';

interface GoogleAdProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal';
  responsive?: boolean;
  position: AdSlotPosition;
  className?: string;
  minHeight?: string;
}

export const GoogleAd: React.FC<GoogleAdProps> = ({
  slot,
  format = 'auto',
  responsive = true,
  position,
  className = '',
  minHeight = '90px',
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adBlocked, setAdBlocked] = useState(false);

  // Retrieve client ID from Vite or Next env variables, or default to configured publisher ID
  const clientId = 
    (import.meta as any).env?.VITE_ADSENSE_CLIENT_ID ||
    (import.meta as any).env?.NEXT_PUBLIC_ADSENSE_CLIENT_ID ||
    'ca-pub-8048092069219386';

  // Specific slot fallback mapping based on position
  const activeSlot = slot || (import.meta as any).env?.[`VITE_ADSENSE_SLOT_${position.toUpperCase().replace(/-/g, '_')}`] || '';

  useEffect(() => {
    if (!clientId) return;

    // Dynamically inject Google AdSense script once if not already present
    const existingScript = document.querySelector('script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onerror = () => setAdBlocked(true);
      document.head.appendChild(script);
    }

    try {
      // Trigger AdSense push safely
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as any).adsbygoogle || [];
        adsbygoogle.push({});
        setAdLoaded(true);
      }
    } catch (e) {
      // Ad blocker or script rejection
      setAdBlocked(true);
    }
  }, [clientId, activeSlot]);

  // If user has not configured AdSense Client ID in .env yet, show a clean, quiet configuration badge
  if (!clientId) {
    return (
      <div
        className={`my-6 mx-auto w-full max-w-4xl rounded-lg border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-900/40 p-3 text-center text-xs text-neutral-500 transition-opacity ${className}`}
        style={{ minHeight }}
      >
        <div className="flex flex-col items-center justify-center h-full min-h-[70px] space-y-1">
          <span className="font-mono text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
            AdSense Placement: {position}
          </span>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
            To activate real ads, configure <code className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded text-neutral-700 dark:text-neutral-300">VITE_ADSENSE_CLIENT_ID</code> in <code className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded text-neutral-700 dark:text-neutral-300">.env</code>
          </span>
        </div>
      </div>
    );
  }

  if (adBlocked) {
    // If ad-blocked, collapse gracefully without breaking the layout
    return null;
  }

  return (
    <div
      ref={adRef}
      className={`my-6 mx-auto w-full max-w-5xl overflow-hidden rounded-lg bg-transparent text-center transition-all ${className}`}
      style={{ minHeight }}
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight }}
        data-ad-client={clientId}
        data-ad-slot={activeSlot || undefined}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};
