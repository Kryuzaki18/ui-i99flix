import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean | null;
  isCheckingAuth:  boolean;

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
