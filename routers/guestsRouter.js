'use strict'

const express = require('express')
const router = express.Router()
const guestsController = require('../controllers/guestsController')

router.get('/', guestsController.guestList)

router.post('/create', guestsController.createGuest)

router.get('/:guestId', guestsController.guest)

router.get('/:guestId/edit', guestsController.editGuest)

router.patch('/:guestId/update', guestsController.updateGuest)

router.delete('/:guestId/delete', guestsController.deleteGuest)

module.exports = router
