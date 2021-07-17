'use strict'

const Joi = require('joi')

module.exports = {
  createEventValidator: Joi.object({
    event_name: Joi.string().min(3).required(),
    from: Joi.date().iso().greater('now').required(),
    to: Joi.date().greater(Joi.ref('from')).required(),
    location: Joi.string().min(3),
    description: Joi.string().max(300).empty(''),
  }),
}
