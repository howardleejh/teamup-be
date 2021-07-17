'use strict'

const { findUser } = require('../services/findUser')
const useFeatures = require('../services/guestFeatures')

module.exports = {
  guestList: async (req, res) => {
    let user = await findUser(res.locals.user.email)

    let guestList = await useFeatures.findList(user.couple_id)

    return res.json(guestList)
  },

  guest: async (req, res) => {
    let itemId = req.params.guestId

    let item = await useFeatures.findItem(itemId)

    return res.json(item)
  },

  createGuest: async (req, res) => {
    let userEmail = res.locals.user.email

    let user = null

    try {
      user = await findUser(userEmail)
    } catch (err) {
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

  updateGuest: async (req, res) => {
    let itemId = req.params.guestId

    let updateItem = await useFeatures.updateItem(itemId, req.body)

    if (updateItem !== 'success') {
      return res.json(updateItem)
    }

    return res.json(updateItem)
  },

  deleteGuest: async (req, res) => {
    let itemId = req.params.guestId

    let deleteItem = await useFeatures.deleteItem(itemId)

    if (deleteItem !== 'success') {
      return res.json(deleteItem)
    }

    return res.json(deleteItem)
  },

  loginGuest: async (req, res) => {
    let guest = res.locals.user

    res.json(`${guest.guest_first_name} is logged in`)
  },
}
