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

function getConfig() {
  if (typeof window === 'undefined') return null;

  const isDev = process.env.NODE_ENV === 'development';
  const usingEmulator = isDev;

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
    console.warn('[firebase] Missing web config; cannot init Firebase.');
    return null;
  }
  return { apiKey, authDomain, projectId, appId };
}

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === 'undefined') return null;
  if (_app) return _app;

  const cfg = getConfig();
  if (!cfg) return null;

  _app = getApps().length ? getApp() : initializeApp(cfg);
  return _app;
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === 'undefined') return null;
  if (_auth) return _auth;

  const app = getFirebaseApp();
  if (!app) return null;

  _auth = getAuth(app);

  const host =
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';
  if (process.env.NODE_ENV === 'development' && host) {
    try {
      connectAuthEmulator(_auth, `http://${host}`, { disableWarnings: true });
    } catch {
      /* ignore double-connect in HMR */
    }
  }
  return _auth;
}

export function getFirestoreDb(): Firestore | null {
  if (typeof window === 'undefined') return null;
  if (_db) return _db;

  const app = getFirebaseApp();
  if (!app) return null;

  _db = getFirestore(app);

  const fsHost =
    process.env.NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST ||
    'localhost:8080';
  if (process.env.NODE_ENV === 'development' && fsHost) {
    const [host, portStr] = fsHost.split(':');
    const port = Number(portStr || 8080);
    try {
      connectFirestoreEmulator(_db, host || 'localhost', port);
    } catch {
      /* ignore double-connect in HMR */
    }
  }

  return _db;
}

export function getGoogleProvider(): GoogleAuthProvider | null {
  if (typeof window === 'undefined') return null;
  if (_google) return _google;
  _google = new GoogleAuthProvider();
  return _google;
}
