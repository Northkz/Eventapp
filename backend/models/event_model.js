const mongoose = require('mongoose')

const eventSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Add event id'],
      unique: true,
    },
    title: {
      type: String,
      required: [true, 'Add event title'],
    },
    venue_id: {
      type: String,
      required: [true, 'Add venue id'],
    },
    date: {
      type: String,
      required: [true, 'Add event date'],
    },
    description: {
      type: String,
      required: [true, 'Add event description'],
    },
    presenter: {
      type: String,
      required: [true, 'Add event presenter'],
    },
    price: {
      type: Number,
      required: [true, 'Add event price'],
    },
  }
)

module.exports = mongoose.model('Event', eventSchema)