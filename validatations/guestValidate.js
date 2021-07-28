'use strict'

const Joi = require('joi')

module.exports = {
  createGuestValidator: Joi.object({
    guest_fullName: Joi.string().min(3).max(50).required(),
    guest_contact: Joi.string().alphanum().max(8),
    role: Joi.string().valid('bride', 'groom').required(),
    status: Joi.string()
      .valid('pending', 'attending', 'unavailable')
      .default('pending')
      .required(),
    pax: Joi.number().integer().required(),
  }),
}
