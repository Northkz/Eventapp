const mongoose = require('mongoose')

const ChatSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Add venue title'],
    },

    venue_id: {
      type: String,
      required: [true, 'Add venue id'],
      unique: true,
    },
    members: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Chat', ChatSchema)
