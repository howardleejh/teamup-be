'use strict'

const { GuestModel } = require('../models/guests')

module.exports = {
  guestList: (req, res) => {
    res.json('this is guest list')
  },

  guest: (req, res) => {
    res.json('this is a guest')
  },

  createGuest: (req, res) => {
    res.json('guest is created')
  },

  editGuest: (req, res) => {
    res.json('guest is edited')
  },

  updateGuest: (req, res) => {
    res.json('guest is updated')
  },

  deleteGuest: (req, res) => {
    res.json('guest is deleted')
  },
}
