'use strict'

const { GuestModel } = require('../models/guests')
const { createGuestValidator } = require('../validatations/guestValidate')

module.exports = {
  findList: async (user) => {
    let list = null
    try {
      list = await GuestModel.find({
        couple_id: user,
      })
    } catch (err) {
      return err
    }

    return list
  },
  findItem: async (itemId) => {
    let item = null
    try {
      item = await GuestModel.find({
        _id: itemId,
      })
    } catch (err) {
      return err
    }

    return item
  },
  createItem: async (user, input) => {
    let createItemVal = null

    try {
      createItemVal = await createGuestValidator.validateAsync(input)
    } catch (err) {
      return err
    }

    try {
      await GuestModel.create({
        guest_first_name: createItemVal.guest_first_name,
        guest_last_name: createItemVal.guest_last_name,
        guest_contact: createItemVal.guest_contact,
        role: createItemVal.role,
        status: createItemVal.status,
        pax: createItemVal.pax,
        couple_id: user,
      })
    } catch (err) {
      return err
    }
    return 'success'
  },
  updateItem: async (itemId, input) => {
    let updateItemVal = null

    try {
      updateItemVal = await createGuestValidator.validateAsync(input)
    } catch (err) {
      return err
    }

    try {
      await GuestModel.findOneAndUpdate(
        {
          _id: itemId,
        },
        {
          $set: {
            guest_first_name: updateItemVal.guest_first_name,
            guest_last_name: updateItemVal.guest_last_name,
            guest_contact: updateItemVal.guest_contact,
            role: updateItemVal.role,
            status: updateItemVal.status,
            pax: updateItemVal.pax,
          },
        }
      )
    } catch (err) {
      return err
    }

    return 'success'
  },
  deleteItem: async (itemId) => {
    try {
      await GuestModel.findOneAndDelete({
        _id: itemId,
      })
    } catch (err) {
      return err
    }
    return 'success'
  },
}
