/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Comprehensive FAQ Data
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Is RemoveBG AI completely free to use?',
    answer: 'Yes! RemoveBG AI is 100% free with no monthly subscription, no credit card required, and no limits on the number of images you can process. The service is supported via non-intrusive Google AdSense advertising.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'RemoveBG AI supports all standard web image formats: JPG, JPEG, PNG, and WEBP. You can also export your finished cutouts in transparent PNG, white/custom background JPEG, or high-efficiency WEBP.',
  },
  {
    question: 'What is the maximum image file size and resolution?',
    answer: 'You can upload images up to 25 MB in size. The AI model can process full-resolution images up to 4K+ without downscaling, preserving every fine detail, hair strand, and garment edge.',
  },
  {
    question: 'Are my uploaded images stored or logged on your servers?',
    answer: 'No. We operate under a strict privacy-first architecture. Images are processed locally on your device via client-side WebAssembly ONNX neural models or on self-hosted instances with automatic temporary file deletion (configured via IMAGE_RETENTION_SECONDS). We never store user images in permanent databases or share them with third parties.',
  },
  {
    question: 'How does the AI background removal algorithm work?',
    answer: 'RemoveBG AI is powered by open-source salient object detection neural networks (such as RMBG and BiRefNet architectures). The model has been trained on diverse visual datasets to recognize human figures, animals, vehicles, e-commerce products, and complex objects, predicting precise alpha transparency masks.',
  },
  {
    question: 'Can I remove backgrounds from e-commerce product photos?',
    answer: 'Absolutely. It is specially tuned for e-commerce catalog photos including sneakers, apparel, electronics, jewelry, and packaged goods. You can export transparent PNGs or replace the backdrop with pure white (RGB 255, 255, 255) for Amazon and eBay compliance.',
  },
  {
    question: 'Can I download transparent PNG files without watermarks?',
    answer: 'Yes. All PNG exports retain full 8-bit alpha transparency with zero watermarks, zero resolution downscaling, and zero artificial compression.',
  },
  {
    question: 'Does RemoveBG AI work on mobile phones and tablets?',
    answer: 'Yes! RemoveBG AI is built with responsive mobile layouts and touch-friendly controls. It runs smoothly on iPhone, iPad, Android phones, and tablets directly inside your mobile browser without installing apps.',
  },
  {
    question: 'Can I process multiple images at once (batch mode)?',
    answer: 'Yes! Navigate to the "Batch" tab in the top navigation. You can drag and drop dozens of photos at once, watch the AI queue process each image, and download all transparent PNGs in a single organized ZIP file.',
  },
];
