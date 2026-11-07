// Goi cac API cua Identity service (services/identity)
import { API_URL } from "./config";
import { requestJson, type AuthFetch } from "./http";

export type Role = "User" | "Expert" | "Admin";

export interface UserInfo {
  id: string;
  email: string;
  displayName: string;
  role: Role;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: UserInfo;
}

export function login(email: string, password: string) {
  return requestJson<AuthResponse>(`${API_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function register(displayName: string, email: string, password: string) {
  return requestJson<AuthResponse>(`${API_URL}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify({ displayName, email, password }),
  });
}

// Dung refresh token de lay cap token moi khi access token het han
export function refresh(refreshToken: string) {
  return requestJson<AuthResponse>(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export function logout(refreshToken: string) {
  return requestJson<void>(`${API_URL}/api/auth/logout`, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

// Quen mat khau buoc 1: xin ma 6 so gui qua email
export function forgotPassword(email: string) {
  return requestJson<{ message: string }>(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// Quen mat khau buoc 2: nhap ma + mat khau moi. Dung ma -> server tra ve token (dang nhap luon)
export function resetPassword(email: string, code: string, newPassword: string) {
  return requestJson<AuthResponse>(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    body: JSON.stringify({ email, code, newPassword }),
  });
}

// Doi mat khau (can dang nhap). Server tra ve cap token moi, cac may khac bi dang xuat
export function changePassword(authFetch: AuthFetch, currentPassword: string, newPassword: string) {
  return authFetch<AuthResponse>(`${API_URL}/api/auth/password`, {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
