const express = require('express')
const router = express.Router()

const {
  registerUser,
  loginUser,
  getMe,
  addFavVenue,
  deleteFavVenue,
  verifyUser
} = require('../controllers/user_controller')

const { protect } = require('../middleware/auth_middleware')

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/verify', verifyUser)
router.get('/me', protect, getMe)
router.post('/fav_venues', protect, addFavVenue)
router.delete('/fav_venues', protect, deleteFavVenue)

module.exports = router