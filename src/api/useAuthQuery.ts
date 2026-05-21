import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { signin, signup, signout, socialSignin, getMe, forgotPassword, resetPassword, verifyEmail } from './authApi';
import { useAuthStore } from '../store/authStore';
import type { SigninPayload, SignupPayload, ForgotPasswordPayload, ResetPasswordPayload, SocialSigninPayload } from './authApi';

export const authKeys = {
  session: ['auth', 'session'] as const,
};

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
    staleTime:            5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry:                2,
    retryDelay:           (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}

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

export function useSignupMutation() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => signup(payload),
  });
}

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
      logout();
      queryClient.clear();
    },
  });
}

export function useSocialSigninMutation() {
  const { setAuthenticated } = useAuthStore();
  const queryClient          = useQueryClient();

  return useMutation({
    mutationFn: (payload: SocialSigninPayload) => socialSignin(payload),
    onSuccess: () => {
      setAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: authKeys.session });
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => forgotPassword(payload),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => resetPassword(payload),
  });
}

export function useVerifyEmailMutation() {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  });
}
