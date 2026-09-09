const { validationResult } = require('express-validator');
const authService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');

const signup = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { name, email, password } = req.body;
  const { user, token } = await authService.registerUser({ name, email, password });

  logger.info({ userId: user.id }, 'New user registered');
  res.status(201).json({ success: true, data: { user, token } });
});

const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { email, password } = req.body;
  const { user, token } = await authService.loginUser({ email, password });

  logger.info({ userId: user.id }, 'User logged in');
  res.status(200).json({ success: true, data: { user, token } });
});

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: { user: req.user.toSafeObject() } });
});

module.exports = { signup, login, getProfile };
