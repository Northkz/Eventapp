const mongoose = require('mongoose')

const commentSchema = mongoose.Schema(
  {
    commentId: {
      type: Number,
      required: [true, 'Add event id'],
      unique: true,
    },
    user_id: {
      type: String,
      required: [true, 'Add comment owner'],
    },
    venue_id: {
      type: String,
      required: [true, 'Add venue id'],
    },
    rating: {
      type: Number,
      required: [true, 'Add rating'],
    },
    content: {
      type: String,
      required: [true, 'Add comment text'],
    }
  }
)

module.exports = mongoose.model('comments', commentSchema)