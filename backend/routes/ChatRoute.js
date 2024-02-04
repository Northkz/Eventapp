const express = require('express');
const { createChat, joinChat, getVenue, userChats}= require('../controllers/ChatController.js');
const router = express.Router()


router.get('/venue', getVenue);
router.post('/:venueId', createChat);
router.get('/:userId', userChats);
router.get('/', joinChat);


module.exports = router