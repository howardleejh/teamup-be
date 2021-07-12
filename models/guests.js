'use strict'

const mongoose = require('mongoose')

//=========================================
//         Schema Creation
//=========================================

const guestSchema = new mongoose.Schema(
  {
    guest_first_name: {
      type: String,
      required: true,
    },
    guest_last_name: {
      type: String,
      required: true,
    },
    guest_contact: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ['bride', 'groom'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'attending', 'unavailable'],
      default: 'pending',
      required: true,
    },
    pax: {
      type: Number,
      required: true,
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

const guestModel = mongoose.model('guest', guestSchema)

module.exports = {
  GuestModel: guestModel,
}
