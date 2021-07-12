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
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },
    start_time: {
      type: String,
      required: true,
    },
    end_time: {
      type: String,
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
    list_owner: {
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
