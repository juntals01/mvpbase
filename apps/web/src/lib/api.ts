// apps/web/lib/api.ts
import axios from 'axios';
import { getAuth, onIdTokenChanged, signOut } from 'firebase/auth';
import { app } from './firebase';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

// Keep a cached token that updates when Firebase refreshes it
let currentToken: string | null = null;
if (typeof window !== 'undefined') {
  const auth = getAuth(app);
  onIdTokenChanged(auth, async (user) => {
    if (user) {
      try {
        currentToken = await user.getIdToken(); // refreshes automatically on change
      } catch {
        currentToken = null;
      }
    } else {
      currentToken = null;
    }
  });
}

// Attach token to every request
api.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') return config; // SSR safety
  const auth = getAuth(app);

  // If we don't have a cached token yet but a user exists, fetch a fresh one
  if (!currentToken && auth.currentUser) {
    currentToken = await auth.currentUser.getIdToken(true);
  }

  config.headers = config.headers ?? {};
  if (currentToken) {
    (config.headers as any).Authorization = `Bearer ${currentToken}`;
  }
  return config;
});

// Handle invalid/expired token -> sign out & redirect to /login
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error?.response?.status === 401 && typeof window !== 'undefined') {
      try {
        const auth = getAuth(app);
        await signOut(auth);
      } finally {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
