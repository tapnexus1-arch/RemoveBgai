/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * RemoveBG AI - Educational Blog & Guide Reader
 */

import React, { useState } from 'react';
import { BLOG_POSTS } from '../data/blogPosts';
import { GoogleAd } from '../components/GoogleAd';
import { ArrowLeft, Clock, Calendar, BookOpen, Share2 } from 'lucide-react';

interface BlogPageProps {
  selectedSlug?: string | null;
  onSelectSlug: (slug: string | null) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  selectedSlug,
  onSelectSlug,
}) => {
  const currentPost = BLOG_POSTS.find((p) => p.slug === selectedSlug);

  if (currentPost) {
    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <GoogleAd position="header-banner" minHeight="60px" />

        <button
          onClick={() => onSelectSlug(null)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-indigo-600 transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>

        <header className="mb-8">
          <div className="flex items-center gap-3 text-xs text-neutral-400 mb-3">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentPost.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentPost.date}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentPost.readTime}</span>
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl sm:text-4xl text-neutral-900 dark:text-white leading-tight">
            {currentPost.title}
          </h1>

          <p className="mt-3 text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
            {currentPost.subtitle}
          </p>
        </header>

        <GoogleAd position="between-sections" />

        <div className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed space-y-5">
          {currentPost.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>Published by RemoveBG AI Research Team</span>
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Article URL copied to clipboard');
              }
            }}
            className="flex items-center gap-1 text-indigo-600 hover:underline cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Guide</span>
          </button>
        </div>

        <div className="mt-10">
          <GoogleAd position="before-footer" />
        </div>
      </article>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <GoogleAd position="header-banner" minHeight="60px" />

      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-display font-bold text-2xl sm:text-4xl text-neutral-900 dark:text-white">
          Articles, Guides &amp; AI Vision Tutorials
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
          Practical advice on background removal, alpha transparency, and e-commerce product photography.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <div
            key={post.slug}
            onClick={() => onSelectSlug(post.slug)}
            className="group cursor-pointer flex flex-col p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs hover:border-indigo-500 transition-all"
          >
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-2">
              <span className="font-medium text-indigo-600 dark:text-indigo-400">{post.category}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>

            <h3 className="font-display font-bold text-lg text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {post.title}
            </h3>

            <p className="text-xs text-neutral-500 mt-2 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center justify-between">
              <span>Read Full Guide</span>
              <span className="text-neutral-400 font-normal">{post.date}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <GoogleAd position="before-footer" />
      </div>
    </div>
  );
};
