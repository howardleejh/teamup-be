'use strict'

const { TodoModel } = require('../models/todos')
const { createTodoValidator } = require('../validatations/todoValidate')

module.exports = {
  findList: async (user) => {
    let list = null
    try {
      list = await TodoModel.find({
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
      item = await TodoModel.find({
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
      createItemVal = await createTodoValidator.validateAsync(input)
    } catch (err) {
      return err
    }

    try {
      await TodoModel.create({
        task: createItemVal.task,
        status: createItemVal.status,
        role: createItemVal.role,
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
      updateItemVal = await createTodoValidator.validateAsync(input)
    } catch (err) {
      return err
    }

    try {
      await TodoModel.findOneAndUpdate(
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
      await TodoModel.findOneAndDelete({
        _id: itemId,
      })
    } catch (err) {
      return err
    }
    return 'success'
  },
}
