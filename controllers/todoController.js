'use strict'

const { TodoModel } = require('../models/todos')
const {
  createToDoValidator,
  createTodoValidator,
} = require('../validatations/todoValidate')
const { findUser } = require('../services/findUser')

module.exports = {
  todoList: async (req, res) => {
    let userEmail = res.locals.user.email

    let user = await findUser(userEmail)

    let todoList = null

    try {
      todoList = await TodoModel.find({
        couple_id: user.couple_id,
      })
    } catch (err) {
      res.statusCode = 500
    }

    if (todoList.length === 0) {
      res.json({
        message: 'there is no items.',
      })
    }

    res.json(todoList)
  },

  todoItem: async (req, res) => {
    let itemId = req.params.itemId

    let item = await TodoModel.findOne({
      _id: itemId,
    })

    res.json(item)
  },

  createTodoItem: async (req, res) => {
    let userEmail = res.locals.user.email

    let user = await findUser(userEmail)

    let createTodoValue = null

    try {
      createTodoValue = await createTodoValidator.validateAsync(req.body)
    } catch (err) {
      return res.json(err)
    }

    console.log(createTodoValue)
    // create todo item

    try {
      await TodoModel.create({
        task: createTodoValue.task,
        status: createTodoValue.status,
        role: createTodoValue.role,
        couple_id: user.couple_id,
      })
      res.statusCode = 201
      return res.json()
    } catch (err) {
      res.statusCode = 500
      res.json(err)
    }
    res.json({ message: 'To-do item created successfully' })
  },

  editTodoItem: async (req, res) => {
    let itemId = req.params.itemId

    let item = await TodoModel.findOne({
      _id: itemId,
    })

    res.json(item)
  },

  updateTodoItem: async (req, res) => {
    let itemId = req.params.itemId

    try {
      await TodoModel.findOneAndUpdate(
        {
          _id: itemId,
        },
        {
          $set: {
            task: req.body.task,
            status: req.body.status,
            role: req.body.role,
          },
        }
      )
    } catch (err) {
      res.statusCode = 500
      res.json(err)
    }

    res.json('To-Do item is updated')
  },

  deleteTodoItem: async (req, res) => {
    let itemId = req.params.itemId

    try {
      await TodoModel.findOneAndDelete({
        _id: itemId,
      })
      return res.json()
    } catch (err) {
      res.statusCode = 500
      res.json()
    }
  },
}
