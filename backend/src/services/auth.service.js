const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const ApiError = require('../utils/api-error');

const safePasswordMatches = (providedPassword, configuredPassword) => {
  const provided = Buffer.from(providedPassword || '');
  const configured = Buffer.from(configuredPassword);

  return provided.length === configured.length && crypto.timingSafeEqual(provided, configured);
};

const loginAdmin = async (email, password) => {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const normalizedEmail = email?.trim().toLowerCase();

  if (!configuredEmail || !process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) {
    throw new ApiError(500, 'Admin authentication is not configured');
  }

  const emailMatches = normalizedEmail === configuredEmail;
  const passwordMatches = emailMatches && safePasswordMatches(password, process.env.ADMIN_PASSWORD);

  if (!emailMatches || !passwordMatches) {
    throw new ApiError(401, 'Invalid admin credentials');
  }

  const token = jwt.sign(
    { email: configuredEmail, role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  return { token, user: { email: configuredEmail, role: 'admin' } };
};

module.exports = { loginAdmin };
