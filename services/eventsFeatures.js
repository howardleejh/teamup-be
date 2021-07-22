'use strict'

const { EventModel } = require('../models/events')
const { createEventValidator } = require('../validatations/eventValidate')
const { googApi } = require('../services/googleApi')

module.exports = {
  findList: async (user) => {
    let list = null
    try {
      list = await EventModel.find({
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
      item = await EventModel.find({
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

    let destination = await googApi(createItemVal.location)

    if (!destination) {
      return destination
    }

    try {
      await EventModel.create({
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

    let destination = await googApi(updateItemVal.location)

    if (!destination) {
      return destination
    }

    try {
      await EventModel.findOneAndUpdate(
        {
          _id: itemId,
        },
        {
          $set: {
            event_name: updateItemVal.event_name,
            from: updateItemVal.from,
            to: updateItemVal.to,
            location: {
              name: destination.data.results[0].name,
              formatted_address: destination.data.results[0].formatted_address,
            },
            description: updateItemVal.description,
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
      await EventModel.findOneAndDelete({
        _id: itemId,
      })
    } catch (err) {
      return err
    }
    return 'success'
  },
}
