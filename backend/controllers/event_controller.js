const asyncHandler = require('express-async-handler')
const Event = require('../models/event_model')

const { get_logger } = require('../utils/logger.js')

// Get Logger
const logger = get_logger()

// @desc    Get event
// @route   GET /api/event
// @access  Private
const getEvent = asyncHandler(async (req, res) => {
    const { id } = req.query
    // Return all events
    if (!id){
        const events = await Event.find({}, {"_id": 0})
        logger.info("/api/event: Successful all events retrieval")
        res.json({
            events
        })
    }
    else {
        // Check if event exists
        const event = await Event.findOne({ id })

        if (!event) {
            logger.error(`/api/event: Event with id: ${id} does not exist`)
            res.status(400)
            throw new Error(`Event with id: ${id} does not exist`)
        }
        else {
            logger.info("/api/event: Successful event retrieval")
            res.json({
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


// @desc    Get events with given max price
// @route   GET /api/event/maxPriceEvents:maxPrice
// @access  Private
const maxPriceEvents = asyncHandler(async (req, res) => {
    const maxPrice = Number(req.query.maxPrice)
    // Return all events
    if (!maxPrice){
        const events = await Event.find({}, {"_id": 0})
        logger.info("/api/event: Successful all events retrieval")
        res.json({
            events
        })
    }
    else {
        // Check if event exists
        const events = await Event.find({ price: { $lte: maxPrice } })

        if (!events) {
            logger.error(`/api/event/maxPriceEvents: Event with such price does not exist`)
            res.status(400)
            res.json({
            })
        }
        else {
            logger.info("/api/event/maxPriceEvents: Successful event retrieval")
            res.json({
                events
            })
        }
    }   
})

module.exports = {
    maxPriceEvents,
    getEvent
}