import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sync user profile to Firestore whenever auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (!userDoc.exists()) {
            await setDoc(userDocRef, {
              uid: currentUser.uid,
              email: currentUser.email || '',
              displayName: currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
              createdAt: serverTimestamp(),
              lastLoginAt: serverTimestamp(),
            });
          } else {
            await setDoc(
              userDocRef,
              {
                lastLoginAt: serverTimestamp(),
                displayName: currentUser.displayName || userDoc.data()?.displayName || '',
                photoURL: currentUser.photoURL || userDoc.data()?.photoURL || '',
              },
              { merge: true }
            );
          }
        } catch (e) {
          console.warn('Firestore user profile sync note:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const formatAuthError = (err: any, fallback: string) => {
    if (err?.code === 'auth/unauthorized-domain') {
      return 'Unauthorized Domain: Please add your domain (e.g. resume-builder-nu-dun.vercel.app or vercel.app) to Firebase Console > Authentication > Settings > Authorized domains.';
    }
    if (err?.code === 'auth/popup-blocked') {
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.';
    }
    if (err?.code === 'auth/network-request-failed') {
      return 'Network error: Please check your internet connection.';
    }
    return err?.message || fallback;
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      if (err?.code === 'auth/popup-closed-by-user') {
        // User closed popup, don't show error
        return;
      }
      const msg = formatAuthError(err, 'Failed to sign in with Google');
      setError(msg);
      throw new Error(msg);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (err: any) {
      console.error('Email Sign In Error:', err);
      let msg = 'Failed to sign in. Please check your email and password.';
      if (err?.code === 'auth/unauthorized-domain') {
        msg = 'Unauthorized Domain: Add this domain to Firebase Console > Authentication > Settings > Authorized domains.';
      } else if (err?.code === 'auth/user-not-found' || err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err?.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      } else if (err?.code === 'auth/too-many-requests') {
        msg = 'Too many attempts. Please try again later or reset your password.';
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name && cred.user) {
        await updateProfile(cred.user, { displayName: name.trim() });
      }
    } catch (err: any) {
      console.error('Sign Up Error:', err);
      let msg = 'Failed to create account.';
      if (err?.code === 'auth/unauthorized-domain') {
        msg = 'Unauthorized Domain: Add this domain to Firebase Console > Authentication > Settings > Authorized domains.';
      } else if (err?.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please log in.';
      } else if (err?.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err?.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (err: any) {
      console.error('Password Reset Error:', err);
      let msg = 'Failed to send password reset email.';
      if (err?.code === 'auth/unauthorized-domain') {
        msg = 'Unauthorized Domain: Add this domain to Firebase Console > Authentication > Settings > Authorized domains.';
      } else if (err?.code === 'auth/user-not-found') {
        msg = 'No user found with this email address.';
      } else if (err?.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Logout Error:', err);
      setError('Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
