'use strict'

const { TodoModel } = require('../models/todos')

const { createToDoValidator } = require('../validatations/userValidate')

module.exports = {
  todoList: async (req, res) => {
    let user = req.params.userId

    console.log(req.params.userId)

    let todoList = await TodoModel.find({
      list_owner: user,
    })
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
    let user = req.params.userId

    console.log(req.body)

    console.log(req.params)

    let createTodoValue = null

    // try {
    //   createTodoValue = await createToDoValidator.validateAsync(req.body)
    // } catch (err) {
    //   return res.json(err)
    // }

    // create todo item

    try {
      await TodoModel.create({
        task: req.body.task,
        status: req.body.status,
        role: req.body.role,
        list_owner: user,
      })
      res.statusCode = 201
      return res.json()
    } catch (err) {
      res.statusCode = 500
      res.json(err)
    }
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
