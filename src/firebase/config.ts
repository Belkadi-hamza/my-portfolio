import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBdnv1qCfpDFAKCr00h4V-sIs_pagfmMdI",
  authDomain: "deep-ground-465915-u8.firebaseapp.com",
  databaseURL: "https://deep-ground-465915-u8-default-rtdb.firebaseio.com",
  projectId: "deep-ground-465915-u8",
  storageBucket: "deep-ground-465915-u8.firebasestorage.app",
  messagingSenderId: "164078181370",
  appId: "1:164078181370:web:f21c0980cbe49bd22b2243",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;