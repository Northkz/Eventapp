const express = require('express')
const router = express.Router()

const {getVenue, updateVenues, addComment, showComments, averageRating} = require('../controllers/venue_controller')
const { protect } = require('../middleware/auth_middleware')


router.post('/updateVenues', protect, updateVenues);
router.post('/addComment', protect, addComment);
router.get('/averageRating',protect, averageRating);
router.get('/comments', showComments);
router.get('*', protect, getVenue)

module.exports = router