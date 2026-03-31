import { apiRequest, saveTokens, clearTokens, BASE_URL } from './client';
import type { AuthResponse, User } from './types';

export async function sendVerificationCode(
  target: string,
  type: 'EMAIL' | 'PHONE',
  purpose: 'REGISTER' | 'RESET_PASSWORD'
): Promise<void> {
  await apiRequest('/auth/send-verification-code', {
    method: 'POST',
    body: JSON.stringify({ target, type, purpose }),
    skipAuth: true,
  });
}

export async function register(payload: {
  name: string;
  email?: string | null;
  phone?: string | null;
  password: string;
  verificationCode: string;
}): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    skipAuth: true,
  });
  saveTokens(res.data.accessToken, res.data.refreshToken);
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(res.data.user));
  }
  return res.data;
}

export async function login(account: string, password: string): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ account, password }),
    skipAuth: true,
  });
  saveTokens(res.data.accessToken, res.data.refreshToken);
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(res.data.user));
  }
  return res.data;
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } finally {
    clearTokens();
  }
}

export async function forgotPassword(account: string): Promise<void> {
  await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ account }),
    skipAuth: true,
  });
}

export async function resetPassword(
  account: string,
  verificationCode: string,
  newPassword: string
): Promise<void> {
  await apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ account, verificationCode, newPassword }),
    skipAuth: true,
  });
}

export async function getMe(): Promise<User> {
  const res = await apiRequest<User>('/users/me');
  return res.data;
}

export async function updateMe(payload: { name?: string; avatarUrl?: string }): Promise<User> {
  const res = await apiRequest<User>('/users/me', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return res.data;
}

export const GOOGLE_OAUTH_URL = `${BASE_URL}/auth/oauth2/google`;
