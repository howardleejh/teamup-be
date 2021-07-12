'use strict'

const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const { adminAccess } = require('../middlewares/admin_auth_middleware')

router.get('/users/:userId/dashboard', adminAccess, usersController.dashboard)

router.post('/register', usersController.register)

router.post('/login', usersController.login)

module.exports = router
