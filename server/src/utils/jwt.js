const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateToken = (userId, email, role = 'user') => {
  return jwt.sign({ id: userId, email, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

module.exports = { generateToken };
