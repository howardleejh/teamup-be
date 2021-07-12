'use strict'

const Joi = require('joi')

module.exports = {
  createTodoValidator: Joi.object({
    task: Joi.String().alphanum().min(3).required(),
    status: Joi.String().valid('in progress', 'completed'),
    role: Joi.string().valid('bride', 'groom', 'both').required(),
  }),
}
