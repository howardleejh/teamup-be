'use strict'

const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todoController')

router.get('/users/:userId', todoController.todoList)

router.post('/create', todoController.createTodoItem)

router.get('/:itemId', todoController.todoItem)

router.get('/:itemId/edit', todoController.editTodoItem)

router.patch('/:itemId/update', todoController.updateTodoItem)

router.delete('/:itemId/delete', todoController.deleteTodoItem)

module.exports = router
