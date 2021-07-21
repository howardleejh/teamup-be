'use strict'

const { boolean } = require('joi')
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
      max: 50,
      unique: true,
      lowercase: true,
    },
    hash: {
      type: String,
    },
    role: {
      type: String,
      enum: ['bride', 'groom'],
      required: true,
    },
    d_date: {
      type: Date,
    },
    d_destination: {
      name: { type: String },
      formatted_address: String,
    },
    e_budget: {
      type: mongoose.Schema.Types.Decimal128,
    },
    couple_id: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    activation: {
      type: String,
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
