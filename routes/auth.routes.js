const router = require("express").Router()

const authController = require("./../controllers/auth.controller")

router
    .post("/register-admin", authController.RegisterAdmin)
    .post("/login-admin", authController.LoginAdmin)
    .post("/logout-admin", authController.LogoutAdmin)
    .post("/verifyAdminOTP", authController.VerifyOTP)

    .post("/", authController.getAllUser)
    .post("/add", authController.addUser)
    .post("/update", authController.updateUser)
    .post("/delete", authController.deleteUser)

module.exports = router

