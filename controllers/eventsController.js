'use strict'

const { EventItemModel } = require('../models/events')
const jwt = require('jsonwebtoken')

module.exports = {
  eventsList: (req, res) => {
    let user = null

    console.log(req.headers.auth_token)

    user = jwt.verify(req.headers.auth_token, process.env.JWT_SECRET)

    res.json(user.email)
  },

  eventItem: (req, res) => {
    res.json('this is event item')
  },

  createEventItem: (req, res) => {
    res.json('event item is created')
  },

  editEventItem: (req, res) => {
    res.json('event item is edited')
  },

  updateEventItem: (req, res) => {
    res.json('event item is updated')
  },

  deleteEventItem: (req, res) => {
    res.json('event item is deleted')
  },
}
