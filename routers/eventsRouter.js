'use strict'

const express = require('express')
const router = express.Router()
const eventsController = require('../controllers/eventsController')

router.get('/users/:userId/', eventsController.eventsList)

router.post('/users/:userId/create', eventsController.createEventItem)

router.get('/users/:userId/:itemId', eventsController.eventItem)

router.get('/users/:userId/:itemId/edit', eventsController.editEventItem)

router.patch('/users/:userId/:itemId/update', eventsController.updateEventItem)

router.delete('/users/:userId/:itemId/delete', eventsController.deleteEventItem)

module.exports = router
