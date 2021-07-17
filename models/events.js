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
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
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

const eventItemModel = mongoose.model('event_item', eventItemSchema)

module.exports = {
  EventItemModel: eventItemModel,
}
