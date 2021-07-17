'use strict'

const { EventItemModel } = require('../models/events')
const { createEventValidator } = require('../validatations/eventValidate')

module.exports = {
  findList: async (user) => {
    let list = null
    try {
      list = await EventItemModel.find({
        couple_id: user,
      })
    } catch (err) {
      return err
    }

    if (list.length === 0) {
      return 'there are no items in the list'
    }

    return list
  },
  findItem: async (itemId) => {
    let item = null
    try {
      item = await EventItemModel.find({
        _id: itemId,
      })
    } catch (err) {
      return err
    }

    if (!item) {
      return 'there is no item available'
    }

    return item
  },
  createItem: async (user, input) => {
    let createItemVal = null

    try {
      createItemVal = await createEventValidator.validateAsync(input)
    } catch (err) {
      return err
    }

    let destination = null

    try {
      destination = await axios.get(
        'https://maps.googleapis.com/maps/api/place/textsearch/json',
        {
          params: {
            query: registerValue.d_destination,
            key: process.env.GOOG_API,
          },
        }
      )
    } catch (err) {
      return res.json(err)
    }

    try {
      await EventItemModel.create({
        event_name: createItemVal.event_name,
        from: createItemVal.from,
        to: createItemVal.to,
        location: {
          name: destination.data.results[0].name,
          formatted_address: destination.data.results[0].formatted_address,
        },
        description: createItemVal.description,
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
      updateItemVal = await createEventValidator.validateAsync(input)
    } catch (err) {
      return err
    }

    try {
      await EventItemModel.findOneAndUpdate(
        {
          _id: itemId,
        },
        {
          $set: {
            task: updateItemVal.task,
            status: updateItemVal.status,
            role: updateItemVal.role,
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
      await EventItemModel.findOneAndDelete({
        _id: itemId,
      })
    } catch (err) {
      return err
    }
    return 'success'
  },
}
