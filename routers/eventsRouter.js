'use strict'

const express = require('express')
const router = express.Router()
const eventsController = require('../controllers/eventsController')
const { userAuth } = require('../middlewares/userAuth')

router.get('/', userAuth, eventsController.eventsList)

router.post('/create', userAuth, eventsController.createEventItem)

router.get('/:eventId', userAuth, eventsController.eventItem)

router.patch('/:eventId/update', userAuth, eventsController.updateEventItem)

router.delete('/:eventId/delete', userAuth, eventsController.deleteEventItem)

module.exports = router
