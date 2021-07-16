'use strict'

const Joi = require('joi')

module.exports = {
  createBudgetValidator: Joi.object({
    item_name: Joi.string().min(3).required(),
    amount: Joi.number().unsafe().required(),
    payment_type: Joi.string().valid('credit', 'debit').required(),
    category: Joi.string().min(3),
    status: Joi.string().valid('not paid', 'paid').required(),
    description: Joi.string().max(300),
  }),
}
