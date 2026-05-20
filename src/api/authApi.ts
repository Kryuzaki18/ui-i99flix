import { apiGet, apiPost } from '../services/internalApiClient';
import { API_ROUTES } from './environments';

export interface SigninPayload {
  email:       string;
  password:    string;
  rememberMe?: boolean;
}

export interface SignupPayload {
  name:     string;
  email:    string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token:    string;
  password: string;
}

export async function signin(payload: SigninPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>(API_ROUTES.AUTH.SIGNIN, {
    email:      payload.email.toLowerCase().trim(),
    password:   payload.password,
    rememberMe: payload.rememberMe ?? false,
  });
}

export async function signup(payload: SignupPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>(API_ROUTES.AUTH.SIGNUP, {
    name:     payload.name.trim(),
    email:    payload.email.toLowerCase().trim(),
    password: payload.password,
  });
}

export async function signout(): Promise<{ message: string }> {
  return apiPost<{ message: string }>(API_ROUTES.AUTH.SIGNOUT, {});
}

export async function getMe(): Promise<boolean> {
  return apiGet<boolean>(API_ROUTES.AUTH.ME);
}

export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>(API_ROUTES.AUTH.FORGOT_PASSWORD, {
    email: payload.email.toLowerCase().trim(),
  });
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>(API_ROUTES.AUTH.RESET_PASSWORD, {
    token:    payload.token,
    password: payload.password,
  });
}

export async function verifyEmail(token: string): Promise<{ message: string }> {
  return apiGet<{ message: string }>(`${API_ROUTES.AUTH.VERIFY_EMAIL}?token=${encodeURIComponent(token)}`);
}
