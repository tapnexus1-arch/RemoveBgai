export type ProcessingStatus = 'idle' | 'preparing' | 'processing' | 'generating' | 'finishing' | 'complete' | 'error';

export interface BackgroundRemovalOptions {
  model?: 'rmbg' | 'general' | 'fast';
  device?: 'auto' | 'cpu' | 'webgpu' | 'wasm';
  outputFormat?: 'image/png' | 'image/webp';
  quality?: number;
}

export interface ProgressCallback {
  (stage: string, progress?: number): void;
}

export type ViewMode = 'slider' | 'side-by-side' | 'cutout-only' | 'original-only';

export type BackgroundType = 'transparent' | 'color' | 'gradient' | 'image';

export interface BackgroundSettings {
  type: BackgroundType;
  color: string;
  gradient: {
    start: string;
    end: string;
    angle: number;
    presetName?: string;
  };
  imageSrc: string | null;
  imageScale: number;
  imagePosition: { x: number; y: number };
  imageFit: 'cover' | 'contain' | 'fill';
}

export interface ImageAdjustments {
  brightness: number; // -50 to 50
  contrast: number;   // -50 to 50
  saturation: number; // -50 to 50
  blur: number;       // 0 to 10
  sharpness: number;  // 0 to 100
}

export interface EditorTool {
  mode: 'erase' | 'restore';
  brushSize: number;
  edgeSmoothing: boolean;
  opacity: number;
}

export interface BatchItem {
  id: string;
  file: File;
  name: string;
  size: number;
  originalUrl: string;
  resultUrl: string | null;
  resultBlob: Blob | null;
  status: 'waiting' | 'processing' | 'completed' | 'failed';
  stage: string;
  error?: string;
}

export interface AdSenseConfig {
  clientId: string;
  slots: {
    headerBanner?: string;
    belowHero?: string;
    betweenSections?: string;
    sidebar?: string;
    belowEditor?: string;
    beforeFooter?: string;
  };
}

export interface SystemMetrics {
  totalProcessed: number;
  successfulJobs: number;
  failedJobs: number;
  avgProcessingTimeMs: number;
  uptimeSeconds: number;
  activeModel: string;
  device: string;
  cleanupRetentionSeconds: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  readTime: string;
  date: string;
  category: string;
  excerpt: string;
  content: string[];
}
