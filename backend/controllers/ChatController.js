const ChatModel = require( "../models/chatModel.js");
const Venue =  require("../models/venue_model.js");
const { get_logger } = require('../utils/logger.js')

// Get Logger
const logger = get_logger()

const getVenue = async (req, res) => {
    let venues = await Venue.find({}, {"_id": 0})
    res.json({
        venues
    })
};


const joinChat = async (req, res) => {
  try {
    const userId = String(req.query.userId);
    const venue = String(req.query.venueId);

    const result = await ChatModel.updateMany(
      { venue_id: venue },
      { $addToSet: { members: userId } }
    );

    if (result.nModified === 0) {
      logger.info("Member already exists in the members list");
    } else {
      logger.info("New member added successfully");
    }

    // Fetch and send the updated chat after the update operation
    const chat = await ChatModel.find({ venue_id: venue });
    res.status(200).json(chat);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



const createChat = async (req, res) => {
  const venue = req.params.venueId
  let venueData = await Venue.find({id:venue})
  let venueName = venueData[0].name
  const newChat = new ChatModel({
    title: venueName,
    venue_id: venue,
    members: [],
  });
  try {
    const chat = await ChatModel.find({
      venue_id: { $eq:  venue},
    });
    if (chat.length != 0 && chat != []){
      return res.status(200).json(chat);
    }
    else{
      const result = newChat.save();
      return res.status(204).send("Success");
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};

const userChats = async (req, res) => {
  try {
    const chat = await ChatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};



// export const venueChat = async (req, res) => {
//   try {
//     const venue = req.body.venueId
//     const chat = await ChatModel.find({
//       venue_id: { $eq:  venue},
//     });
//     res.status(200).json(chat);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// };
module.exports = {
  getVenue,
  joinChat,
  createChat,
  userChats
}