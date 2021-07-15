'use strict'

const { UserModel } = require('../models/users')
const {
  registerValidator,
  loginValidator,
} = require('../validatations/userValidate')
const bcrypt = require('bcrypt')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { findUser } = require('../services/findUser')

module.exports = {
  register: async (req, res) => {
    let registerValue = null

    try {
      registerValue = await registerValidator.validateAsync(req.body)
    } catch (err) {
      return res.json(err)
    }

    // generate hash for password

    let hash = ''

    try {
      hash = await bcrypt.hash(registerValue.confirmPassword, 10)
    } catch (err) {
      res.statusCode = 500
      return res.json()
    }

    // check if user exists in DB

    let user = await findUser(registerValue.email)
    let partner = await findUser(registerValue.partner_email)

    if (user || partner) {
      res.statusCode = 409
      return res.json('User or Partner email already exists.')
    }

    let userRole = registerValue.role
    let partnerRole = null

    switch (userRole) {
      case 'groom':
        partnerRole = 'bride'
        break
      case 'bride':
        partnerRole = 'groom'
        break
    }

    let couple_id = uuidv4()

    // creates users account

    try {
      UserModel.insertMany([
        {
          first_name: registerValue.first_name,
          last_name: registerValue.last_name,
          email: registerValue.email,
          partner_first_name: registerValue.partner_first_name,
          partner_last_name: registerValue.partner_last_name,
          partner_email: registerValue.partner_email,
          role: registerValue.role,
          hash: hash,
          d_date: registerValue.d_date,
          e_budget: registerValue.e_budget,
          couple_id: couple_id,
        },
        {
          first_name: registerValue.partner_first_name,
          last_name: registerValue.partner_last_name,
          email: registerValue.partner_email,
          partner_first_name: registerValue.first_name,
          partner_last_name: registerValue.last_name,
          partner_email: registerValue.email,
          role: partnerRole,
          hash: hash,
          d_date: registerValue.d_date,
          e_budget: registerValue.e_budget,
          couple_id: couple_id,
        },
      ])
      res.statusCode = 201
      return res.json()
    } catch (err) {
      res.statusCode = 500
      res.json(err)
    }
  },
  login: async (req, res) => {
    let loginValue = null

    try {
      loginValue = await loginValidator.validateAsync(req.body)
    } catch (err) {
      return res.json(err)
    }

    // find if user exists

    let user = await findUser(loginValue.email)

    if (!user) {
      res.statusCode = 400
      return res.json({
        success: false,
        message: 'Given email or password is incorrect',
      })
    }

    let isPasswordCorrect = false

    try {
      isPasswordCorrect = await bcrypt.compare(loginValue.password, user.hash)
    } catch (err) {
      res.statusCode = 500
      return res.json(err)
    }

    // if password is incorrect

    if (!isPasswordCorrect) {
      res.statusCode = 400
      return res.json({
        success: false,
        message: 'Given email or password is incorrect',
      })
    }

    let expiresAt = moment().add(24, 'hour').toString()

    // generate the JWT and return as response

    let token = jwt.sign(
      {
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
      }
    )

    res.json({
      token: token,
      expiresAt: expiresAt,
    })
  },
  dashboard: async (req, res) => {
    let userEmail = res.locals.user.email

    let user = await findUser(userEmail)

    res.json(`${user.first_name} ${user.last_name} dashboard`)
  },
}
