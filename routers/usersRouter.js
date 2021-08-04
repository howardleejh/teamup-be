'use strict'

const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const guestsController = require('../controllers/guestsController')
const { userAuth, guestAuth } = require('../middlewares/userAuth')

router.get('/users/profile', userAuth, usersController.userProfile)

router.get('/users/dashboard', userAuth, usersController.dashboard)

router.post('/users/date-budget-init', userAuth, usersController.userDataInt)

router.patch(
  '/users/profile/update',
  userAuth,
  usersController.updateUserProfile
)

router.delete('/users/profile/delete', userAuth, usersController.deleteUser)

router.post('/register', usersController.register)

router.post('/login', usersController.login)

router.post('/:userRoute', usersController.newUserPassChange)

module.exports = router
