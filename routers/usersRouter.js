'use strict'

const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const guestsController = require('../controllers/guestsController')
const { userAuth, guestAuth } = require('../middlewares/userAuth')

router.get('/users/dashboard', userAuth, usersController.dashboard)

router.post('/register', usersController.register)

router.post('/login', usersController.login)

router.post('/guests/login', guestAuth, guestsController.loginGuest)

module.exports = router
