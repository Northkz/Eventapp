const asyncHandler = require('express-async-handler')
const Venue = require('../../models/venue_model.js')
const Event = require('../../models/event_model.js')
const User = require('../../models/user_model.js')
const Chat = require('../../models/chatModel.js')
const Comment = require('../../models/comment_model.js')
const Message = require('../../models/messageModel.js')
const { get_logger } = require('../../utils/logger.js')

// Get Logger
const logger = get_logger()

// ----------- VENUE CRUD -----------

// @desc    Get venue
// @route   GET /api/admin/venue
// @access  Admin
const adminGetVenue = asyncHandler(async (req, res) => {
    const { id } = req.query

    // Return all venues
    if (!id){
        const venues = await Venue.find({}, {"_id": 0})
        logger.info("/api/admin/venue: Successful all venues retrieval")
        res.status(200).json({
            venues
        })
    }
    else {
        // Check if venue exists
        const venue = await Venue.findOne({ id })

        if (!venue) {
            logger.error(`/api/admin/venue: Venue with id: ${id} does not exist`)
            res.status(400)
            throw new Error(`Venue with id: ${id} does not exist`)
        }
        else {
            logger.info("/api/admin/venue: Successful venue retrieval")
            res.status(200).json(venue)
        }
    }
})

// @desc    Create venue
// @route   POST /api/admin/venue
// @access  Admin
const adminCreateVenue = asyncHandler(async (req, res) => {
    const { name, latitude, longitude } = req.body

    // Check for all venue fields
    if (!name || !latitude || !longitude){
        logger.error("/api/admin/venue: Please add all venue information")
        res.status(400)
        throw new Error("Please add all venue information")
    }

    // Check if venue with the same name exists
    const venueExists = await Venue.findOne({ name })

    if (venueExists) {
        logger.error(`/api/admin/venue: Venue with the name \"${name}\" already exists`)
        res.status(400)
        throw new Error(`Venue with the name \"${name}\" already exists`)
    }

    // Get the ID of the last venue
    const last_venue = await Venue.findOne().sort({ id: -1 })

    // Create the venue
    const venue = await Venue.create({
        id: (parseInt(last_venue.id) + 1).toString(),
        name,
        longitude,
        latitude
    })
    
    if (venue) {
        logger.info("/api/admin/venue: Successful venue registration")
        res.status(201).json(venue)
    } 
    else {
        logger.error("/api/admin/venue: Invalid venue data")
        res.status(400)
        throw new Error('Invalid venue data')
    }
})

// @desc    Update venue
// @route   PUT /api/admin/venue
// @access  Admin
const adminUpdateVenue = asyncHandler(async (req, res) => {
    const id = req.query.id
    const { name, latitude, longitude } = req.body

    // Check venue ID
    if (!id){
        logger.error("/api/admin/venue: Please add venue ID")
        res.status(400)
        throw new Error("Please add venue ID")
    }

    // Check all fields to be parsed
    if (!name || !latitude || !longitude){
        logger.error("/api/admin/venue: Please add all venue information")
        res.status(400)
        throw new Error("Please add all venue information")
    }

    // Check if venue exists
    const venueExists = await Venue.findOne({ id: id })

    if (!venueExists) {
        logger.error(`/api/admin/venue: Venue with id: ${id} does not exist`)
        res.status(400)
        throw new Error(`Venue with id: ${id} does not exist`)
    }

    // Update the venue
    const venue = await Venue.findOneAndUpdate({ id }, {
        name,
        latitude,
        longitude
    }, { new: true })
    
    if (venue) {
        // Update chat name
        const chat = await Chat.findOneAndUpdate({venue_id: id}, { title: name }, { new: true })
        
        if (!chat){
            logger.error(`/api/admin/venue: Could not update chat title with a new name ${name}`)
            res.status(400)
            throw new Error(`VCould not update chat title with a new name ${name}`)
        }

        logger.info("/api/admin/venue: Successful venue update")
        res.status(201).json(venue)
    } 
    else {
        logger.error("/api/admin/venue: Invalid venue data")
        res.status(400)
        throw new Error('Invalid venue data')
    }
})

// @desc    Delete venue
// @route   DELETE /api/admin/venue
// @access  Admin
const adminDeleteVenue = asyncHandler(async (req, res) => {
    const id = req.query.id
    
    // Check venue ID
    if (!id){
        logger.error("/api/admin/venue: Please add venue ID")
        res.status(400)
        throw new Error("Please add venue ID")
    }

    // Check if venue exists
    const venueExists = await Venue.findOne({ id })

    if (!venueExists) {
        logger.error(`/api/admin/venue: Venue with the id: ${id} does not exist`)
        res.status(400)
        throw new Error(`Venue with the id: ${id} does not exist`)
    }

    // Delete Chat
    const chatExists = await Chat.findOne({ venue_id: id })

    if (chatExists) {
        const messagesExist = await Message.find({ chatId: chatExists._id.toString()})
        
        console.log(messagesExist)

        if (messagesExist.length > 0){
            const messages = await Message.deleteMany({ chatId: chatExists._id.toString() })
            logger.info(`/api/admin/venue: Deleted ${messages.deletedCount} messages for the chat with venue with id: ${id}`)
        }

        const chat = await Chat.findOneAndDelete({ venue_id: id }, { new: true })

        if (!chat){
            logger.error(`/api/admin/venue: Could not delete the chat with the venue id: ${id}`)
            res.status(400)
            throw new Error(`Could not delete the chat with the venue id: ${id}`)
        }
    }

    // Delete Comments
    const commentsExist = await Comment.find({ venue_id: id })

    if (commentsExist.length > 0) {
        const comments = await Comment.deleteMany({ venue_id: id })
        logger.info(`/api/admin/venue: Deleted ${comments.deletedCount} comments for the venue with id: ${id}`)
    }
    
    // Delete from the users' favourite lists
    const usersExist = await User.find({ favVenues: id })

    if (usersExist.length > 0){
        const users = await User.updateMany({ favVenues: id }, { $pull: { favVenues: id } }, { new: true });
        logger.info(`/api/admin/venue: Deleted the venue with id: ${id} from ${usersExist.length} users`)
    }

    // Delete Events
    const eventsExist = await Event.find({ venue_id: id })

    if (eventsExist.length > 0){
        const events = await Event.deleteMany({ venue_id: id })
        logger.info(`/api/admin/venue: Deleted ${events.deletedCount} events for the venue with id: ${id}`)
    }

    // Delete the venue
    const venue = await Venue.findOneAndDelete({ id })
    
    if (venue) {
        logger.info("/api/admin/venue: Successful venue delete")
        res.status(204).json()
    } 
    else {
        logger.error("/api/admin/venue: Unsuccessful venue delete")
        res.status(400)
        throw new Error('Unsuccessful venue delete')
    }
})

module.exports = {
    adminGetVenue,
    adminCreateVenue,
    adminDeleteVenue,
    adminUpdateVenue
}