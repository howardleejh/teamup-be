'use strict'

const mongoose = require('mongoose')

//=========================================
//         Schema Creation
//=========================================

const todoSchema = new mongoose.Schema(
  {
    task: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['in progress', 'completed'],
      default: 'in progress',
      required: true,
    },
    role: {
      type: String,
      enum: ['bride', 'groom', 'both'],
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

const todoModel = mongoose.model('todo', todoSchema)

module.exports = {
  TodoModel: todoModel,
}
