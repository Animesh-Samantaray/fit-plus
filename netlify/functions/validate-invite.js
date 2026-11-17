/**
 * Netlify Serverless Function: Secure Admin Invitation Token Validator
 * Executes strictly on the Netlify backend.
 * Reads the secure server-side ADMIN_INVITE_TOKEN environment variable.
 * Never exposed to browser bundles or client code.
 */
exports.handler = async function (event, context) {
  // CORS & Preflight handling
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { token, role } = body || {};

    if (role !== 'admin') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valid: true, role: 'user' }),
      };
    }

    const serverToken = process.env.ADMIN_INVITE_TOKEN;
    if (!serverToken || !serverToken.trim()) {
      return {
        statusCode: 503,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valid: false,
          error:
            'Admin registration is disabled: ADMIN_INVITE_TOKEN is not configured on the server.',
        }),
      };
    }

    if (!token || typeof token !== 'string' || token.trim() !== serverToken.trim()) {
      return {
        statusCode: 403,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valid: false,
          error:
            'Invalid administrator invitation token. Access denied by security policy.',
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        valid: true,
        role: 'admin',
        message: 'Admin invitation token verified successfully.',
      }),
    };
  } catch (error) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        valid: false,
        error: error.message || 'Invalid request body.',
      }),
    };
  }
};
