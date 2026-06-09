import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// These should be replaced with actual config values in the .env file
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'mock-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mock-auth-domain',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mock-project-id',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mock-storage-bucket',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'mock-sender-id',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'mock-app-id'
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
