import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { Appearance, ColorSchemeName } from 'react-native';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeState {
  themeMode: ThemeMode;
  effectiveTheme: ColorSchemeName;
  isLoading: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  restoreTheme: () => Promise<void>;
  getEffectiveTheme: () => ColorSchemeName;
}

const THEME_KEY = 'app_theme_mode';

const getSystemTheme = (): ColorSchemeName => {
  return Appearance.getColorScheme() || 'light';
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: 'system',
  effectiveTheme: getSystemTheme(),
  isLoading: true,

  setThemeMode: async (mode: ThemeMode) => {
    try {
      await SecureStore.setItemAsync(THEME_KEY, mode);
      const effectiveTheme = mode === 'system' ? getSystemTheme() : mode;
      set({ themeMode: mode, effectiveTheme });
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  },

  restoreTheme: async () => {
    try {
      const storedMode = await SecureStore.getItemAsync(THEME_KEY);
      if (storedMode && ['system', 'light', 'dark'].includes(storedMode)) {
        const mode = storedMode as ThemeMode;
        const effectiveTheme = mode === 'system' ? getSystemTheme() : mode;
        set({ themeMode: mode, effectiveTheme, isLoading: false });
      } else {
        set({ themeMode: 'system', effectiveTheme: getSystemTheme(), isLoading: false });
      }
    } catch (error) {
      console.error('Error restoring theme:', error);
      set({ isLoading: false });
    }
  },

  getEffectiveTheme: () => {
    const { themeMode } = get();
    return themeMode === 'system' ? getSystemTheme() : themeMode;
  },
}));

// Theme colors (using existing app colors)
export const lightTheme = {
  background: '#f0fdf4',
  card: '#ffffff',
  text: '#111827',
  textSecondary: '#6b7280',
  primary: '#10b981',
  primaryLight: '#ecfdf5',
  border: '#e5e7eb',
  error: '#ef4444',
  success: '#10b981',
};

export const darkTheme = {
  background: '#111827',
  card: '#1f2937',
  text: '#f9fafb',
  textSecondary: '#9ca3af',
  primary: '#10b981',
  primaryLight: '#064e3b',
  border: '#374151',
  error: '#ef4444',
  success: '#10b981',
};

export const getThemeColors = (theme: ColorSchemeName) => {
  return theme === 'dark' ? darkTheme : lightTheme;
};
