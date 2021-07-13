'use strict'

const express = require('express')
const router = express.Router()
const guestsController = require('../controllers/guestsController')

router.get('/users/:userId/', guestsController.guestList)

router.post('/users/:userId/create', guestsController.createGuest)

router.get('/users/:userId/:guestId', guestsController.guest)

router.get('/users/:userId/:guestId/edit', guestsController.editGuest)

router.patch('/users/:userId/:guestId/update', guestsController.updateGuest)

router.delete('/users/:userId/:guestId/delete', guestsController.deleteGuest)

module.exports = router
