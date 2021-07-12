'use strict'

const { BudgetItemModel } = require('../models/budgets')

module.exports = {
  budgetList: (req, res) => {
    res.json('this is budget list')
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
