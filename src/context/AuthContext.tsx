import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signInAnonymously,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type User,
  type ConfirmationResult
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextValue {
  currentUser: User | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  setupRecaptcha: (containerId: string) => void;
  sendPhoneCode: (phoneNumber: string) => Promise<ConfirmationResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function getFirebaseErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try logging in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Try signing up.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method.';
    case 'auth/invalid-phone-number':
      return 'Please enter a valid phone number with country code (e.g. +91...).';
    case 'auth/invalid-verification-code':
      return 'Invalid verification code. Please check and try again.';
    case 'auth/code-expired':
      return 'Verification code expired. Please request a new one.';
    default:
      return 'Authentication failed. Please try again.';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signInWithEmail(email: string, pass: string) {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      throw new Error(getFirebaseErrorMessage(err.code));
    }
  }

  async function signUpWithEmail(email: string, pass: string) {
    try {
      await createUserWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      throw new Error(getFirebaseErrorMessage(err.code));
    }
  }

  async function handleGoogleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      throw new Error(getFirebaseErrorMessage(err.code));
    }
  }

  async function handleFacebookSignIn() {
    try {
      const provider = new FacebookAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      throw new Error(getFirebaseErrorMessage(err.code));
    }
  }

  async function handleAppleSignIn() {
    try {
      const provider = new OAuthProvider('apple.com');
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      throw new Error(getFirebaseErrorMessage(err.code));
    }
  }

  const setupRecaptcha = useCallback((containerId: string) => {
    try {
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
          size: 'invisible',
        });
      }
    } catch (err) {
      console.error('Recaptcha setup failed:', err);
    }
  }, []);

  async function sendPhoneCode(phoneNumber: string): Promise<ConfirmationResult> {
    const appVerifier = (window as any).recaptchaVerifier;
    if (!appVerifier) throw new Error('Recaptcha not initialized. Please reload the page.');
    try {
      return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    } catch (err: any) {
      throw new Error(getFirebaseErrorMessage(err.code));
    }
  }

  async function logout() {
    await firebaseSignOut(auth);
  }

  async function handleGuestSignIn() {
    try {
      await signInAnonymously(auth);
    } catch (err: any) {
      throw new Error('Failed to start demo session. Please try again.');
    }
  }

  const value: AuthContextValue = {
    currentUser,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle: handleGoogleSignIn,
    signInWithFacebook: handleFacebookSignIn,
    signInWithApple: handleAppleSignIn,
    signInAsGuest: handleGuestSignIn,
    setupRecaptcha,
    sendPhoneCode,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
