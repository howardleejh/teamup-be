'use strict'

const jwt = require('jsonwebtoken')
const { GuestModel } = require('../models/guests')

module.exports = {
  userAuth: (req, res, next) => {
    let authToken = req.headers.auth_token

    if (!authToken || authToken === null) {
      res.statusCode = 401
      return res.json({
        message: 'no authentication token found',
      })
    }

    let user = null

    try {
      user = jwt.verify(req.headers.auth_token, process.env.JWT_SECRET)
    } catch (err) {
      res.statusCode = 403
      return res.json({
        message: 'unable to verify token',
      })
    }

    res.locals.user = user

    next()
  },
  guestAuth: async (req, res, next) => {
    let guestAuth = req.body.guest_contact

    if (!guestAuth || guestAuth === null) {
      res.statusCode = 401
      return res.json({
        message: 'no guest authentication found',
      })
    }

    let guest = null

    try {
      guest = await GuestModel.findOne({
        guest_contact: req.body.guest_contact,
      })
    } catch (err) {
      return err
    }

    if (!guest) {
      res.status = 403
      return res.json({
        message: 'guest is not authenticated',
      })
    }
    res.locals.user = guest
    next()
  },
}
