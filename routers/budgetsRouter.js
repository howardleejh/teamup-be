'use strict'

const express = require('express')
const router = express.Router()
const budgetController = require('../controllers/budgetController')

router.get('/users/:userId/', budgetController.budgetList)

router.post('/users/:userId/create', budgetController.createBudgetItem)

router.get('/users/:userId/:itemId', budgetController.budgetItem)

router.get('/users/:userId/:itemId/edit', budgetController.editBudgetItem)

router.patch('/users/:userId/:itemId/update', budgetController.updateBudgetItem)

router.delete(
  '/users/:userId/:itemId/delete',
  budgetController.deleteBudgetItem
)

module.exports = router
