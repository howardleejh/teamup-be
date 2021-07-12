'use strict'

module.exports = {
  adminAccess: (req, res, next) => {
    const apiToken = process.env.API_TOKEN

    if (req.query.API_TOKEN !== apiToken) {
      res.statusCode = 401
      res.json()
      return
    }

    next()
  },
}
