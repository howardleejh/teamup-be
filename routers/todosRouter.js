'use strict'

const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todoController')

router.get('/users/:userId/', todoController.todoList)

router.post('/users/:userId/create', todoController.createTodoItem)

router.get('/users/:userId/:itemId', todoController.todoItem)

router.get('/users/:userId/:itemId/edit', todoController.editTodoItem)

router.patch('/users/:userId/:itemId/update', todoController.updateTodoItem)

router.delete('/users/:userId/:itemId/delete', todoController.deleteTodoItem)

module.exports = router
