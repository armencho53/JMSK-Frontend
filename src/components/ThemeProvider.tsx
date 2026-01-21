import React, { createContext, useContext } from 'react';
import { getThemeClasses, getThemeColors, getCurrentTheme } from '../lib/theme';

interface ThemeContextType {
  currentTheme: 'professional';
  themeClasses: ReturnType<typeof getThemeClasses>;
  themeColors: ReturnType<typeof getThemeColors>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const currentTheme = getCurrentTheme();
  const themeClasses = getThemeClasses();
  const themeColors = getThemeColors();

  return (
    <ThemeContext.Provider value={{ currentTheme, themeClasses, themeColors }}>
      {children}
    </ThemeContext.Provider>
  );
}