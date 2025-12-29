import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { Appearance, ColorSchemeName, useColorScheme } from 'react-native';
import { useThemeStore, lightTheme, darkTheme, getThemeColors } from '@/store';
import type { ThemeMode } from '@/store';

// Theme colors type
export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryLight: string;
  border: string;
  error: string;
  success: string;
}

// Theme context type
interface ThemeContextType {
  themeMode: ThemeMode;
  effectiveTheme: ColorSchemeName;
  colors: ThemeColors;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const { themeMode, effectiveTheme, setThemeMode, restoreTheme } = useThemeStore();

  // Restore theme on mount
  useEffect(() => {
    restoreTheme();
  }, []);

  // Listen for system theme changes when in 'system' mode
  useEffect(() => {
    if (themeMode === 'system') {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        // The store will handle the update
        useThemeStore.setState({ effectiveTheme: colorScheme || 'light' });
      });

      return () => subscription.remove();
    }
  }, [themeMode]);

  // Calculate the actual effective theme
  const currentEffectiveTheme: ColorSchemeName = 
    themeMode === 'system' 
      ? (systemColorScheme || 'light') 
      : themeMode;

  const colors = getThemeColors(currentEffectiveTheme);
  const isDark = currentEffectiveTheme === 'dark';

  const value: ThemeContextType = {
    themeMode,
    effectiveTheme: currentEffectiveTheme,
    colors,
    isDark,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Export theme colors for direct usage
export { lightTheme, darkTheme, getThemeColors };
