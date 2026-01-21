/**
 * Font Loading Optimization
 * 
 * Optimizes font loading for the jewelry manufacturing application
 * with preloading, font-display strategies, and performance monitoring.
 */

import React from 'react';
import { fontLoader } from './performance';

/**
 * Font configuration for the three design themes
 */
export const FONT_CONFIG = {
  elegant: {
    heading: {
      family: 'Inter',
      weights: ['400', '500', '600', '700'],
      display: 'swap',
    },
    body: {
      family: 'Inter',
      weights: ['400', '500'],
      display: 'swap',
    },
    accent: {
      family: 'Playfair Display',
      weights: ['400', '600'],
      display: 'fallback',
    },
  },
  luxury: {
    heading: {
      family: 'Montserrat',
      weights: ['400', '500', '600', '700'],
      display: 'swap',
    },
    body: {
      family: 'Source Sans Pro',
      weights: ['400', '500'],
      display: 'swap',
    },
    accent: {
      family: 'Cormorant Garamond',
      weights: ['400', '600'],
      display: 'fallback',
    },
  },
  professional: {
    heading: {
      family: 'Poppins',
      weights: ['400', '500', '600', '700'],
      display: 'swap',
    },
    body: {
      family: 'Open Sans',
      weights: ['400', '500'],
      display: 'swap',
    },
    accent: {
      family: 'Lora',
      weights: ['400', '600'],
      display: 'fallback',
    },
  },
} as const;

/**
 * Font loading strategies
 */
export type FontLoadingStrategy = 'critical' | 'preload' | 'lazy' | 'optional';

/**
 * Font optimization manager
 */
export class FontOptimizer {
  private loadedFonts = new Set<string>();
  private criticalFonts = new Set<string>();
  private preloadedFonts = new Set<string>();

  /**
   * Initialize font optimization for a theme
   */
  async initializeTheme(theme: keyof typeof FONT_CONFIG) {
    const config = FONT_CONFIG[theme];
    
    // Load critical fonts first (heading and body)
    await this.loadCriticalFonts(config);
    
    // Preload accent fonts
    this.preloadFonts(config.accent);
    
    // Set up font loading monitoring
    this.monitorFontLoading();
  }

  /**
   * Load critical fonts immediately
   */
  private async loadCriticalFonts(config: typeof FONT_CONFIG[keyof typeof FONT_CONFIG]) {
    const criticalFonts = [
      { ...config.heading, type: 'heading' },
      { ...config.body, type: 'body' },
    ];

    const loadPromises = criticalFonts.flatMap(font =>
      font.weights.map(weight =>
        this.loadFont(font.family, weight, 'normal', font.display as any)
      )
    );

    try {
      await Promise.all(loadPromises);
      console.log('Critical fonts loaded successfully');
    } catch (error) {
      console.warn('Some critical fonts failed to load:', error);
    }
  }

  /**
   * Preload fonts for better perceived performance
   */
  private preloadFonts(fontConfig: { family: string; weights: readonly string[]; display: string }) {
    fontConfig.weights.forEach(weight => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          this.loadFont(fontConfig.family, weight, 'normal', fontConfig.display as any);
        });
      } else {
        setTimeout(() => {
          this.loadFont(fontConfig.family, weight, 'normal', fontConfig.display as any);
        }, 100);
      }
    });
  }

  /**
   * Load a specific font
   */
  private async loadFont(
    family: string,
    weight: string,
    style: string = 'normal',
    display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional' = 'swap'
  ): Promise<void> {
    const fontKey = `${family}-${weight}-${style}`;
    
    if (this.loadedFonts.has(fontKey)) {
      return;
    }

    try {
      await fontLoader.loadFont(family, { weight, style, display });
      this.loadedFonts.add(fontKey);
    } catch (error) {
      console.warn(`Failed to load font: ${fontKey}`, error);
    }
  }

  /**
   * Monitor font loading performance
   */
  private monitorFontLoading() {
    if ('fonts' in document) {
      document.fonts.addEventListener('loadingdone', (event) => {
        console.log(`Fonts loaded: ${event.fontfaces.length} fonts`);
      });

      document.fonts.addEventListener('loadingerror', (event) => {
        console.warn('Font loading error:', event);
      });
    }
  }

  /**
   * Optimize font loading for specific content
   */
  optimizeForContent(content: string, theme: keyof typeof FONT_CONFIG) {
    const config = FONT_CONFIG[theme];
    
    // Analyze content to determine which fonts are needed
    const needsHeading = /^(h[1-6]|\.heading|\.title)/m.test(content);
    const needsAccent = /\.(accent|serif|display)/m.test(content);
    
    if (needsHeading) {
      config.heading.weights.forEach(weight => {
        this.loadFont(config.heading.family, weight);
      });
    }
    
    if (needsAccent) {
      config.accent.weights.forEach(weight => {
        this.loadFont(config.accent.family, weight);
      });
    }
  }

  /**
   * Get font loading status
   */
  getFontLoadingStatus() {
    return {
      loaded: Array.from(this.loadedFonts),
      critical: Array.from(this.criticalFonts),
      preloaded: Array.from(this.preloadedFonts),
    };
  }

  /**
   * Preconnect to font CDNs
   */
  static preconnectToFontCDNs() {
    const fontCDNs = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    fontCDNs.forEach(cdn => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = cdn;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }

  /**
   * Generate font CSS with optimized loading
   */
  static generateFontCSS(theme: keyof typeof FONT_CONFIG): string {
    const config = FONT_CONFIG[theme];
    
    return `
      /* Critical fonts with font-display: swap */
      @font-face {
        font-family: '${config.heading.family}';
        font-display: ${config.heading.display};
        /* Add font URLs here */
      }
      
      @font-face {
        font-family: '${config.body.family}';
        font-display: ${config.body.display};
        /* Add font URLs here */
      }
      
      /* Non-critical fonts with font-display: fallback */
      @font-face {
        font-family: '${config.accent.family}';
        font-display: ${config.accent.display};
        /* Add font URLs here */
      }
      
      /* Font fallback stacks */
      .font-heading {
        font-family: '${config.heading.family}', system-ui, -apple-system, sans-serif;
      }
      
      .font-body {
        font-family: '${config.body.family}', system-ui, -apple-system, sans-serif;
      }
      
      .font-accent {
        font-family: '${config.accent.family}', Georgia, serif;
      }
    `;
  }
}

/**
 * Global font optimizer instance
 */
export const fontOptimizer = new FontOptimizer();

/**
 * Initialize font optimization on page load
 */
export function initializeFontOptimization(theme: keyof typeof FONT_CONFIG = 'elegant') {
  // Preconnect to font CDNs
  FontOptimizer.preconnectToFontCDNs();
  
  // Initialize theme fonts
  fontOptimizer.initializeTheme(theme);
  
  // Monitor font loading performance
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource' && entry.name.includes('font')) {
          console.log(`Font loaded: ${entry.name} in ${entry.duration.toFixed(2)}ms`);
        }
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
  }
}

/**
 * Font loading hook for React components
 */
export function useFontOptimization(theme: keyof typeof FONT_CONFIG) {
  React.useEffect(() => {
    fontOptimizer.initializeTheme(theme);
  }, [theme]);
  
  return fontOptimizer.getFontLoadingStatus();
}

// Auto-initialize on module load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    initializeFontOptimization();
  });
}