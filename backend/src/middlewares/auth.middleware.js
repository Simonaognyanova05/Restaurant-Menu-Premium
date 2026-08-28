const jwt = require('jsonwebtoken');
const ApiError = require('../utils/api-error');

const requireAdmin = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization?.startsWith('Bearer ')
    ? authorization.slice(7)
    : null;

  if (!token) {
    return next(new ApiError(401, 'Authentication required'));
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    if (req.user.role !== 'admin' || req.user.email !== process.env.ADMIN_EMAIL?.trim().toLowerCase()) {
      return next(new ApiError(403, 'Admin access required'));
    }
    return next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

module.exports = { requireAdmin };
