/**
 * Theme-aware style utilities
 * Provides consistent colors for dark and light mode across the app
 */

export interface ThemedColors {
  // Backgrounds
  background: string;
  backgroundSecondary: string;
  card: string;
  cardElevated: string;
  
  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  
  // Primary (brand)
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Borders
  border: string;
  borderLight: string;
  
  // Input
  inputBackground: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  
  // Status
  error: string;
  errorBackground: string;
  success: string;
  successBackground: string;
  warning: string;
  warningBackground: string;
  
  // Modal
  modalOverlay: string;
  modalBackground: string;
}

export const lightColors: ThemedColors = {
  // Backgrounds
  background: '#ffffff',
  backgroundSecondary: '#f0fdf4',
  card: '#ffffff',
  cardElevated: '#ffffff',
  
  // Text
  text: '#111827',
  textSecondary: '#6b7280',
  textMuted: '#9ca3af',
  textInverse: '#ffffff',
  
  // Primary (brand)
  primary: '#10b981',
  primaryLight: '#ecfdf5',
  primaryDark: '#059669',
  
  // Borders
  border: '#e5e7eb',
  borderLight: '#f3f4f6',
  
  // Input
  inputBackground: '#ffffff',
  inputBorder: '#d1d5db',
  inputText: '#111827',
  inputPlaceholder: '#9ca3af',
  
  // Status
  error: '#ef4444',
  errorBackground: '#fef2f2',
  success: '#10b981',
  successBackground: '#ecfdf5',
  warning: '#f59e0b',
  warningBackground: '#fef3c7',
  
  // Modal
  modalOverlay: 'rgba(0, 0, 0, 0.5)',
  modalBackground: '#ffffff',
};

export const darkColors: ThemedColors = {
  // Backgrounds
  background: '#111827',
  backgroundSecondary: '#1f2937',
  card: '#1f2937',
  cardElevated: '#374151',
  
  // Text
  text: '#f9fafb',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  textInverse: '#111827',
  
  // Primary (brand)
  primary: '#10b981',
  primaryLight: '#064e3b',
  primaryDark: '#34d399',
  
  // Borders
  border: '#374151',
  borderLight: '#4b5563',
  
  // Input
  inputBackground: '#1f2937',
  inputBorder: '#4b5563',
  inputText: '#f9fafb',
  inputPlaceholder: '#6b7280',
  
  // Status
  error: '#f87171',
  errorBackground: '#450a0a',
  success: '#34d399',
  successBackground: '#064e3b',
  warning: '#fbbf24',
  warningBackground: '#451a03',
  
  // Modal
  modalOverlay: 'rgba(0, 0, 0, 0.7)',
  modalBackground: '#1f2937',
};

export const getThemedColors = (isDark: boolean): ThemedColors => {
  return isDark ? darkColors : lightColors;
};
