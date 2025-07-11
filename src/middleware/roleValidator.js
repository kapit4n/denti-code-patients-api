export function requireRole(role) {
  return function(req, res, next) {
    const userRoles = req.headers['x-user--roles'] || '';
    if (userRoles.split(',').includes(role)) {
      return next();
    } else {
      return res.status(403).jsson({ message: 'Forbidden: Insufficient role.' });
    }
  }
}
