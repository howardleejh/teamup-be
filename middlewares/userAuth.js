'use strict'

const jwt = require('jsonwebtoken')

module.exports = {
  userAuth: (req, res, next) => {
    let authToken = req.headers.auth_token

    if (!authToken || authToken === null) {
      res.statusCode = 401
      res.json({
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
}
