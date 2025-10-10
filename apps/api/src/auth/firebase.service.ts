// apps/api/src/auth/firebase.service.ts
import * as admin from 'firebase-admin';

const emulatorHost =
  process.env.FIREBASE_AUTH_EMULATOR_HOST ||
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST;
if (emulatorHost && !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
  process.env.FIREBASE_AUTH_EMULATOR_HOST = emulatorHost;
}

const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
  'demo-mvpbase';

if (!admin.apps.length) {
  admin.initializeApp({ projectId });
}

export async function verifyIdToken(idToken: string) {
  const decoded = await admin.auth().verifyIdToken(idToken, false); // false: don't check revocation on emulator
  return {
    uid: decoded.uid,
    email: decoded.email ?? null,
    name: decoded.name ?? null,
    picture: decoded.picture ?? null,
    phone_number: (decoded as any).phone_number ?? null,
  };
}
