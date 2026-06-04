
export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  social: string[];
  hasPassword: boolean;
}

export interface SigninPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface SocialSigninPayload {
  idToken: string;
  rememberMe?: boolean;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword?: string;
  newPassword: string;
}