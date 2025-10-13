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

  const token = await user.getIdToken();

  // Normalize to AxiosHeaders, then set Authorization
  const headers =
    config.headers instanceof AxiosHeaders
      ? config.headers
      : new AxiosHeaders(config.headers);

  headers.set('Authorization', `Bearer ${token}`);
  config.headers = headers;

  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
