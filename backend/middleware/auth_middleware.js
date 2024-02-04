const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/user_model')
const dotenv = require('dotenv')

const { get_logger } = require('../utils/logger.js')

// ENV Variables
dotenv.config({ path: './config.env' })

// Get Logger
const logger = get_logger()

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Get user from the token
      req.user = await User.findById(decoded.id)
      
      logger.info("/api: User Authorized")

      next()
    } catch (error) {
      logger.error("/api " + error)
      res.status(401)
      throw new Error('Not authorized')
    }
  }

  if (!token) {
    logger.error("/api: Not authorized, no token")
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

module.exports = { protect }