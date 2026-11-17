import {
  GoogleAuthProvider,
  signInWithPopup,
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

/**
 * Configure native Google Sign In - no-op on web
 */
export function configureNativeGoogleSignIn() {
  // No-op on Web
}

/**
 * Low-level Google Authentication Popup on Web.
 * Enforces email verification and domain restrictions.
 *
 * @returns {Promise<object>} Authenticated Firebase User
 */
export async function authenticateWithGoogle() {
  const provider = new GoogleAuthProvider();
  const allowedDomain = getAllowedEmailDomain();
  provider.setCustomParameters({
    prompt: 'select_account',
    hd: allowedDomain,
  });

  let credentialUser = null;

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

  if (!credentialUser) {
    throw new Error('Authentication failed: No user returned.');
  }

  // --- Strict Email Verification ---
  const emailCheck = verifyUserEmail(credentialUser);
  if (!emailCheck.isVerified) {
    try {
      await firebaseSignOut(auth);
    } catch {}
    throw new Error(emailCheck.error);
  }

  // --- Strict Domain Verification ---
  const domainValidation = validateEmailDomain(credentialUser.email);
  if (!domainValidation.isValid) {
    try {
      await firebaseSignOut(auth);
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
 *
 * @returns {Promise<{ user: object, profile: object, role: string }>}
 */
export async function signInExistingUser() {
  const user = await authenticateWithGoogle();

  // Fetch existing profile from Firestore
  const profile = await getUserProfile(user.uid);

  if (!profile) {
    // Authentication succeeded but profile does not exist in Firestore
    try {
      await firebaseSignOut(auth);
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
 *
 * @param {object} options
 * @param {string} [options.role='user']
 * @param {string} [options.adminToken='']
 * @returns {Promise<{ user: object, profile: object, role: string }>}
 */
export async function signUpNewUser({ role = 'user', adminToken = '' } = {}) {
  // If admin is selected, require and validate token before proceeding
  if (role === 'admin') {
    await verifyAdminInvitationToken(adminToken);
  }

  const user = await authenticateWithGoogle();

  // Check if profile already exists to prevent duplicate document creation
  let profile = await getUserProfile(user.uid);

  if (!profile) {
    // Create new profile with exact required schema
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
 * Signs the user out from Firebase on Web.
 */
export async function logoutUser() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
