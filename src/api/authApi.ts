import { apiGet, apiPost } from '../services/internalApiClient';

export interface SigninPayload {
  email:      string;
  password:   string;
  rememberMe?: boolean;
}

export interface SignupPayload {
  name:     string;
  email:    string;
  password: string;
}

export async function signin(payload: SigninPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>('/signin', {
    email:      payload.email.toLowerCase().trim(),
    password:   payload.password,
    rememberMe: payload.rememberMe ?? false,
  });
}

export async function signup(payload: SignupPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>('/signup', {
    name:     payload.name.trim(),
    email:    payload.email.toLowerCase().trim(),
    password: payload.password,
  });
}

export async function signout(): Promise<{ message: string }> {
  return apiPost<{ message: string }>('/signout', {});
}

export async function getMe(): Promise<boolean> {
  return apiGet<boolean>('/me');
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token:    string;
  password: string;
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>('/forgot-password', {
    email: payload.email.toLowerCase().trim(),
  });
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>('/reset-password', {
    token:    payload.token,
    password: payload.password,
  });
}
