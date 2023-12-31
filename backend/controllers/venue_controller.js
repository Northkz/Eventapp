const asyncHandler = require("express-async-handler");
const Venue = require("../models/venue_model.js");
const User = require("../models/user_model.js");
const Comment = require("../models/comment_model.js");
const { extractData } = require("../middleware/data_extraction.js");
const { get_logger } = require("../utils/logger.js");
const { addEventsToMongoDB, addVenuesToMongoDB, addCommentToMongoDB } = require("../utils/db.js");

// Get Logger
const logger = get_logger();

// @desc    Get venue
// @route   GET /api/venue
// @access  Private
const getVenue = asyncHandler(async (req, res) => {
  const { id } = req.query;

  // Return all venues
  if (!id) {
    let venues = await Venue.find({}, { _id: 0 });
    logger.info("/api/venue: Successful all venues retrieval");
    res.json({
      venues,
    });
  } else {
    // Check if venue logger
    const venue = await Venue.findOne({ id });

    if (!venue) {
      logger.error(`/api/venue: Venue with id: ${id} does not exist`);
      res.status(400);
      throw new Error(`Venue with id: ${id} does not exist`);
    } else {
      logger.info("/api/venue: Successful venue retrieval");
      res.json({
        id: venue.id,
        name: venue.name,
        latitude: venue.latitude,
        longitude: venue.longitude,
        eventsList: venue.eventsList,
      });
    }
  }
});

const updateVenues = asyncHandler(async (req, res) => {
  try {
    let extractedData = await extractData();
    for (let record of extractedData) {
      let venue = {
        id: record["venueId"],
        name: record["venueNameE"],
        latitude: record["latitude"],
        longitude: record["longitude"],
      };
      eventList = [];
      for (ev of record["events"]) {
        if (!ev["descE"]){
          ev["descE"] = "Description of this event was not provided."
        }
        if (!ev["predateE"]){
          ev["predateE"] = "Date of this event was not provided"
        }
        if (!ev["presenterOrgC"]){
          ev["presenterOrgC"] = "Presenter of this event was not provided"
        }
        let event = {
          id: ev["eventId"],
          title: ev["titleE"],
          venue_id: record["venueId"],
          date: ev["predateE"],
          description: ev["descE"],
          presenter: ev["presenterOrgC"],
          price: ev["priceC"],
        };
        eventList.push(ev["eventId"]);
        addEventsToMongoDB(event);
      }
      venue["eventsList"] = eventList;
      addVenuesToMongoDB(venue);
    }
    // return start and end dates
    return res.status(200).json({
      version_date_start: extractedData["start"],
      version_date_end: extractedData["end"],
    });
  } catch {
    logger.error("Error in extracting data or adding to DB :", error.message);
    return res.status(500).send("Internal server error");
  }
});

const addComment = asyncHandler(async (req, res) => {
  let commentText = req.body.commentText;
  let user = req.body.email;
  let venue = req.body.venueID;
  let rating = Number(req.body.rating);
  let email = await User.find({}, { email: user });
  let real_venue = await Venue.find({}, { id: venue });
  if (commentText == undefined || email.length <= 0 || real_venue.length <= 0 || rating == undefined) {
    return res.status(400).send("Some parameter(s) is missing or incorrect");
  }
  comment = {
    user_id: user,
    venue_id: venue,
    rating: rating,
    content: commentText,
  };
  result = await addCommentToMongoDB(comment);
  if (result == 1) {
    return res.status(201).send("Comment is added");
  } else {
    return res.status(500).send("Internal server error");
  }
});

const showComments = asyncHandler(async (req, res) => {
  let venueId = req.query.venueId;
  if (!venueId) {
    return res.status(200).json({
      error: "Venue Id was not provided",
    });
  }
  let real_venue = await Venue.find({}, { id: venueId });
  if (real_venue.length <= 0) {
    return res.status(400).send("Some query param(s) is missing or incorrect");
  }
  let comments = await Comment.find({ venue_id: venueId });
  return res.status(200).json({
    comments: comments,
  });
});

const averageRating = asyncHandler(async (req, res) => {
  let venueId = req.query.venueId;
  if (!venueId) {
    return res.status(200).json({
      error: "Venue Id was not provided",
    });
  }
  try {
    const comments = await Comment.find({ venue_id: venueId });
    if (comments.length == 0) {
      return res.status(204);
    }

    const totalRatings = comments.reduce((sum, comment) => sum + comment.rating, 0);
    const averageRating = totalRatings / comments.length;

    return res.status(200).json({
      venue_id: venueId,
      averageRating: averageRating,
    });
  } catch (error) {
    logger.error("Error retrieving comments:", error);
    throw error;
  }
});

module.exports = {
  averageRating,
  getVenue,
  addComment,
  updateVenues,
  showComments,
};
