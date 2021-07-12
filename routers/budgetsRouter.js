'use strict'

const express = require('express')
const router = express.Router()
const budgetController = require('../controllers/budgetController')

router.get('/', budgetController.budgetList)

router.post('/create', budgetController.createBudgetItem)

router.get('/:itemId', budgetController.budgetItem)

router.get('/:itemId/edit', budgetController.editBudgetItem)

router.patch('/:itemId/update', budgetController.updateBudgetItem)

router.delete('/:itemId/delete', budgetController.deleteBudgetItem)

module.exports = router
