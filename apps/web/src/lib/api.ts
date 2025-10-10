// apps/web/lib/api.ts
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { app } from './firebase';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

api.interceptors.request.use(async (config) => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  config.headers = config.headers ?? {};
  if (user) {
    const token = await user.getIdToken(true); // force refresh to avoid stale tokens
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});
