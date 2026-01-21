/**
 * Performance Optimization Utilities
 * 
 * Provides utilities for lazy loading, code splitting, and performance monitoring
 * to optimize the jewelry manufacturing application's bundle size and runtime performance.
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';

/**
 * Enhanced lazy loading with error boundaries and loading states
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    fallback?: ComponentType;
    retryCount?: number;
    retryDelay?: number;
  } = {}
): LazyExoticComponent<T> {
  const { retryCount = 3, retryDelay = 1000 } = options;
  
  let retries = 0;
  
  const retryImport = async (): Promise<{ default: T }> => {
    try {
      return await importFn();
    } catch (error) {
      if (retries < retryCount) {
        retries++;
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return retryImport();
      }
      throw error;
    }
  };
  
  return lazy(retryImport);
}

/**
 * Preload a component for better perceived performance
 */
export function preloadComponent(importFn: () => Promise<any>): void {
  // Use requestIdleCallback if available, otherwise use setTimeout
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      importFn().catch(() => {
        // Silently fail preloading
      });
    });
  } else {
    setTimeout(() => {
      importFn().catch(() => {
        // Silently fail preloading
      });
    }, 100);
  }
}

/**
 * Image lazy loading with intersection observer
 */
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null;
  private images: Set<HTMLImageElement> = new Set();

  constructor(options: IntersectionObserverInit = {}) {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: '50px 0px',
          threshold: 0.01,
          ...options,
        }
      );
    }
  }

  private handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        this.loadImage(img);
        this.observer?.unobserve(img);
        this.images.delete(img);
      }
    });
  }

  private loadImage(img: HTMLImageElement) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    
    if (src) {
      img.src = src;
    }
    if (srcset) {
      img.srcset = srcset;
    }
    
    img.classList.remove('lazy');
    img.classList.add('loaded');
  }

  observe(img: HTMLImageElement) {
    if (this.observer) {
      this.images.add(img);
      this.observer.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(img);
    }
  }

  unobserve(img: HTMLImageElement) {
    if (this.observer) {
      this.observer.unobserve(img);
      this.images.delete(img);
    }
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
      this.images.clear();
    }
  }
}

/**
 * Font loading optimization
 */
export class FontLoader {
  private loadedFonts: Set<string> = new Set();

  async loadFont(fontFamily: string, options: {
    weight?: string;
    style?: string;
    display?: string;
  } = {}): Promise<void> {
    const { weight = '400', style = 'normal', display = 'swap' } = options;
    const fontKey = `${fontFamily}-${weight}-${style}`;
    
    if (this.loadedFonts.has(fontKey)) {
      return;
    }

    if ('fonts' in document) {
      try {
        const font = new FontFace(fontFamily, `url(/fonts/${fontFamily}-${weight}.woff2)`, {
          weight,
          style,
          display: display as FontDisplay,
        });
        
        await font.load();
        document.fonts.add(font);
        this.loadedFonts.add(fontKey);
      } catch (error) {
        console.warn(`Failed to load font: ${fontFamily}`, error);
      }
    }
  }

  preloadFonts(fonts: Array<{ family: string; weight?: string; style?: string }>) {
    fonts.forEach(font => {
      this.loadFont(font.family, { weight: font.weight, style: font.style });
    });
  }
}

/**
 * CSS optimization utilities
 */
export class CSSOptimizer {
  private criticalCSS: Set<string> = new Set();
  private deferredCSS: Set<string> = new Set();

  markCritical(selector: string) {
    this.criticalCSS.add(selector);
  }

  markDeferred(selector: string) {
    this.deferredCSS.add(selector);
  }

  /**
   * Load non-critical CSS asynchronously
   */
  loadDeferredCSS(href: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.media = 'print'; // Load as print media first
      link.onload = () => {
        link.media = 'all'; // Switch to all media when loaded
        resolve();
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  /**
   * Inline critical CSS
   */
  inlineCriticalCSS(css: string) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();

  startTiming(label: string) {
    this.metrics.set(`${label}_start`, performance.now());
  }

  endTiming(label: string): number {
    const startTime = this.metrics.get(`${label}_start`);
    if (startTime === undefined) {
      console.warn(`No start time found for: ${label}`);
      return 0;
    }
    
    const duration = performance.now() - startTime;
    this.metrics.set(label, duration);
    return duration;
  }

  getMetric(label: string): number | undefined {
    return this.metrics.get(label);
  }

  getAllMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  /**
   * Measure component render time
   */
  measureRender<T extends any[]>(
    fn: (...args: T) => any,
    label: string
  ): (...args: T) => any {
    return (...args: T) => {
      this.startTiming(label);
      const result = fn(...args);
      this.endTiming(label);
      return result;
    };
  }

  /**
   * Report Core Web Vitals
   */
  reportWebVitals() {
    if ('web-vitals' in window) {
      // This would require the web-vitals library
      // For now, we'll use basic performance API
      this.reportBasicMetrics();
    } else {
      this.reportBasicMetrics();
    }
  }

  private reportBasicMetrics() {
    // First Contentful Paint
    const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
    if (fcpEntry) {
      console.log('First Contentful Paint:', fcpEntry.startTime);
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('Largest Contentful Paint:', lastEntry.startTime);
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    // Navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
      console.log('Load Complete:', navigation.loadEventEnd - navigation.loadEventStart);
    }
  }
}

/**
 * Bundle size optimization utilities
 */
export class BundleOptimizer {
  /**
   * Dynamic import with error handling
   */
  static async dynamicImport<T>(
    importFn: () => Promise<T>,
    fallback?: T
  ): Promise<T> {
    try {
      return await importFn();
    } catch (error) {
      console.error('Dynamic import failed:', error);
      if (fallback !== undefined) {
        return fallback;
      }
      throw error;
    }
  }

  /**
   * Tree-shake unused exports
   */
  static createNamedExport<T extends Record<string, any>>(
    module: T,
    usedExports: (keyof T)[]
  ): Partial<T> {
    const result: Partial<T> = {};
    usedExports.forEach(exportName => {
      if (exportName in module) {
        result[exportName] = module[exportName];
      }
    });
    return result;
  }
}

// Global instances
export const lazyImageLoader = new LazyImageLoader();
export const fontLoader = new FontLoader();
export const cssOptimizer = new CSSOptimizer();
export const performanceMonitor = new PerformanceMonitor();

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  lazyImageLoader.disconnect();
});