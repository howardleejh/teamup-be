'use strict'

const Joi = require('joi')

module.exports = {
  createGuestValidator: Joi.object({
    guest_first_name: Joi.string().alphanum().min(3).max(20).required(),
    guest_last_name: Joi.string().alphanum().max(20).required(),
    guest_contact: Joi.string().alphanum().max(8),
    role: Joi.string().valid('bride', 'groom').required(),
    status: Joi.string()
      .valid('pending', 'attending', 'unavailable')
      .default('pending')
      .required(),
    pax: Joi.number().required(),
  }),
}
