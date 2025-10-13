'use client';

import type { User as ApiUser } from '@/interfaces/response';
import api from '@/lib/api';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

type AuthState = {
  user: ApiUser | null;
  ready: boolean;
  loading: boolean;
  error: string | null;
  setUser: (u: ApiUser | null) => void;
  setReady: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  setError: (m: string | null) => void;
  refresh: () => Promise<void>;
  clear: () => void;
};

function extractAxiosMessage(error: AxiosError): string | null {
  const data = error.response?.data;
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const msg = (data as Record<string, unknown>).message;
    if (typeof msg === 'string') return msg;
  }
  return null;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  ready: false,
  loading: false,
  error: null,
  setUser: (u) => set({ user: u }),
  setReady: (v) => set({ ready: v }),
  setLoading: (v) => set({ loading: v }),
  setError: (m) => set({ error: m }),

  clear: () => set({ user: null, loading: false, error: null, ready: true }),

  refresh: async () => {
    try {
      set({ loading: true, error: null });
      const { data } = await api.get<ApiUser>('/auth/me');
      set({ user: data, loading: false });
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (extractAxiosMessage(err) ??
          (err.response?.status === 401
            ? 'Session expired. Please sign in again.'
            : (err.message ?? 'Failed to load user profile')))
        : err instanceof Error
          ? err.message
          : 'Failed to load user profile';

      set({ error: msg, user: null, loading: false });
    }
  },
}));

export const useApiUser = () => useAuthStore((s) => s.user);
export const useAuthReady = () => useAuthStore((s) => s.ready);
export const useAuthLoading = () => useAuthStore((s) => s.loading);
export const useAuthError = () => useAuthStore((s) => s.error);
