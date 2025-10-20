'use client';

import type { User as ApiUser } from '@/interfaces/response';
import { api } from '@/lib/api';

import { getFirebaseAuth } from '@/lib/firebase';
import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

type UpdateProfileInput = {
  name?: string | null;
  picture?: string | null;
  phoneNumber?: string | null;
};

type AuthState = {
  user: ApiUser | null;
  ready: boolean; // true = we definitively know if there is a signed-in user
  loading: boolean; // true = currently fetching from API
  error: string | null;

  setUser: (u: ApiUser | null) => void;
  setReady: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  setError: (m: string | null) => void;

  init: () => void; // wait for Firebase auth to hydrate, then refresh() if signed-in
  refresh: () => Promise<void>; // fetch /users/me if signed-in
  updateProfile: (input: UpdateProfileInput) => Promise<ApiUser>;
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

// Helper: wait for Firebase to tell us if there is a current user
function waitForFirebaseAuthResolution(): Promise<boolean> {
  const auth = getFirebaseAuth();
  if (!auth) return Promise.resolve(false); // ← guard when Firebase isn't initialized

  return new Promise((resolve) => {
    const unsub = auth.onAuthStateChanged((u) => {
      unsub();
      resolve(!!u);
    });
  });
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  ready: false,
  loading: false,
  error: null,

  setUser: (u) => set({ user: u }),
  setReady: (v) => set({ ready: v }),
  setLoading: (v) => set({ loading: v }),
  setError: (m) => set({ error: m }),

  clear: () => set({ user: null, loading: false, error: null, ready: true }),

  // Initialize: wait for Firebase session to restore, then fetch profile if signed-in
  init: () => {
    // Avoid double-init
    if (get().ready || get().loading) return;

    (async () => {
      const isSignedIn = await waitForFirebaseAuthResolution();
      if (!isSignedIn) {
        // No Firebase user → we're definitively unauthenticated
        set({ user: null, ready: true, loading: false, error: null });
        return;
      }
      // We have a Firebase user → pull API profile
      await get().refresh();
    })();
  },

  // Fetch current user profile (only if signed-in)
  refresh: async () => {
    const auth = getFirebaseAuth();
    if (!auth) {
      // Firebase not initialized on this client yet
      set({ user: null, ready: true, loading: false, error: null });
      return;
    }

    const fbUser = auth.currentUser;

    if (!fbUser) {
      set({ user: null, ready: true, loading: false, error: null });
      return;
    }

    try {
      set({ loading: true, error: null });
      await fbUser.getIdToken(true); // force fresh token
      const { data } = await api.get<ApiUser>('/users/me');
      set({ user: data, error: null });
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? (extractAxiosMessage(err) ??
          (err.response?.status === 401
            ? 'Session expired. Please sign in again.'
            : (err.message ?? 'Failed to load user profile')))
        : err instanceof Error
          ? err.message
          : 'Failed to load user profile';
      set({ error: msg, user: null });
    } finally {
      set({ loading: false, ready: true });
    }
  },

  // Update profile and keep store in sync
  updateProfile: async (input) => {
    const { data } = await api.patch<ApiUser>('/users/me', input);
    set({ user: data });
    return data;
  },
}));

export const useApiUser = () => useAuthStore((s) => s.user);
export const useAuthReady = () => useAuthStore((s) => s.ready);
export const useAuthLoading = () => useAuthStore((s) => s.loading);
export const useAuthError = () => useAuthStore((s) => s.error);
