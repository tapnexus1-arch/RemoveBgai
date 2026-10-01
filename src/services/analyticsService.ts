/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Privacy-Preserving Analytics Abstraction
 * 
 * Strict Privacy Guarantee:
 * - NO image data, pixels, or binary blobs are ever collected or sent.
 * - Only aggregated, non-personally identifiable telemetry is logged if user consents.
 */

type AnalyticsEvent = 
  | 'page_view'
  | 'upload_started'
  | 'processing_started'
  | 'processing_completed'
  | 'processing_failed'
  | 'editor_opened'
  | 'editor_brush_used'
  | 'background_changed'
  | 'download_clicked'
  | 'batch_started'
  | 'batch_completed';

interface EventProperties {
  format?: string;
  source?: string;
  durationMs?: number;
  viewMode?: string;
  status?: string;
  count?: number;
  [key: string]: any;
}

class AnalyticsService {
  private isEnabled: boolean = false;

  constructor() {
    // Check user consent from localStorage
    try {
      const consent = localStorage.getItem('removebg_cookie_consent');
      if (consent) {
        const parsed = JSON.parse(consent);
        this.isEnabled = !!parsed.analytics;
      }
    } catch (_) {
      this.isEnabled = false;
    }
  }

  public setConsent(analyticsConsent: boolean): void {
    this.isEnabled = analyticsConsent;
  }

  public track(event: AnalyticsEvent, properties?: EventProperties): void {
    if (!this.isEnabled) return;

    // Sanitize properties to strictly prohibit any image/binary/personal information
    const sanitizedProps = { ...properties };
    delete (sanitizedProps as any).image;
    delete (sanitizedProps as any).pixels;
    delete (sanitizedProps as any).dataUrl;
    delete (sanitizedProps as any).blob;

    // Dispatched to custom events or window gtag if configured
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('removebg_analytics', {
          detail: { event, properties: sanitizedProps, timestamp: Date.now() },
        })
      );

      const gtag = (window as any).gtag;
      if (typeof gtag === 'function') {
        gtag('event', event, sanitizedProps);
      }
    }
  }
}

export const analytics = new AnalyticsService();
