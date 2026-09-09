const jwt = require('jsonwebtoken');
const { User } = require('../models');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Not authorized, no token provided');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new ApiError(401, 'Not authorized, user no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    logger.warn({ err: error }, 'Authentication failed');
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Not authorized, invalid or expired token'));
    }
    next(error);
  }
};

module.exports = { protect };
