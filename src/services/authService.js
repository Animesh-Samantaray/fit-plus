import { Platform } from 'react-native';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@/configs/firebase';
import {
  validateEmailDomain,
  getAccessRestrictedMessage,
  verifyUserEmail,
  getAllowedEmailDomain,
} from '@/utils/validateEmailDomain';
import { getUserProfile, createUserProfile } from '@/services/userService';
import { verifyAdminInvitationToken } from '@/services/adminService';

// Lazy import GoogleSignin for native platforms only
let GoogleSignin = null;
if (Platform.OS !== 'web') {
  try {
    const googleModule = require('@react-native-google-signin/google-signin');
    GoogleSignin = googleModule.GoogleSignin;
  } catch {
    GoogleSignin = null;
  }
}

/**
 * Configure native Google Sign In on Android and iOS
 */
export function configureNativeGoogleSignIn() {
  if (Platform.OS !== 'web' && GoogleSignin) {
    try {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
        offlineAccess: false,
      });
    } catch (e) {
      console.warn('Native Google Sign-In configure warning:', e?.message);
    }
  }
}

/**
 * Performs low-level Google Authentication across Web, Android, and iOS.
 * Automatically enforces the configured domain restriction and email verification.
 *
 * @returns {Promise<object>} Authenticated Firebase User
 */
export async function authenticateWithGoogle() {
  let credentialUser = null;

  if (Platform.OS === 'web') {
    // Web Flow: Firebase Popup Auth
    const provider = new GoogleAuthProvider();
    const allowedDomain = getAllowedEmailDomain();
    provider.setCustomParameters({
      prompt: 'select_account',
      hd: allowedDomain,
    });

    try {
      const userCredential = await signInWithPopup(auth, provider);
      credentialUser = userCredential.user;
    } catch (error) {
      if (
        error.code === 'auth/popup-closed-by-user' ||
        error.code === 'auth/cancelled-popup-request'
      ) {
        throw new Error('Sign-in was cancelled.');
      } else if (error.code === 'auth/popup-blocked') {
        throw new Error('Popup blocked by browser. Please allow popups for this site and try again.');
      } else if (error.code === 'auth/unauthorized-domain') {
        throw new Error(
          'This domain is not authorized in Firebase Authentication. Please add it to Authorized Domains in the Firebase Console.'
        );
      }
      throw error;
    }
  } else {
    // Native Mobile Flow (Android & iOS)
    if (!GoogleSignin) {
      throw new Error(
        'Native Google Sign-In requires an Expo Development Build (run with `eas build --profile development` or `npx expo run:android`). Native modules are not supported in Expo Go.'
      );
    }

    try {
      configureNativeGoogleSignIn();
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      const idToken = signInResult.data?.idToken || signInResult.idToken;
      if (!idToken) {
        throw new Error('Failed to retrieve Google ID token from device.');
      }

      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      credentialUser = userCredential.user;
    } catch (error) {
      if (error.code === 'SIGN_IN_CANCELLED' || error.message?.includes('cancelled')) {
        throw new Error('Sign-in was cancelled.');
      } else if (error.code === 'IN_PROGRESS') {
        throw new Error('Sign-in is already in progress.');
      } else if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
        throw new Error('Google Play Services are not available on this device.');
      }
      throw error;
    }
  }

  if (!credentialUser) {
    throw new Error('Authentication failed: No user returned.');
  }

  // --- Strict Email Verification ---
  const emailCheck = verifyUserEmail(credentialUser);
  if (!emailCheck.isVerified) {
    try {
      await firebaseSignOut(auth);
      if (Platform.OS !== 'web' && GoogleSignin) {
        await GoogleSignin.signOut().catch(() => {});
      }
    } catch {}
    throw new Error(emailCheck.error);
  }

  // --- Strict Domain Verification ---
  const domainValidation = validateEmailDomain(credentialUser.email);
  if (!domainValidation.isValid) {
    try {
      await firebaseSignOut(auth);
      if (Platform.OS !== 'web' && GoogleSignin) {
        await GoogleSignin.signOut().catch(() => {});
      }
    } catch {}
    throw new Error(domainValidation.error || getAccessRestrictedMessage());
  }

  return credentialUser;
}

/**
 * Sign In flow for existing users.
 * 1. Authenticates with Google.
 * 2. Validates domain & verified email.
 * 3. Fetches users/{uid} from Firestore.
 * 4. If profile exists, returns user and profile. Does not overwrite role.
 * 5. If profile does not exist, logs out and throws error directing to Sign Up.
 */
export async function signInExistingUser() {
  const user = await authenticateWithGoogle();

  const profile = await getUserProfile(user.uid);

  if (!profile) {
    try {
      await firebaseSignOut(auth);
      if (Platform.OS !== 'web' && GoogleSignin) {
        await GoogleSignin.signOut().catch(() => {});
      }
    } catch {}
    const err = new Error(
      'No registered HB+ account found for this email. Please switch to "Sign Up" to register first.'
    );
    err.code = 'PROFILE_NOT_FOUND';
    throw err;
  }

  return {
    user,
    profile,
    role: profile.role || 'user',
  };
}

/**
 * Sign Up flow for new users.
 * 1. Validates Admin token if admin role requested.
 * 2. Authenticates with Google.
 * 3. Validates domain & verified email.
 * 4. If profile already exists, returns existing profile without duplicate creation.
 * 5. If profile does not exist, creates users/{uid} with exact required schema.
 */
export async function signUpNewUser({ role = 'user', adminToken = '' } = {}) {
  if (role === 'admin') {
    await verifyAdminInvitationToken(adminToken);
  }

  const user = await authenticateWithGoogle();

  let profile = await getUserProfile(user.uid);

  if (!profile) {
    profile = await createUserProfile(user, role);
  }

  return {
    user,
    profile,
    role: profile.role || role || 'user',
  };
}

/**
 * Backward compatibility alias
 */
export async function signInWithGoogle() {
  return signInExistingUser();
}

/**
 * Signs the user out from Firebase and any native Google sessions.
 */
export async function logoutUser() {
  try {
    if (Platform.OS !== 'web' && GoogleSignin) {
      await GoogleSignin.signOut().catch(() => {});
    }
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
