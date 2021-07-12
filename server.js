'use strict'

// =====================================
//           Dependencies
// =====================================
require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

// =====================================
//              Routers
// =====================================

const usersRouter = require('./routers/usersRouter')
const budgetRouter = require('./routers/budgetsRouter')
const todosRouter = require('./routers/todosRouter')
const eventsRouter = require('./routers/eventsRouter')
const guestsRouter = require('./routers/guestsRouter')

const app = express()
const port = 3000

// =====================================
//          Using Middleware
// =====================================

// setting middleware to accept json and urlencoded request body

app.use(express.json())
app.use(
  express.urlencoded({
    extended: true,
  })
)

const { adminAccess } = require('./middlewares/admin_auth_middleware')

// =====================================
//               Routes
// =====================================

app.use('/api/v1', usersRouter)

app.use('/api/v1/users/:userId/events', adminAccess, eventsRouter)

app.use('/api/v1/users/:userId/todo', adminAccess, todosRouter)

app.use('/api/v1/users/:userId/budget', adminAccess, budgetRouter)

app.use('/api/v1/users/:userId/guests', adminAccess, guestsRouter)

// =====================================
//         Initialize MongoDB
// =====================================

mongoose.set('useCreateIndex', true)

mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  }
)

const db = mongoose.connection

// Once DB Connection is successfully established, do something

db.once('open', () => {
  console.log('MongoDB connection successful')

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
})

db.on('error', () => {
  console.log('MongoDB connection failed')
})
