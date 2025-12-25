import { create } from 'zustand';
import { User } from '@/types';
import * as SecureStore from 'expo-secure-store';
import { supabaseAuthService } from '@/services/supabase/authService';
import { supabase } from '@/services/supabase/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  restoreSession: () => Promise<void>;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true to check session
  token: null,

  setUser: async (user) => {
    set({
      user,
      isAuthenticated: !!user,
    });
    // Also store user in SecureStore for persistence
    if (user) {
      try {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
      } catch (error) {
        console.error('Error storing user:', error);
      }
    } else {
      try {
        await SecureStore.deleteItemAsync(USER_KEY);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  },

  setToken: async (token) => {
    if (token) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
    set({ token });
  },

  logout: async () => {
    // Sign out from Supabase
    await supabaseAuthService.logout();
    
    // Clear SecureStore
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    
    set({
      user: null,
      isAuthenticated: false,
      token: null,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),

  restoreSession: async () => {
    try {
      set({ isLoading: true });

      // Check Supabase session first (primary source of truth)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (session && !sessionError) {
        // Session exists, get user profile
        const userResponse = await supabaseAuthService.getCurrentUser();
        
        if (userResponse.success && userResponse.data) {
          set({
            user: userResponse.data,
            isAuthenticated: true,
            token: session.access_token,
            isLoading: false,
          });
          return;
        }
      }

      // Fallback: Try to restore from SecureStore
      const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      const storedUser = await SecureStore.getItemAsync(USER_KEY);

      if (storedToken && storedUser) {
        try {
          const user = JSON.parse(storedUser);
          // Verify token is still valid by checking Supabase session
          const { data: { session: verifySession } } = await supabase.auth.getSession();
          
          if (verifySession && verifySession.access_token === storedToken) {
            set({
              user,
              isAuthenticated: true,
              token: storedToken,
              isLoading: false,
            });
            return;
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
        }
      }

      // No valid session found
      set({
        user: null,
        isAuthenticated: false,
        token: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error restoring session:', error);
      set({
        user: null,
        isAuthenticated: false,
        token: null,
        isLoading: false,
      });
    }
  },
}));
