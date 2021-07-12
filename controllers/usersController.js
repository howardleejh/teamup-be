'use strict'

const { UserModel } = require('../models/users')
const {
  registerValidator,
  loginValidator,
} = require('../validatations/userValidate')
const bcrypt = require('bcrypt')
const moment = require('moment')
const jwt = require('jsonwebtoken')

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

    let user = null
    try {
      user = await UserModel.findOne({
        email: registerValue.email,
      })
    } catch (err) {
      res.statusCode = 500
      return res.json()
    }

    if (user) {
      res.statusCode = 409
      return res.json('User already exists.')
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

    let user = null

    try {
      user = await UserModel.findOne({ email: loginValue.email })
    } catch (err) {
      res.statusCode = 500
      return res.json(err)
    }

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

    let expiresAt = moment().add(1, 'hour').toString()

    // generate the JWT and return as response

    let token = jwt.sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    )

    res.json({
      token: token,
      expiresAt: expiresAt,
    })
  },
  dashboard: async (req, res) => {
    let user = null
    try {
      user = await UserModel.findOne({
        _id: req.params.userId,
      })
    } catch (err) {
      res.statusCode = 500
      return res.json()
    }

    res.json(user)
  },
}
