import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { UserProfile } from "../models/authModel";

interface AuthState {
  isAuthenticated: boolean | null;
  isCheckingAuth: boolean;
  user: UserProfile | null;

  setAuthenticated: (value: boolean, user?: UserProfile | null) => void;
  setCheckingAuth: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: null,
      isCheckingAuth: true,
      user: null,

      setAuthenticated: (value, user = null) =>
        set(
          {
            isAuthenticated: value,
            isCheckingAuth: false,
            user: value ? user : null,
          },
          false,
          "auth/setAuthenticated",
        ),

      setCheckingAuth: (value) =>
        set({ isCheckingAuth: value }, false, "auth/setCheckingAuth"),

      logout: () =>
        set(
          { isAuthenticated: false, isCheckingAuth: false, user: null },
          false,
          "auth/logout",
        ),
    }),
    { name: "AuthStore" },
  ),
);
