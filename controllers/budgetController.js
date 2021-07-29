'use strict'

const { findUser } = require('../services/findUser')
const useFeatures = require('../services/budgetFeatures')

module.exports = {
  budgetList: async (req, res) => {
    let user = await findUser(res.locals.user.email)

    let budgetList = await useFeatures.findList(user.couple_id)

    return res.json(budgetList)
  },

  budgetItem: async (req, res) => {
    let itemId = req.params.budgetId

    let item = await useFeatures.findItem(itemId)

    return res.json(item)
  },

  createBudgetItem: async (req, res) => {
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

  updateBudgetItem: async (req, res) => {
    let itemId = req.params.budgetId

    let updateItem = await useFeatures.updateItem(itemId, req.body)

    if (updateItem !== 'success') {
      res.statusCode = 500
      return res.json(updateItem)
    }

    return res.json(updateItem)
  },

  deleteBudgetItem: async (req, res) => {
    let itemId = req.params.budgetId

    let deleteItem = await useFeatures.deleteItem(itemId)

    if (deleteItem !== 'success') {
      res.statusCode = 500
      return res.json(deleteItem)
    }

    return res.json(deleteItem)
  },
}
