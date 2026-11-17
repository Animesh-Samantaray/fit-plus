export const OFFICIAL_DOMAIN = 'hbplus.fit';
export const ACCESS_DENIED_MESSAGE =
  'Access denied. Only authorized @hbplus.fit accounts are allowed.';
export const EMAIL_UNVERIFIED_MESSAGE =
  'Access denied. Please verify your email with Google and try again.';

/**
 * Returns the currently active allowed email domain.
 * Defaults to 'hbplus.fit'.
 *
 * @returns {string} normalized domain string (e.g. 'hbplus.fit')
 */
export function getAllowedEmailDomain() {
  const envDomain = process.env.EXPO_PUBLIC_ALLOWED_EMAIL_DOMAIN;
  if (envDomain && typeof envDomain === 'string' && envDomain.trim()) {
    return envDomain.trim().replace(/^@/, '').toLowerCase();
  }
  return OFFICIAL_DOMAIN;
}

/**
 * Generates user-facing access restriction error message.
 *
 * @returns {string}
 */
export function getAccessRestrictedMessage() {
  const domain = getAllowedEmailDomain();
  if (domain === OFFICIAL_DOMAIN) {
    return ACCESS_DENIED_MESSAGE;
  }
  return `Access denied. Only authorized @${domain} accounts are allowed.`;
}

// Backwards compatibility alias
export const ALLOWED_DOMAIN = OFFICIAL_DOMAIN;
export const ACCESS_RESTRICTED_MESSAGE = ACCESS_DENIED_MESSAGE;

/**
 * Validates whether an email belongs strictly and exactly to the allowed domain.
 * Performs rigorous RFC email format checks, trims whitespace, converts to lowercase,
 * and executes strict exact domain equality matching.
 *
 * @param {string} email
 * @returns {{ isValid: boolean, normalizedEmail: string, error?: string }}
 */
export function validateEmailDomain(email) {
  const targetDomain = getAllowedEmailDomain();
  const errorMessage = getAccessRestrictedMessage();

  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      normalizedEmail: '',
      error: errorMessage,
    };
  }

  const normalized = email.trim().toLowerCase();

  // Strict email syntax regex (ensures standard user@domain.tld structure)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalized)) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      error: errorMessage,
    };
  }

  const parts = normalized.split('@');
  if (parts.length !== 2) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      error: errorMessage,
    };
  }

  const [username, domain] = parts;

  // Strict exact domain matching: rejects subdomains, typos, and other TLDs
  if (!username || domain !== targetDomain) {
    return {
      isValid: false,
      normalizedEmail: normalized,
      error: errorMessage,
    };
  }

  return {
    isValid: true,
    normalizedEmail: normalized,
  };
}

/**
 * Verifies that the authenticated Firebase/Google user has a verified email address.
 *
 * @param {object} user - Firebase User object
 * @returns {{ isVerified: boolean, error?: string }}
 */
export function verifyUserEmail(user) {
  if (!user) {
    return {
      isVerified: false,
      error: ACCESS_DENIED_MESSAGE,
    };
  }

  if (user.emailVerified !== true) {
    return {
      isVerified: false,
      error: EMAIL_UNVERIFIED_MESSAGE,
    };
  }

  return {
    isVerified: true,
  };
}
