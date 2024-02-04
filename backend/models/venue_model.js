const mongoose = require('mongoose')

const venueSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: [true, 'Add venue id'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Add venue name'],
    },
    latitude: {
      type: String,
      required: [true, 'Add venue latitude'],
    },
    longitude: {
      type: String,
      required: [true, 'Add event longitude'],
    },
    eventsList:[{
      type: String,
      required: [true, 'Add event id'],
      unique: true,
    }]
  }
)

module.exports = mongoose.model('Venue', venueSchema)