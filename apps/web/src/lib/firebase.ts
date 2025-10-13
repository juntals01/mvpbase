// apps/web/src/lib/firebase.ts
'use client';

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  type Auth,
} from 'firebase/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  type Firestore,
} from 'firebase/firestore';

let _app: FirebaseApp | null = null;
let _auth: Auth | null = null;
let _db: Firestore | null = null;
let _google: GoogleAuthProvider | null = null;

// 🔧 Relax validation: in development w/ emulator, accept any non-empty values
function getConfig() {
  if (typeof window === 'undefined') return null;

  const usingEmulator =
    process.env.NODE_ENV === 'development' &&
    !!process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;

  const apiKey =
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    (usingEmulator ? 'demo-key' : undefined);
  const authDomain =
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    (usingEmulator ? 'localhost' : undefined);
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    (usingEmulator ? 'demo-mvpbase' : undefined);
  const appId =
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    (usingEmulator ? 'demo-app-id' : undefined);

  if (!apiKey || !authDomain || !projectId || !appId) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[firebase] Missing NEXT_PUBLIC_FIREBASE_* vars. Provide real web config OR rely on emulator fallbacks.'
      );
    }
    return null;
  }

  return { apiKey, authDomain, projectId, appId };
}

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;
  if (_app) return _app;

  const cfg = getConfig();
  if (!cfg) return null;

  try {
    _app = getApps().length ? getApp() : initializeApp(cfg);
  } catch (e) {
    console.warn('[firebase] initializeApp failed:', e);
    _app = null;
  }
  return _app;
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === 'undefined') return null;
  if (_auth) return _auth;

  const app = getFirebaseApp();
  if (!app) return null;

  try {
    _auth = getAuth(app);
    const host = process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
    if (host && process.env.NODE_ENV === 'development') {
      try {
        connectAuthEmulator(_auth, `http://${host}`, { disableWarnings: true });
      } catch {
        /* ignore double-connect in HMR */
      }
    }
  } catch (e) {
    console.warn('[firebase] getAuth failed:', e);
    _auth = null;
  }
  return _auth;
}

export function getFirestoreDb(): Firestore | null {
  if (typeof window === 'undefined') return null;
  if (_db) return _db;

  const app = getFirebaseApp();
  if (!app) return null;

  try {
    _db = getFirestore(app);
    const fsHost = process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST;
    if (fsHost && process.env.NODE_ENV === 'development') {
      const [host, portStr] = fsHost.split(':');
      const port = Number(portStr || 8080);
      try {
        connectFirestoreEmulator(_db, host || 'localhost', port);
      } catch {
        /* ignore double-connect in HMR */
      }
    }
  } catch (e) {
    console.warn('[firebase] getFirestore failed:', e);
    _db = null;
  }
  return _db;
}

export function getGoogleProvider(): GoogleAuthProvider | null {
  if (typeof window === 'undefined') return null;
  if (_google) return _google;
  _google = new GoogleAuthProvider();
  return _google;
}
