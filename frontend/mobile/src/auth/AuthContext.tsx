// Trang thai dang nhap dung chung cho toan app
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import * as api from "../api/auth";
import type { AuthResponse, UserInfo } from "../api/auth";
import { ApiError, requestJson, type AuthFetch } from "../api/http";
import { getItem, removeItem, setItem, SESSION_KEY } from "./storage";

interface AuthState {
  ready: boolean;              // da doc xong phien dang nhap da luu chua
  user: UserInfo | null;
  authFetch: AuthFetch;        // goi API can dang nhap
  login: (email: string, password: string) => Promise<void>;
  register: (displayName: string, email: string, password: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthResponse | null>(null);
  const [ready, setReady] = useState(false);

  // Ban moi nhat cua phien, de cac ham async luon doc dung token
  const sessionRef = useRef<AuthResponse | null>(null);
  // Neu nhieu request cung het han 1 luc, chi goi refresh 1 lan
  const refreshing = useRef<Promise<AuthResponse | null> | null>(null);

  const keep = useCallback(async (data: AuthResponse | null) => {
    sessionRef.current = data;
    setSession(data);
    if (data) await setItem(SESSION_KEY, JSON.stringify(data));
    else await removeItem(SESSION_KEY);
  }, []);

  // Mo app: doc lai phien da luu. Access token het han cung giu lai,
  // vi refresh token (song 7 ngay) van co the doi lay token moi.
  useEffect(() => {
    getItem(SESSION_KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = JSON.parse(raw) as AuthResponse;
        sessionRef.current = saved;
        setSession(saved);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  // Doi token moi bang refresh token. That bai -> dang xuat
  const refreshSession = useCallback(async () => {
    if (!refreshing.current) {
      refreshing.current = (async () => {
        const current = sessionRef.current;
        if (!current) return null;
        try {
          const fresh = await api.refresh(current.refreshToken);
          await keep(fresh);
          return fresh;
        } catch {
          await keep(null);
          return null;
        } finally {
          refreshing.current = null;
        }
      })();
    }
    return refreshing.current;
  }, [keep]);

  // Goi API kem token. Token het han (sap het han hoac server bao 401) -> tu gia han roi goi lai 1 lan
  const authFetch: AuthFetch = useCallback(
    async <T,>(url: string, options: RequestInit = {}) => {
      let current = sessionRef.current;
      if (!current) throw new ApiError("Please log in again.", 401);

      if (new Date(current.expiresAt).getTime() - Date.now() < 30_000) {
        current = await refreshSession();
        if (!current) throw new ApiError("Your session has expired. Please log in again.", 401);
      }

      const send = (token: string) =>
        requestJson<T>(url, { ...options, headers: { ...options.headers, Authorization: `Bearer ${token}` } });

      try {
        return await send(current.accessToken);
      } catch (e) {
        if (!(e instanceof ApiError) || e.status !== 401) throw e;
        const fresh = await refreshSession();
        if (!fresh) throw new ApiError("Your session has expired. Please log in again.", 401);
        return send(fresh.accessToken);
      }
    },
    [refreshSession],
  );

  const value: AuthState = {
    ready,
    user: session?.user ?? null,
    authFetch,
    async login(email, password) {
      await keep(await api.login(email, password));
    },
    async register(displayName, email, password) {
      await keep(await api.register(displayName, email, password));
    },
    async changePassword(currentPassword, newPassword) {
      await keep(await api.changePassword(authFetch, currentPassword, newPassword));
    },
    async resetPassword(email, code, newPassword) {
      await keep(await api.resetPassword(email, code, newPassword));
    },
    async logout() {
      const current = sessionRef.current;
      // Xoa phien tren may TRUOC de man hinh ve Login ngay lap tuc...
      await keep(null);
      // ...roi moi bao server thu hoi refresh token, khong bat nguoi dung cho.
      // Mang cham hay server tat thi van dang xuat binh thuong.
      if (current) api.logout(current.refreshToken).catch(() => {});
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
