"use strict"

const express = require("express")
const router = express.Router()
const usersController = require("../controllers/usersController")

router.get("/users/:userId/dashboard", usersController.dashboard)

router.post("/register", usersController.register)

router.post("/login", usersController.login)

module.exports = router
