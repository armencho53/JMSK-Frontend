import { ThemeProvider } from './ThemeProvider';

/**
 * Test component to verify design system foundation is working
 * This component demonstrates all three design themes and core utilities
 */
export function DesignSystemTest() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto space-jewelry-lg">
          {/* Header */}
          <div className="jewelry-card">
            <h1 className="text-3xl font-semibold text-slate-800 mb-4">
              Jewelry Manufacturing Design System
            </h1>
            <p className="text-jewelry-base theme-neutral">
              Testing the foundation with all three design options: Elegant Minimalism, Luxury Dark Mode, and Modern Professional.
            </p>
          </div>

          {/* Professional Theme Active */}
          <div className="jewelry-card">
            <h3 className="text-lg font-semibold mb-2">Professional Theme</h3>
            <p className="text-sm text-gray-600">Clean, modern professional design system is active</p>
          </div>

          {/* Color Palette Demo */}
          <div className="jewelry-card">
            <h2 className="text-jewelry-2xl font-elegant-heading theme-primary mb-4">
              Color Palette
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 theme-bg-primary theme-border-radius mx-auto mb-2"></div>
                <p className="text-jewelry-sm theme-neutral">Primary</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 theme-bg-secondary theme-border-radius mx-auto mb-2"></div>
                <p className="text-jewelry-sm theme-neutral">Secondary</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 theme-border-radius mx-auto mb-2"></div>
                <p className="text-jewelry-sm theme-success">Success</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500 theme-border-radius mx-auto mb-2"></div>
                <p className="text-jewelry-sm theme-error">Error</p>
              </div>
            </div>
          </div>

          {/* Typography Demo */}
          <div className="jewelry-card">
            <h2 className="text-jewelry-2xl font-elegant-heading theme-primary mb-4">
              Typography Scale
            </h2>
            <div className="space-jewelry-md">
              <p className="text-jewelry-4xl font-elegant-heading theme-primary">Heading 1 - 4xl</p>
              <p className="text-jewelry-3xl font-elegant-heading theme-primary">Heading 2 - 3xl</p>
              <p className="text-jewelry-2xl font-elegant-heading theme-primary">Heading 3 - 2xl</p>
              <p className="text-jewelry-xl font-elegant-heading theme-primary">Heading 4 - xl</p>
              <p className="text-jewelry-lg theme-neutral">Large text - lg</p>
              <p className="text-jewelry-base theme-neutral">Body text - base</p>
              <p className="text-jewelry-sm theme-neutral">Small text - sm</p>
              <p className="text-jewelry-xs theme-neutral">Extra small - xs</p>
            </div>
          </div>

          {/* Component Demo */}
          <div className="jewelry-card">
            <h2 className="text-jewelry-2xl font-elegant-heading theme-primary mb-4">
              Component Examples
            </h2>
            <div className="space-jewelry-md">
              <div className="flex flex-wrap gap-4">
                <button className="jewelry-button-primary">
                  Primary Button
                </button>
                <button className="jewelry-button-secondary">
                  Secondary Button
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Sample input field"
                  className="jewelry-input"
                />
                <select className="jewelry-input">
                  <option>Sample dropdown</option>
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
              </div>
            </div>
          </div>

          {/* Shadow and Spacing Demo */}
          <div className="jewelry-card">
            <h2 className="text-jewelry-2xl font-elegant-heading theme-primary mb-4">
              Shadows & Spacing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="theme-bg-neutral p-4 theme-border-radius theme-shadow">
                <p className="text-jewelry-sm theme-neutral">Default Shadow</p>
              </div>
              <div className="theme-bg-neutral p-4 theme-border-radius theme-shadow-hover">
                <p className="text-jewelry-sm theme-neutral">Hover Shadow</p>
              </div>
              <div className="theme-bg-neutral p-4 theme-border-radius-lg shadow-luxury">
                <p className="text-jewelry-sm theme-neutral">Large Radius</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}