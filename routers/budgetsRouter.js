'use strict'

const express = require('express')
const router = express.Router()
const budgetController = require('../controllers/budgetController')
const { userAuth } = require('../middlewares/userAuth')

router.get('/', userAuth, budgetController.budgetList)

router.post('/create', userAuth, budgetController.createBudgetItem)

router.get('/:budgetId', userAuth, budgetController.budgetItem)

router.patch('/:budgetId/update', userAuth, budgetController.updateBudgetItem)

router.delete('/:budgetId/delete', userAuth, budgetController.deleteBudgetItem)

module.exports = router
