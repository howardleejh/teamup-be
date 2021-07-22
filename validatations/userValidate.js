'use strict'

const Joi = require('joi')

module.exports = {
  userRegisterValidator: Joi.object({
    user_fullName: Joi.string().min(3).max(50).required(),
    user_email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    user_role: Joi.string().valid('bride', 'groom'),
    partner_fullName: Joi.string().min(3).max(50).required(),
    partner_email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    partner_role: Joi.string().valid('bride', 'groom'),
  }),
  loginValidator: Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    password: Joi.string()
      .min(3)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),
  }),
}
