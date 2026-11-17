import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/configs/firebase';
import {
  signInExistingUser,
  signUpNewUser,
  logoutUser,
} from '@/services/authService';
import { getUserProfile } from '@/services/userService';
import {
  validateEmailDomain,
  getAccessRestrictedMessage,
  verifyUserEmail,
} from '@/utils/validateEmailDomain';

const AuthContext = createContext({
  user: null,
  profile: null,
  role: null,
  isLoading: true,
  isActionLoading: false,
  authError: null,
  signIn: async () => {},
  signUp: async () => {},
  login: async () => {}, // Alias for signIn
  logout: async () => {},
  refreshProfile: async () => {},
  clearError: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setProfile(null);
          setRole(null);
          setIsLoading(false);
          return;
        }

        // Email verification guard
        const emailCheck = verifyUserEmail(firebaseUser);
        if (!emailCheck.isVerified) {
          setAuthError(emailCheck.error);
          await logoutUser();
          setUser(null);
          setProfile(null);
          setRole(null);
          setIsLoading(false);
          return;
        }

        // Domain verification guard
        const domainCheck = validateEmailDomain(firebaseUser.email);
        if (!domainCheck.isValid) {
          setAuthError(domainCheck.error || getAccessRestrictedMessage());
          await logoutUser();
          setUser(null);
          setProfile(null);
          setRole(null);
          setIsLoading(false);
          return;
        }

        // Check if Firestore profile exists, or auto-provision if missing
        let userDoc = await getUserProfile(firebaseUser.uid);
        if (!userDoc) {
          try {
            userDoc = await createUserProfile(firebaseUser, 'user');
          } catch (e) {
            console.warn('Auto-provisioning profile notice:', e.message);
          }
        }

        if (userDoc) {
          setUser(firebaseUser);
          setProfile(userDoc);
          setRole(userDoc.role || 'user');
          setAuthError(null);
        } else {
          setUser(firebaseUser);
          setProfile(null);
          setRole(null);
        }
      } catch (err) {
        if (!err.message?.includes('permission')) {
          console.warn('Auth state notice:', err.message);
          setAuthError(err.message || 'Authentication error.');
        }
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Existing user Sign In flow
   */
  const signIn = async () => {
    setIsActionLoading(true);
    setAuthError(null);
    try {
      const result = await signInExistingUser();
      setUser(result.user);
      setProfile(result.profile);
      setRole(result.role);
      return result;
    } catch (err) {
      setAuthError(err.message || 'Failed to sign in.');
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * New user Sign Up flow
   */
  const signUp = async ({ role = 'user', adminToken = '' } = {}) => {
    setIsActionLoading(true);
    setAuthError(null);
    try {
      const result = await signUpNewUser({ role, adminToken });
      setUser(result.user);
      setProfile(result.profile);
      setRole(result.role);
      return result;
    } catch (err) {
      setAuthError(err.message || 'Failed to register account.');
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  /**
   * Sign out
   */
  const logout = async () => {
    setIsActionLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setProfile(null);
      setRole(null);
      setAuthError(null);
    } catch (err) {
      setAuthError(err.message || 'Failed to logout.');
      throw err;
    } finally {
      setIsActionLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (!user?.uid) return null;
    try {
      const updated = await getUserProfile(user.uid);
      if (updated) {
        setProfile(updated);
        setRole(updated.role || 'user');
      }
      return updated;
    } catch (e) {
      console.warn('Failed to refresh profile:', e);
      return null;
    }
  };

  const clearError = () => setAuthError(null);

  const value = {
    user,
    profile,
    role,
    isLoading,
    isActionLoading,
    authError,
    signIn,
    signUp,
    login: signIn, // Backward compatibility alias
    logout,
    refreshProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
