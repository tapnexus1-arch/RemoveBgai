/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Main Application Entrypoint
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { BatchPage } from './pages/BatchPage';
import { BlogPage } from './pages/BlogPage';
import { FaqPage } from './pages/FaqPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsPage } from './pages/TermsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CookieConsent } from './components/CookieConsent';
import { analytics } from './services/analyticsService';
import { backgroundRemovalService } from './services/backgroundRemovalService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedBlogSlug, setSelectedBlogSlug] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('removebg_theme') as 'light' | 'dark' | 'system' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (_) {}

    // Preload AI model in the background after initial render
    const timer = setTimeout(() => {
      backgroundRemovalService.preloadModel();
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Sync theme changes with DOM documentElement
  useEffect(() => {
    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    try {
      localStorage.setItem('removebg_theme', theme);
    } catch (_) {}
  }, [theme]);

  // Handle URL route synchronization
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      if (path === '/batch') setCurrentTab('batch');
      else if (path === '/faq') setCurrentTab('faq');
      else if (path === '/blog') setCurrentTab('blog');
      else if (path === '/privacy') setCurrentTab('privacy');
      else if (path === '/terms') setCurrentTab('terms');
      else if (path === '/admin') setCurrentTab('admin');
      else setCurrentTab('home');
    };

    handlePopState();
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
    setSelectedBlogSlug(null);
    analytics.track('page_view', { page: tab });

    // Update browser URL history without reloading
    const pathMap: Record<string, string> = {
      home: '/',
      batch: '/batch',
      faq: '/faq',
      blog: '/blog',
      privacy: '/privacy',
      terms: '/terms',
      admin: '/admin',
      'how-it-works': '/#how-it-works-section',
    };

    const targetPath = pathMap[tab] || '/';
    if (tab === 'how-it-works') {
      setCurrentTab('home');
      setTimeout(() => {
        const el = document.getElementById('how-it-works-section');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }

    try {
      window.history.pushState({}, '', targetPath);
    } catch (_) {}

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectBlog = (slug: string | null) => {
    setSelectedBlogSlug(slug);
    setCurrentTab('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleTriggerUpload = () => {
    if (currentTab !== 'home') {
      handleSelectTab('home');
    }
    setTimeout(() => {
      uploadInputRef.current?.click();
    }, 100);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 font-sans transition-colors duration-200">
      {/* 3-Zone Compliant Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onTriggerUpload={handleTriggerUpload}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            onSelectTab={handleSelectTab}
            onSelectBlog={handleSelectBlog}
            uploadInputRef={uploadInputRef}
          />
        )}

        {currentTab === 'batch' && <BatchPage />}

        {currentTab === 'blog' && (
          <BlogPage
            selectedSlug={selectedBlogSlug}
            onSelectSlug={handleSelectBlog}
          />
        )}

        {currentTab === 'faq' && <FaqPage />}

        {currentTab === 'privacy' && <PrivacyPolicyPage />}

        {currentTab === 'terms' && <TermsPage />}

        {currentTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Quiet Footer */}
      <Footer onSelectTab={handleSelectTab} />

      {/* Privacy-Preserving Cookie & AdSense Consent */}
      <CookieConsent />
    </div>
  );
}
