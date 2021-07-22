'use strict'

const { BudgetModel } = require('../models/budgets')
const { createBudgetValidator } = require('../validatations/budgetValidate')

module.exports = {
  findList: async (user) => {
    let list = null
    try {
      list = await BudgetModel.find({
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
      item = await BudgetModel.find({
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
      createItemVal = await createBudgetValidator.validateAsync(input)
    } catch (err) {
      return err
    }

    try {
      await BudgetModel.create({
        item_name: createItemVal.item_name,
        amount: createItemVal.amount,
        payment_type: createItemVal.payment_type,
        category: createItemVal.category,
        status: createItemVal.status,
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
      updateItemVal = await createBudgetValidator.validateAsync(input)
    } catch (err) {
      return err
    }

    try {
      await BudgetModel.findOneAndUpdate(
        {
          _id: itemId,
        },
        {
          $set: {
            item_name: updateItemVal.item_name,
            amount: updateItemVal.amount,
            payment_type: updateItemVal.payment_type,
            category: updateItemVal.category,
            status: updateItemVal.status,
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
      await BudgetModel.findOneAndDelete({
        _id: itemId,
      })
    } catch (err) {
      return err
    }
    return 'success'
  },
}
