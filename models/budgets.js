'use strict'

const mongoose = require('mongoose')

//=========================================
//         Schema Creation
//=========================================

const budgetItemSchema = new mongoose.Schema(
  {
    item_name: {
      type: String,
      required: true,
    },
    amount: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
    },
    payment_type: {
      type: String,
      enum: ['credit', 'debit'],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['not paid', 'paid'],
      default: 'not paid',
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

const budgetItemModel = mongoose.model('budget_item', budgetItemSchema)

module.exports = {
  BudgetItemModel: budgetItemModel,
}
