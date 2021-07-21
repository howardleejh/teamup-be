'use strict'

const { UserModel } = require('../models/users')
const {
  userRegisterValidator,
  partnerRegisterValidator,
  loginValidator,
} = require('../validatations/userValidate')
const bcrypt = require('bcrypt')
const moment = require('moment')
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid')
const { findUser } = require('../services/findUser')
const { googApi } = require('../services/googleApi')

module.exports = {
  register: async (req, res) => {
    let userRegisterValue = null

    try {
      userRegisterValue = await userRegisterValidator.validateAsync(req.body)
    } catch (err) {
      return res.json(err)
    }

    // generate hash for password

    let hash = ''

    try {
      hash = await bcrypt.hash(userRegisterValue.confirmPassword, 10)
    } catch (err) {
      res.statusCode = 500
      return res.json()
    }

    // check if user exists in DB

    let user = await findUser(userRegisterValue.email)

    if (user) {
      res.statusCode = 409
      return res.json('User email already exists.')
    }

    let couple_id = uuidv4()

    // creates users account

    try {
      UserModel.create({
        first_name: userRegisterValue.first_name,
        last_name: userRegisterValue.last_name,
        email: userRegisterValue.email,
        role: userRegisterValue.role,
        hash: hash,
        couple_id: couple_id,
      })
      res.statusCode = 201
      return res.json('success')
    } catch (err) {
      res.statusCode = 500
      res.json(err)
    }
  },
  registerPartner: async (req, res) => {
    let partnerRegisterValue = null

    try {
      partnerRegisterValue = await registerValidator.validateAsync(req.body)
    } catch (err) {
      return res.json(err)
    }

    // // generate hash for password

    // let hash = ''

    // try {
    //   hash = await bcrypt.hash(partnerRegisterValue.confirmPassword, 10)
    // } catch (err) {
    //   res.statusCode = 500
    //   return res.json()
    // }

    // check if user exists in DB

    let user = await findUser(partnerRegisterValue.email)
    let partner = await findUser(partnerRegisterValue.partner_email)

    if (user || partner) {
      res.statusCode = 409
      return res.json('User or Partner email already exists.')
    }

    let userRole = partnerRegisterValue.role
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

    let destination = await googApi(userRegisterValue.d_destination)

    if (!destination) {
      return res.json(destination)
    }

    // creates users account

    try {
      UserModel.insertMany([
        {
          first_name: userRegisterValue.first_name,
          last_name: userRegisterValue.last_name,
          email: userRegisterValue.email,
          partner_first_name: userRegisterValue.partner_first_name,
          partner_last_name: userRegisterValue.partner_last_name,
          partner_email: userRegisterValue.partner_email,
          role: userRegisterValue.role,
          hash: hash,
          d_date: userRegisterValue.d_date,
          d_destination: {
            name: destination.data.results[0].name,
            formatted_address: destination.data.results[0].formatted_address,
          },
          e_budget: userRegisterValue.e_budget,
          couple_id: couple_id,
        },
        {
          first_name: userRegisterValue.partner_first_name,
          last_name: userRegisterValue.partner_last_name,
          email: userRegisterValue.partner_email,
          partner_first_name: userRegisterValue.first_name,
          partner_last_name: userRegisterValue.last_name,
          partner_email: userRegisterValue.email,
          role: partnerRole,
          hash: hash,
          d_date: userRegisterValue.d_date,
          d_destination: {
            name: destination.data.results[0].name,
            formatted_address: destination.data.results[0].formatted_address,
          },
          e_budget: userRegisterValue.e_budget,
          couple_id: couple_id,
        },
      ])
      res.statusCode = 201
      return res.json('success')
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
    let user = await findUser(res.locals.user.email)

    res.json(`${user.first_name} ${user.last_name} dashboard`)
  },
  userProfile: async (req, res) => {
    let user = await findUser(res.locals.user.email)

    if (!user) {
      res.statusCode = 500
      return res.json()
    }

    res.json(user)
  },
  updateUserProfile: async (req, res) => {
    let user = await findUser(res.locals.user.email)

    let newHash = null

    if (req.body.password.length === 0) {
      newHash = user.hash
    } else {
      try {
        newHash = await bcrypt.hash(req.body.password, 10)
      } catch (err) {
        return err
      }
    }

    let newDestination = null

    if (!req.body.d_destination || req.body.d_destination === null) {
      newDestination = {
        name: user.d_destination.name,
        formatted_address: user.d_destination.formatted_address,
      }
    } else {
      let response = await googApi(req.body.d_destination)

      newDestination = {
        name: response.data.results[0].name,
        formatted_address: response.data.results[0].formatted_address,
      }
    }

    try {
      await UserModel.findOneAndUpdate(
        {
          email: user.email,
        },
        {
          $set: {
            first_name: req.body.first_name || user.first_name,
            last_name: req.body.last_name || user.last_name,
            email: req.body.email || user.email,
            hash: newHash,
            d_date: req.body.d_date || user.d_date,
            d_destination: {
              name: newDestination.name,
              formatted_address: newDestination.formatted_address,
            },
            e_budget: req.body.e_budget || user.e_budget,
          },
        }
      )
    } catch (err) {
      res.statusCode = 500
      res.json(err)
    }

    return res.json('success')
  },
  deleteUser: async (req, res) => {
    let user = await findUser(res.locals.user.email)
    let deleteBothUsers = false

    if (!req.body.deleteBothUsers || req.body.deleteBothUsers === null) {
      deleteBothUsers = false
    } else {
      deleteBothUsers = true
    }

    if (deleteBothUsers) {
      try {
        await UserModel.deleteMany({
          couple_id: user.couple_id,
        })
      } catch (err) {
        res.statusCode = 500
        return res.json(err)
      }
      res.statusCode = 204
      return res.json()
    }

    try {
      await UserModel.findOneAndDelete({
        email: user.email,
      })
    } catch (err) {
      res.statusCode = 500
      return res.json(err)
    }

    res.statusCode = 204
    res.json()
  },
}
