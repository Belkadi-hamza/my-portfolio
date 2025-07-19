import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBdnv1qCfpDFAKCr00h4V-sIs_pagfmMdI",
  authDomain: "deep-ground-465915-u8.firebaseapp.com",
  databaseURL: "https://deep-ground-465915-u8-default-rtdb.firebaseio.com",
  projectId: "deep-ground-465915-u8",
  storageBucket: "deep-ground-465915-u8.firebasestorage.app",
  messagingSenderId: "164078181370",
  appId: "1:164078181370:web:d8608ba9c9462a012b2243",
  measurementId: "G-2JP9XTYTZJ"
};

// Initialize Firebase only if no apps exist (prevents duplicate app error in development)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const database = getDatabase(app);

export { database };
export const userId = "OgyHE2316metkHnjAsjmiiUx4Ck1";