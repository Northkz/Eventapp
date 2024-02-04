const express = require('express')
const router = express.Router()

const { get_logger } = require('../utils/logger.js')

// Get Logger
const logger = get_logger()

router.all('*', (req, res) => {
  logger.error("/*: Not Used URL");
  res.status(400).send({
    "message": "The url us unused"
  })
  
});

module.exports = router