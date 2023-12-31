const express = require('express')
const router = express.Router()

const {getEvent, maxPriceEvents} = require('../controllers/event_controller')

const { protect } = require('../middleware/auth_middleware')



router.get('/maxPriceEvents', protect, maxPriceEvents);
router.get('*', protect, getEvent)


module.exports = router