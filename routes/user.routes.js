const router = require("express").Router()

const authController = require("./../controllers/user.controller")

router
    .post("/register", authController.RegisterUser)
    .post("/login", authController.LoginUser)

module.exports = router

