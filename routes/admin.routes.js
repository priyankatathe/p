const router = require("express").Router()

const adminController = require("./../controllers/admin.controller")

router
    .get("/users", adminController.getAllUser)
    .post("/new-user", adminController.addUser)
    .put("/update-user/:id", adminController.updateUser)
    .delete("/delete-user/:id", adminController.deleteUser)


    .get("/products", adminController.getAllProducts)
    .post("/new-product", adminController.addProducts)
    .put("/update-product/:id", adminController.updateProducts)
    .delete("/delete-product/:id", adminController.deleteProducts)

    .get("/order", adminController.getAllOrders)




module.exports = router