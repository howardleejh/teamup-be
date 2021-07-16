'use strict'

const express = require('express')
const router = express.Router()
const todoController = require('../controllers/todoController')
const { userAuth } = require('../middlewares/userAuth')

router.get('/', userAuth, todoController.todoList)

router.post('/create', userAuth, todoController.createTodoItem)

router.get('/:todoId', userAuth, todoController.todoItem)

router.patch('/:todoId/update', userAuth, todoController.updateTodoItem)

router.delete('/:todoId/delete', userAuth, todoController.deleteTodoItem)

module.exports = router
