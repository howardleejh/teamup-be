'use strict'

const { UserModel } = require('../models/users')

module.exports = {
  findUser: async (userEmail) => {
    try {
      let user = await UserModel.findOne({
        email: userEmail,
      })
      return user
    } catch (err) {
      res.statusCode = 500
      return res.json({
        message: 'no user found',
      })
    }
  },
}
