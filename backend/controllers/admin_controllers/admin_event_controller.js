const asyncHandler = require('express-async-handler')
const Event = require('../../models/event_model.js')
const Venue = require('../../models/venue_model.js')
const { get_logger } = require('../../utils/logger.js')

// Get Logger
const logger = get_logger()

// ----------- EVENT CRUD -----------

// @desc    Get event
// @route   GET /api/admin/event
// @access  Admin
const adminGetEvent = asyncHandler(async (req, res) => {
    const { id } = req.query

    // Return all events
    if (!id){
        const events = await Event.find({}, {"_id": 0})
        logger.info("/api/admin/event: Successful all events retrieval")
        res.status(200).json({
            events
        })
    }
    else {
        // Check if event exists
        const event = await Event.findOne({ id })

        if (!event) {
            logger.error(`/api/admin/event: Event with id: ${id} does not exist`)
            res.status(400)
            throw new Error(`Event with id: ${id} does not exist`)
        }
        else {
            logger.info("/api/admin/event: Successful event retrieval")
            res.status(200).json({
                id: event.id,
                title: event.title,
                venue_id: event.venue_id,
                date: event.date,
                description: event.description,
                presenter: event.presenter,
                price: event.price
            })
        }
    }
})

// @desc    Create event
// @route   POST /api/admin/event
// @access  Admin
const adminCreateEvent = asyncHandler(async (req, res) => {
    const { title, venue_id, date, description, presenter, price } = req.body

    // Check for all event fields
    if (!title || !venue_id || !date || !description || !presenter || !price){
        logger.error("/api/admin/event: Please add all event information")
        res.status(400)
        throw new Error("Please add all event information")
    }

    // Check if event with the same title exists
    const eventExists = await Event.findOne({ title })

    if (eventExists) {
        logger.error(`/api/admin/event: Event with the name \"${title}\" already exists`)
        res.status(400)
        throw new Error(`Event with the name \"${title}\" already exists`)
    }

    // Check if venue with the venue_id exists
    const venueExists = await Venue.findOne({ id: venue_id })

    if (!venueExists) {
        logger.error(`/api/admin/event: Venue with id: ${venue_id} does not exist`)
        res.status(400)
        throw new Error(`Venue with id: ${venue_id} does not exist`)
    }

    // Get the ID of the last event
    const last_event = await Event.findOne().sort({ id: -1 })

    // Create the event
    const event = await Event.create({
        id: (parseInt(last_event.id) + 1).toString(),
        title,
        venue_id,
        date,
        description,
        presenter,
        price
    })
    
    if (event) {
        // Add to venue's list of events
        const venue = await Venue.findOneAndUpdate({ id: venue_id }, { $push: { eventsList: (parseInt(last_event.id) + 1).toString() }}, { new: true } )

        if (!venue){
            logger.error(`/api/admin/event: Could not add a new event to the venue with id: ${venue_id}`)
            res.status(400)
            throw new Error(`Could not add a new event to the venue with id: ${venue_id}`)
        }

        logger.info("/api/admin/event: Successful event registration")
        res.status(201).json(event)
    } 
    else {
        logger.error("/api/admin/event: Invalid event data")
        res.status(400)
        throw new Error('Invalid event data')
    }
})

// @desc    Update event
// @route   PUT /api/admin/event
// @access  Admin
const adminUpdateEvent = asyncHandler(async (req, res) => {
    const id = req.query.id
    const { title, venue_id, date, description, presenter, price } = req.body

    // Check event ID
    if (!id){
        logger.error("/api/admin/event: Please add event ID")
        res.status(400)
        throw new Error("Please add event ID")
    }

    // Check all fields to be parsed
    if (!title || !venue_id || !date || !description || !presenter || !price){
        logger.error("/api/admin/event: Please add all event information")
        res.status(400)
        throw new Error("Please add all event information")
    }

    // Check if event exists
    const eventExists = await Event.findOne({ id })

    if (!eventExists) {
        logger.error(`/api/admin/event: Event with the id: ${id} does not exist`)
        res.status(400)
        throw new Error(`Event with the id: ${id} does not exist`)
    }

    // Check if venue with the venue_id exists
    const venueExists = await Venue.findOne({ id: venue_id })

    if (!venueExists) {
        logger.error(`/api/admin/event: Venue with id: ${venue_id} does not exist`)
        res.status(400)
        throw new Error(`Venue with id: ${venue_id} does not exist`)
    }

    // Check if event with the title exists
    const eventWithTitleExists = await Event.findOne({ title: title })

    if (eventWithTitleExists) {
        logger.error(`/api/admin/event: Event with the title: ${title} already exists`)
        res.status(400)
        throw new Error(`Event with the title: ${title} already exists`)
    }

    // Update the event
    const event = await Event.findOneAndUpdate({ id }, {
        title,
        venue_id,
        date,
        description,
        presenter,
        price
    }, { new: true })
    
    if (event) {
        logger.info("/api/admin/event: Successful event update")
        res.status(201).json(event)
    } 
    else {
        logger.error("/api/admin/event: Invalid event data")
        res.status(400)
        throw new Error('Invalid event data')
    }
})

// @desc    Delete event
// @route   DELETE /api/admin/event
// @access  Admin
const adminDeleteEvent = asyncHandler(async (req, res) => {
    const id = req.query.id
    
    // Check event ID
    if (!id){
        logger.error("/api/admin/event: Please add event ID")
        res.status(400)
        throw new Error("Please add event ID")
    }

    // Check if event exists
    const eventExists = await Event.findOne({ id })

    if (!eventExists) {
        logger.error(`/api/admin/event: Event with the id: ${id} does not exist`)
        res.status(400)
        throw new Error(`Event with the id: ${id} does not exist`)
    }

    // Delete event from venue's eventsList
    const venue = await Venue.findOneAndUpdate({ eventsList: id }, {$pull: {eventsList: id}}, { new: true })

    if (!venue){
        logger.error(`/api/admin/event: Could not update venue's eventsList`)
        res.status(400)
        throw new Error(`Could not update venue's eventsList`)
    }

    // Delete the event
    const event = await Event.findOneAndDelete({ id })
    
    if (event) {
        logger.info("/api/admin/event: Successful event delete")
        res.status(204).json()
    } 
    else {
        logger.error("/api/admin/event: Unsuccessful event delete")
        res.status(400)
        throw new Error('Unsuccessful event delete')
    }
})

module.exports = {
    adminGetEvent,
    adminCreateEvent,
    adminDeleteEvent,
    adminUpdateEvent
}