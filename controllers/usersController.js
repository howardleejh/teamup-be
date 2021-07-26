'use strict'

const { UserModel } = require('../models/users')
const { TodoModel } = require('../models/todos')
const { GuestModel } = require('../models/guests')
const { EventModel } = require('../models/events')
const { BudgetModel } = require('../models/budgets')

const {
  userRegisterValidator,
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
const guests = require('../models/guests')

module.exports = {
  register: async (req, res) => {
    let userInput = null

    try {
      userInput = await userRegisterValidator.validateAsync(req.body)
    } catch (err) {
      return res.json(err)
    }

    const user_fullName = userInput.user_fullName.split(' ')
    const user_firstName = user_fullName[0]
    const user_lastName = user_fullName[1]

    const partner_fullName = userInput.partner_fullName.split(' ')
    const partner_firstName = partner_fullName[0]
    const partner_lastName = partner_fullName[1]

    // generate hash for password

    let userHash = randomstring.generate()
    let partnerHash = randomstring.generate()

    // check if user exists in DB

    let user = await findUser(userInput.user_email)
    let partner = await findUser(userInput.partner_email)

    if (user || partner) {
      res.statusCode = 409
      return res.json('User or Partner email already exists.')
    }

    let userRole = userInput.user_role
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

    let userActivateRoute = randomstring.generate(128)
    let partnerActivateRoute = randomstring.generate(128)

    // creates users account

    try {
      await UserModel.insertMany([
        {
          first_name: user_firstName,
          last_name: user_lastName,
          email: userInput.user_email,
          role: userRole,
          hash: userHash,
          couple_id: couple_id,
          active: false,
          activation: userActivateRoute,
        },
        {
          first_name: partner_firstName,
          last_name: partner_lastName,
          email: userInput.partner_email,
          role: partnerRole,
          hash: partnerHash,
          couple_id: couple_id,
          active: false,
          activation: partnerActivateRoute,
        },
      ])
    } catch (err) {
      res.statusCode = 500
      return res.json(err)
    }

    try {
      await sendMail(
        userInput.user_email,
        'Change of Password',
        `http://teamup-fe.herokuapp.com/register/change-password/${userActivateRoute}`
      )
      await sendMail(
        userInput.partner_email,
        'Change of Password',
        `http://teamup-fe.herokuapp.com/register/change-password/${partnerActivateRoute}`
      )
    } catch (err) {
      return res.json(err)
    }
    res.statusCode = 201
    return res.json({
      userRegisterId: userActivateRoute,
      partnerRegisterId: partnerActivateRoute,
      message: 'success',
    })
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
          $unset: {
            activation: '',
          },
        }
      )
      res.json('success')
    } catch (err) {
      res.statusCode = 500
      return res.json(err)
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
      message: 'success',
    })
  },
  dashboard: async (req, res) => {
    let user = await findUser(res.locals.user.email)

    let calendar = {
      now: moment().format(),
      dayOfEvent: moment(user.d_date).format(),
      daysLeft: null,
    }

    calendar.daysLeft = moment(user.d_date).diff(calendar.now, 'days')

    let budget = {
      initialBudget: parseFloat(user.e_budget),
      currentBudget: parseFloat(user.e_budget),
      totalItems: await BudgetModel.countDocuments({
        couple_id: user.couple_id,
      }),
    }

    let budgetItems = null
    try {
      budgetItems = await BudgetModel.find({
        couple_id: user.couple_id,
      })
    } catch (err) {
      return err
    }

    budgetItems.forEach((item) => {
      budget.currentBudget += parseFloat(item.amount)
    })

    let guests = {
      bride: {
        attending: null,
        unavailable: null,
        pending: null,
        total: null,
      },
      groom: {
        attending: null,
        unavailable: null,
        pending: null,
        total: null,
      },
      totalAttending: null,
      totalUnavailable: null,
      totalPending: null,
      totalGuests: null,
    }

    async function calculateGuests(role, status) {
      let guestStatus = await GuestModel.find({
        couple_id: user.couple_id,
        role: role,
        status: status,
      })

      if (guestStatus.length === 0) {
        guests[role][status] = 0
        return
      }
      guestStatus.forEach((item) => {
        guests[role][status] += item.pax
      })
      guests[role].total += guests[role][status]
      guests.totalGuests += guests[role][status]
      guests.totalAttending = guests.bride.attending + guests.groom.attending
      guests.totalUnavailable =
        guests.bride.unavailable + guests.groom.unavailable
      guests.totalPending = guests.bride.pending + guests.groom.pending
    }

    calculateGuests('bride', 'pending')
    calculateGuests('bride', 'unavailable')
    calculateGuests('bride', 'attending')

    calculateGuests('groom', 'pending')
    calculateGuests('groom', 'unavailable')
    calculateGuests('groom', 'attending')

    let todos = {
      inProgress: await TodoModel.countDocuments({
        couple_id: user.couple_id,
        status: false,
      }),
      completed: await TodoModel.countDocuments({
        couple_id: user.couple_id,
        status: true,
      }),
      total: await TodoModel.countDocuments({
        couple_id: user.couple_id,
      }),
    }

    let events = {
      total: await EventModel.countDocuments({
        couple_id: user.couple_id,
      }),
    }

    res.json({
      message: `Welcome ${user.first_name} ${user.last_name}`,
      calendar,
      budget,
      guests,
      todos,
      events,
    })
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
