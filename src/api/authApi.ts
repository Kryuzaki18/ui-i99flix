/**
 * Auth API — calls the i99flix backend auth endpoints.
 *
 * All auth state is managed via httpOnly cookies set by the server.
 * No tokens are stored in JS.
 */

import { apiGet, apiPost } from '../services/internalApiClient';

export interface SigninPayload {
  email:    string;
  password: string;
}

export interface SignupPayload {
  name:     string;
  email:    string;
  password: string;
}

/** POST /api/v1/signin — returns a session cookie on success */
export async function signin(payload: SigninPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>('/signin', {
    email:      payload.email.toLowerCase().trim(),
    password:   payload.password,
  });
}

/** POST /api/v1/signup — creates a new account */
export async function signup(payload: SignupPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>('/signup', {
    name:     payload.name.trim(),
    email:    payload.email.toLowerCase().trim(),
    password: payload.password,
  });
}

/** POST /api/v1/signout — clears the session cookie */
export async function signout(): Promise<{ message: string }> {
  return apiPost<{ message: string }>('/signout', {});
}

/** GET /api/v1/me — returns true if the session is valid */
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

/** POST /api/v1/forgot-password — requests a password reset link */
export async function forgotPassword(payload: ForgotPasswordPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>('/forgot-password', {
    email: payload.email.toLowerCase().trim(),
  });
}

/** POST /api/v1/reset-password — resets the password using a token */
export async function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  return apiPost<{ message: string }>('/reset-password', {
    token:    payload.token,
    password: payload.password,
  });
}
