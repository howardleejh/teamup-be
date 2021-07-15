'use strict'

const Joi = require('joi')

module.exports = {
  createTodoValidator: Joi.object({
    task: Joi.string().min(3).required(),
    status: Joi.string().valid('in progress', 'completed'),
    role: Joi.string().valid('bride', 'groom', 'both').required(),
  }),
}
