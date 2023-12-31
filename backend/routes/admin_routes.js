const express = require('express')
const router = express.Router()

const {
  adminGetEvent,
  adminCreateEvent,
  adminDeleteEvent,
  adminUpdateEvent
} = require('../controllers/admin_controllers/admin_event_controller')

const {
  adminGetVenue,
  adminCreateVenue,
  adminDeleteVenue,
  adminUpdateVenue
} = require('../controllers/admin_controllers/admin_venue_controller')


const {
  adminGetUser,
  adminCreateUser,
  adminDeleteUser,
  adminUpdateUser
} = require('../controllers/admin_controllers/admin_user_controller')

const { protect } = require('../middleware/auth_middleware')
const { checkAdmin } = require('../middleware/admin_middleware')

router.post('/event', protect, checkAdmin, adminCreateEvent)
router.get('/event', protect, checkAdmin, adminGetEvent)
router.put('/event', protect, checkAdmin, adminUpdateEvent)
router.delete('/event', protect, checkAdmin, adminDeleteEvent)

router.post('/venue', protect, checkAdmin, adminCreateVenue)
router.get('/venue', protect, checkAdmin, adminGetVenue)
router.put('/venue', protect, checkAdmin, adminUpdateVenue)
router.delete('/venue', protect, checkAdmin, adminDeleteVenue)

router.post('/user', protect, checkAdmin, adminCreateUser)
router.get('/user', protect, checkAdmin, adminGetUser)
router.put('/user', protect, checkAdmin, adminUpdateUser)
router.delete('/user', protect, checkAdmin, adminDeleteUser)

module.exports = router