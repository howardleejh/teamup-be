'use strict'

const Joi = require('joi')

module.exports = {
  userRegisterValidator: Joi.object({
    first_name: Joi.string().alphanum().min(3).max(20).required(),
    last_name: Joi.string().alphanum().max(20).required(),
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
    confirmPassword: Joi.ref('password'),
    role: Joi.string().valid('bride', 'groom').required(),
  }),
  partnerRegisterValidator: Joi.object({
    first_name: Joi.string().alphanum().min(3).max(20).required(),
    last_name: Joi.string().alphanum().max(20).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    partner_first_name: Joi.string().alphanum().min(3).max(20).required(),
    partner_last_name: Joi.string().alphanum().max(20).required(),
    partner_email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
      })
      .required(),
    password: Joi.string()
      .min(3)
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
      .required(),
    confirmPassword: Joi.ref('password'),
    role: Joi.string().valid('bride', 'groom').required(),
    d_date: Joi.date().iso().greater('now').required(),
    d_destination: Joi.string().min(3),
    e_budget: Joi.number().unsafe().greater(0).required(),
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
