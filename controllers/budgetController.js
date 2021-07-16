'use strict'

const { BudgetItemModel } = require('../models/budgets')
const { createBudgetValidator } = require('../validatations/budgetValidate')
const { findUser } = require('../services/findUser')

module.exports = {
  budgetList: async (req, res) => {
    let userEmail = res.locals.user.email

    let user = await findUser(userEmail)

    let budgetList = null

    try {
      budgetList = await BudgetItemModel.find({
        couple_id: user.couple_id,
      })
    } catch (err) {
      res.statusCode = 500
    }

    if (budgetList.length === 0) {
      res.json({
        message: 'there is no items.',
      })
    }

    res.json(budgetList)
  },

  budgetItem: (req, res) => {
    res.json('this is budget item')
  },

  createBudgetItem: (req, res) => {
    res.json('budget item is created')
  },

  editBudgetItem: (req, res) => {
    res.json('budget item is edited')
  },

  updateBudgetItem: (req, res) => {
    res.json('budget item is updated')
  },

  deleteBudgetItem: (req, res) => {
    res.json('budget item is deleted')
  },
}
