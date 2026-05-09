/**
 * React Query hooks for authentication.
 *
 * useSessionQuery — verifies the session on app load via GET /me.
 * useSigninMutation — calls POST /signin.
 * useSignupMutation — calls POST /signup.
 * useSignoutMutation — calls POST /signout.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { signin, signup, signout, getMe } from './authApi';
import { useAuthStore } from '../store/authStore';
import type { SigninPayload, SignupPayload } from './authApi';

export const authKeys = {
  session: ['auth', 'session'] as const,
};

/**
 * Verifies the current session on mount.
 * Syncs result into authStore so the rest of the app can read it.
 */
export function useSessionQuery() {
  const { setAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: authKeys.session,
    queryFn:  async () => {
      try {
        const valid = await getMe();
        setAuthenticated(valid);
        return valid;
      } catch {
        setAuthenticated(false);
        return false;
      }
    },
    staleTime:            5 * 60 * 1000, // re-check every 5 min
    refetchOnWindowFocus: true,
    retry:                false,
  });
}

/** Sign in and mark the session as authenticated on success. */
export function useSigninMutation() {
  const { setAuthenticated } = useAuthStore();
  const queryClient          = useQueryClient();

  return useMutation({
    mutationFn: (payload: SigninPayload) => signin(payload),
    onSuccess: () => {
      setAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
  });
}

/** Sign up — does not auto-login; user must sign in after. */
export function useSignupMutation() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => signup(payload),
  });
}

/** Sign out, clear session state, and invalidate all queries. */
export function useSignoutMutation() {
  const { logout }  = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signout,
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
    onError: () => {
      // Even if the server call fails, clear local state
      logout();
      queryClient.clear();
    },
  });
}
