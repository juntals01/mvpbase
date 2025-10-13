// apps/web/src/lib/errors.ts
import axios, { AxiosError } from 'axios';

function extractAxiosMessage(error: AxiosError): string | null {
  const data = error.response?.data;
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const msg = (data as Record<string, unknown>).message;
    if (typeof msg === 'string') return msg;
  }
  return null;
}

export function getErrorMessage(
  err: unknown,
  fallback = 'Something went wrong'
): string {
  if (axios.isAxiosError(err)) {
    const found = extractAxiosMessage(err);
    return found ?? err.message ?? fallback;
  }
  if (err instanceof Error) return err.message || fallback;
  return fallback;
}
