'use strict'

const express = require('express')
const router = express.Router()
const eventsController = require('../controllers/eventsController')

router.get('/', eventsController.eventsList)

router.post('/create', eventsController.createEventItem)

router.get('/:itemId', eventsController.eventItem)

router.get('/:itemId/edit', eventsController.editEventItem)

router.patch('/:itemId/update', eventsController.updateEventItem)

router.delete('/:itemId/delete', eventsController.deleteEventItem)

module.exports = router
