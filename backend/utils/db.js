const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Venue = require('../models/venue_model.js');
const Comment = require('../models/comment_model.js');
const Event = require('../models/event_model.js');
const { get_logger } = require('./logger.js')

// Get Logger
const logger = get_logger()

// ENV Variables
dotenv.config({ path: './config.env' })

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    logger.info(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    logger.error(error)
    process.exit(1)
  }
}

// Function to add events to MongoDB
async function addEventsToMongoDB(events) {
  try {
    // Use create method to insert events into the database
    const result = await Event.create(events);
    logger.info('Events added to MongoDB:', result);
  } catch (error) {
    logger.error('Error adding events to MongoDB: Possibly due to data duplication. ', error.message);
  }
}

// Function to add venues to MongoDB
async function addVenuesToMongoDB(venues) {
  try {
    // Use create method to insert venues into the database    
    const result = await Venue.create(venues);
    
    logger.info('Venues added to MongoDB:', result);
  } catch (error) {
    
    logger.error('Error adding venues to MongoDB: Possibly due to data duplication. ', error.message);
  }
}


const getLatestCommentId = async () => {
  try {
    const latestComment = await Comment.findOne({}, {}, { sort: { 'commentId': -1 } });
    return latestComment ? parseInt(latestComment.commentId) + 1 : 1;
  } catch (error) {
    logger.error('Error getting latest comment ID:', error);
    throw error;
  }
};

// Function to add comment to MongoDB
async function addCommentToMongoDB(comment) {
  try {
    id = await getLatestCommentId();
    comment["commentId"] = id;
    const result = await Comment.create(comment);
    logger.info('Comment is added to MongoDB:', result);
    return 1;
  } catch (error) {
    logger.error('Error adding comment to MongoDB:', error.message);
    return -1;
  }
}



module.exports = {connectDB, addEventsToMongoDB, addVenuesToMongoDB, addCommentToMongoDB}