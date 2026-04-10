/**
 * Gateway sets `x-user-roles` to a comma-separated list (e.g. "DOCTOR" or "ADMIN,PATIENT").
 * Express lowercases incoming header names → req.headers['x-user-roles'].
 */

function parseRoles(header) {
  if (!header || typeof header !== 'string') return [];
  return header
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean);
}

function rolesFromRequest(req) {
  return parseRoles(req.headers['x-user-roles']);
}

function requireAnyRole(...allowedRoles) {
  return function requireAnyRoleMiddleware(req, res, next) {
    const roles = rolesFromRequest(req);
    const ok = allowedRoles.some((r) => roles.includes(r));
    if (!ok) {
      return res.status(403).json({
        message: 'Forbidden: DOCTOR or ADMIN role required for this resource.',
      });
    }
    next();
  };
}

/** @deprecated Prefer requireAnyRole for clarity */
function requireRole(role) {
  return requireAnyRole(role);
}

module.exports = { requireRole, requireAnyRole, rolesFromRequest };
