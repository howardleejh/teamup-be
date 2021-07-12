'use strict'

const { EventItemModel } = require('../models/events')

module.exports = {
  eventsList: (req, res) => {
    res.json('this is event list')
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
