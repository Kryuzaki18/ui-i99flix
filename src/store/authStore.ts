/**
 * Auth store — tracks whether the current user is authenticated.
 *
 * The actual session is managed by an httpOnly cookie on the server.
 * This store only holds the client-side reflection of that state.
 *
 * NOT persisted — session validity is verified via /me on app load.
 * Storing auth state in localStorage would be misleading since the
 * cookie could be expired or cleared independently.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  /** null = unknown (initial), true = authenticated, false = not authenticated */
  isAuthenticated: boolean | null;
  isCheckingAuth:  boolean;

  // Actions
  setAuthenticated: (value: boolean) => void;
  setCheckingAuth:  (value: boolean) => void;
  logout:           () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: null,
      isCheckingAuth:  true,

      setAuthenticated: (value) =>
        set({ isAuthenticated: value, isCheckingAuth: false }, false, 'auth/setAuthenticated'),

      setCheckingAuth: (value) =>
        set({ isCheckingAuth: value }, false, 'auth/setCheckingAuth'),

      logout: () =>
        set({ isAuthenticated: false, isCheckingAuth: false }, false, 'auth/logout'),
    }),
    { name: 'AuthStore' },
  ),
);
