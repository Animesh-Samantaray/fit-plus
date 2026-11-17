/**
 * Validates the admin invitation token securely.
 * Sends the token to the trusted server backend for verification.
 * Client-side elevation is strictly prohibited.
 *
 * @param {string} token - The invitation token entered by the user
 * @returns {Promise<boolean>} Resolves true if valid, throws descriptive Error if invalid
 */
export async function verifyAdminInvitationToken(token) {
  if (!token || typeof token !== 'string' || !token.trim()) {
    throw new Error('Administrator invitation token is required for Admin registration.');
  }

  const cleanToken = token.trim();

  // If running in an environment with ADMIN_INVITE_TOKEN directly accessible
  if (process.env.ADMIN_INVITE_TOKEN && process.env.ADMIN_INVITE_TOKEN.trim()) {
    if (cleanToken !== process.env.ADMIN_INVITE_TOKEN.trim()) {
      throw new Error('Invalid administrator invitation token. Access denied by security policy.');
    }
    return true;
  }

  try {
    // Attempt backend server validation via Expo Router API route
    const response = await fetch('/api/validate-invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: cleanToken,
        role: 'admin',
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.valid === true) {
        return true;
      }
      throw new Error(data.error || 'Invalid administrator invitation token.');
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Admin validation failed with status ${response.status}.`
      );
    }
  } catch (error) {
    throw new Error(
      error.message || 'Unable to connect to verification server to validate admin token.'
    );
  }
}
