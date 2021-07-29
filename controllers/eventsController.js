'use strict'

const { findUser } = require('../services/findUser')
const useFeatures = require('../services/eventsFeatures')

module.exports = {
  eventsList: async (req, res) => {
    let user = await findUser(res.locals.user.email)

    let eventsList = await useFeatures.findList(user.couple_id)

    return res.json(eventsList)
  },

  eventItem: async (req, res) => {
    let itemId = req.params.eventId

    let item = await useFeatures.findItem(itemId)

    return res.json(item)
  },

  createEventItem: async (req, res) => {
    let userEmail = res.locals.user.email

    let user = null

    try {
      user = await findUser(userEmail)
    } catch (err) {
      res.statusCode = 500
      return res.json(err)
    }

    let createItem = await useFeatures.createItem(user.couple_id, req.body)

    if (createItem !== 'success') {
      res.statusCode = 500
      return res.json(createItem)
    }
    res.statusCode = 201
    return res.json(createItem)
  },

  updateEventItem: async (req, res) => {
    let itemId = req.params.eventId

    let updateItem = await useFeatures.updateItem(itemId, req.body)

    if (updateItem !== 'success') {
      res.statusCode = 500
      return res.json(updateItem)
    }

    return res.json(updateItem)
  },

  deleteEventItem: async (req, res) => {
    let itemId = req.params.eventId

    let deleteItem = await useFeatures.deleteItem(itemId)

    if (deleteItem !== 'success') {
      res.statusCode = 500
      return res.json(deleteItem)
    }

    return res.json(deleteItem)
  },
}
