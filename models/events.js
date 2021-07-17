'use strict'

const mongoose = require('mongoose')

//=========================================
//         Schema Creation
//=========================================

const eventItemSchema = new mongoose.Schema(
  {
    event_name: {
      type: String,
      required: true,
    },
    from: {
      type: Date,
      required: true,
    },
    to: {
      type: Date,
      required: true,
    },
    location: {
      name: { type: String, required: true },
      formatted_address: String,
    },
    description: {
      type: String,
      max: 300,
    },
    couple_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const eventItemModel = mongoose.model('event', eventItemSchema)

module.exports = {
  EventItemModel: eventItemModel,
}
