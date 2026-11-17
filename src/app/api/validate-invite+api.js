/**
 * Secure Backend API Route: Admin Invitation Token Validator
 * Executes strictly on the server in Expo Router (Server Output).
 * Reads the secure server-side ADMIN_INVITE_TOKEN without exposing it to client bundles.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { token, role } = body || {};

    if (role !== 'admin') {
      return Response.json({ valid: true, role: 'user' });
    }

    const serverToken = process.env.ADMIN_INVITE_TOKEN;
    if (!serverToken || !serverToken.trim()) {
      return Response.json(
        {
          valid: false,
          error:
            'Admin registration is disabled: ADMIN_INVITE_TOKEN is not configured on the server.',
        },
        { status: 503 }
      );
    }

    if (!token || typeof token !== 'string' || token.trim() !== serverToken.trim()) {
      return Response.json(
        {
          valid: false,
          error:
            'Invalid administrator invitation token. Access denied by security policy.',
        },
        { status: 403 }
      );
    }

    return Response.json({
      valid: true,
      role: 'admin',
      message: 'Admin invitation token verified successfully.',
    });
  } catch (error) {
    return Response.json(
      {
        valid: false,
        error: error.message || 'Token validation error on server.',
      },
      { status: 400 }
    );
  }
}
