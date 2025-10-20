// apps/web/src/lib/api.ts
import axios, { AxiosHeaders } from 'axios';
import { getFirebaseAuth } from './firebase';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

api.interceptors.request.use(async (config) => {
  if (typeof window === 'undefined') return config;

  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!user) return config;

  // Force refresh to avoid stale token 401s
  const token = await user.getIdToken(true);

  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

  headers.set('Authorization', `Bearer ${token}`);
  config.headers = headers;

  return config;
});
