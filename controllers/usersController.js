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
const randomstring = require('randomstring')
const { sendMail } = require('../services/emailService')

module.exports = {
  register: async (req, res) => {
    let userInput = null

    try {
      userInput = await userRegisterValidator.validateAsync(req.body)
    } catch (err) {
      return res.json(err)
    }

    const fullName = userInput.fullName.split(' ')
    const firstName = fullName[0]
    const lastName = fullName[1]

    // generate hash for password

    let hash = ''

    try {
      hash = await bcrypt.hash(randomstring.generate(), 10)
    } catch (err) {
      res.statusCode = 500
      return res.json(err)
    }

    // check if user exists in DB

    let user = await findUser(userInput.email)

    if (user) {
      res.statusCode = 409
      return res.json('User email already exists.')
    }

    let couple_id = uuidv4()

    let userQuery = randomstring.generate(128)

    // creates users account

    try {
      UserModel.create({
        first_name: firstName,
        last_name: lastName,
        email: userInput.email,
        role: userInput.role,
        hash: hash,
        couple_id: couple_id,
        active: false,
        activation: userQuery,
      })
    } catch (err) {
      res.statusCode = 500
      return res.json(err)
    }

    try {
      sendMail(
        'vault2howard@gmail.com',
        'Change of Password',
        `Please click on the following link to change your password immediately: 
        
        http://localhost:3000/api/v1/pass/${userQuery}`
      )
    } catch (err) {
      return res.json(err)
    }
    res.statusCode = 201
    return res.json('success')
  },
  newUserPassChange: async (req, res) => {
    let userId = req.params.userRoute
    let password = req.body.password
    let confirmPass = req.body.confirmPass

    if (password !== confirmPass) {
      return res.json('password does not match.')
    }

    let user = null

    try {
      user = await UserModel.findOne({
        activation: userId,
      })
    } catch (err) {
      res.statusCode = 404
      return res.json(err)
    }

    if (user.active) {
      res.statusCode = 503
      return res.json('user account has already been activated.')
    }

    // generate hash for Password

    let hash = ''

    try {
      hash = await bcrypt.hash(confirmPass, 10)
    } catch (err) {
      res.statusCode = 500
      return res.json()
    }

    try {
      await UserModel.findOneAndUpdate(
        {
          email: user.email,
        },
        {
          $set: {
            hash: hash,
            active: true,
          },
        }
      )
      res.json('success')
    } catch (err) {
      res.statusCode = 500
      return res.json(err)
    }
  },
  registerPartner: async (req, res) => {
    let user = await findUser(res.locals.user.email)

    const fullName = req.body.fullName.split(' ')
    const firstName = fullName[0]
    const lastName = fullName[1]

    // generate hash for password

    let hash = ''

    try {
      hash = await bcrypt.hash(randomstring.generate(), 10)
    } catch (err) {
      res.statusCode = 500
      return res.json()
    }

    // check if partner exists in DB

    let partner = await findUser(req.body.email)

    if (partner) {
      res.statusCode = 409
      return res.json('Partner email already exists.')
    }

    let userRole = user.role
    let partnerRole = null

    switch (userRole) {
      case 'groom':
        partnerRole = 'bride'
        break
      case 'bride':
        partnerRole = 'groom'
        break
    }

    let couple_id = user.couple_id

    let userQuery = randomstring.generate(128)

    // // creates users account

    try {
      UserModel.create({
        first_name: firstName,
        last_name: lastName,
        email: req.body.email,
        role: partnerRole,
        hash: hash,
        couple_id: couple_id,
        active: false,
        activation: userQuery,
      })
    } catch (err) {
      res.statusCode = 500
      return res.json(err)
    }

    try {
      sendMail(
        'vault2howard@gmail.com',
        'Change of Password',
        `Please click on the following link to change your password immediately:

        http://localhost:3000/api/v1/${userQuery}`
      )
    } catch (err) {
      return res.json(err)
    }
    res.statusCode = 201
    return res.json('success')
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
      message: 'success',
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
      try {
        let response = await googApi(req.body.d_destination)

        newDestination = {
          name: response.data.results[0].name,
          formatted_address: response.data.results[0].formatted_address,
        }
      } catch (err) {
        return err
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
          },
        }
      )
    } catch (err) {
      res.statusCode = 500
      return err
    }

    try {
      await UserModel.updateMany(
        {
          couple_id: user.couple_id,
        },
        {
          $set: {
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
      return res.json(err)
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
