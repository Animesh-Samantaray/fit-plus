import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/configs/firebase';

/**
 * Retrieves the user profile document from Firestore `users/{uid}`.
 *
 * @param {string} uid - Firebase Authentication UID
 * @returns {Promise<object|null>} Profile data object or null if not found
 */
export async function getUserProfile(uid) {
  if (!uid) return null;
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    // If permissions fail (e.g. document not created yet or permission restriction), return null safely
    if (error.code === 'permission-denied' || error.message?.includes('permission')) {
      return null;
    }
    console.warn('Error reading user profile:', error.message);
    return null;
  }
}

/**
 * Creates a new user profile document in `users/{uid}` with the exact required schema.
 * Prevents creating duplicate user documents if one already exists.
 *
 * Exact Firestore Schema:
 * {
 *   name: Google display name,
 *   email: Google email,
 *   photoURL: Google profile photo URL or "",
 *   role: "user" | "admin",
 *   createdAt: serverTimestamp()
 * }
 *
 * @param {object} firebaseUser - Authenticated Firebase User
 * @param {string} [role='user'] - Desired role ('user' or 'admin')
 * @returns {Promise<object>} The created or existing profile object
 */
export async function createUserProfile(firebaseUser, role = 'user') {
  if (!firebaseUser?.uid) {
    throw new Error('User creation failed: Firebase Authentication UID is required.');
  }

  const uid = firebaseUser.uid;
  const userRef = doc(db, 'users', uid);

  // Check if user document already exists to prevent duplicate creation or overwrites
  const existingDoc = await getDoc(userRef);
  if (existingDoc.exists()) {
    return existingDoc.data();
  }

  const normalizedRole = role === 'admin' ? 'admin' : 'user';
  const resolvedName =
    firebaseUser.displayName ||
    (normalizedRole === 'admin' ? 'HB+ Administrator' : 'HB+ Member');

  // Exact 5 fields matching Firestore security rules
  const newProfile = {
    name: resolvedName,
    email: (firebaseUser.email || '').toLowerCase().trim(),
    photoURL: firebaseUser.photoURL || '',
    role: normalizedRole,
    createdAt: serverTimestamp(),
  };

  await setDoc(userRef, newProfile);

  return {
    ...newProfile,
    role: normalizedRole,
  };
}

/**
 * Legacy alias for createUserProfile / sync
 */
export async function syncUserProfile(firebaseUser, role = 'user') {
  return createUserProfile(firebaseUser, role);
}
