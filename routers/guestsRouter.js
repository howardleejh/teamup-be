'use strict'

const express = require('express')
const router = express.Router()
const guestsController = require('../controllers/guestsController')
const { userAuth, guestAuth } = require('../middlewares/userAuth')

router.get('/', userAuth, guestsController.guestList)

router.post('/create', userAuth, guestsController.createGuest)

router.get('/:guestId', userAuth, guestsController.guest)

router.patch('/:guestId/rsvp', guestsController.guestRsvp)

router.post('/login', guestAuth, guestsController.loginGuest)

router.patch('/:guestId/update', userAuth, guestsController.updateGuest)

router.delete('/:guestId/delete', userAuth, guestsController.deleteGuest)

module.exports = router
