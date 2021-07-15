'use strict'

const mongoose = require('mongoose')

//=========================================
//         Schema Creation
//=========================================

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      max: 20,
    },
    last_name: {
      type: String,
      required: true,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      max: 100,
      unique: true,
    },
    hash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['bride', 'groom'],
      required: true,
    },
    partner_first_name: {
      type: String,
      required: true,
      max: 20,
    },
    partner_last_name: {
      type: String,
      required: true,
      max: 20,
    },
    partner_email: {
      type: String,
      required: true,
      max: 100,
      unique: true,
    },
    d_date: {
      type: Date,
      required: true,
    },
    e_budget: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
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

const userModel = mongoose.model('user', userSchema)

module.exports = {
  UserModel: userModel,
}
