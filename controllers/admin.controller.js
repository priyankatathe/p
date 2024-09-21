const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const upload = require('../utils/upload')
// const Order = require('../models/Order')
const BPlace = require('../models/BPlace')

exports.getAllUser = asyncHandler(async (req, res) => {
    const result = await User.find({ role: "customer" })
    res.json({ message: " user fetch successss", result })
})

exports.addUser = asyncHandler(async (req, res) => {
    await User.create(req.body)
    res.json({ message: " user add successss" })
})

exports.updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    await User.findByIdAndUpdate(id, req.body)
    res.json({ message: " user update successss" })
})

exports.deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    await User.findByIdAndDelete(id)
    res.json({ message: " user delete successss" })
})

// upload
exports.getAllProducts = asyncHandler(async (req, res) => {
    const result = await BPlace.find()
    res.json({ message: "Product fetch successss", result })
})
exports.addProducts = asyncHandler(async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ message: "multer error", err })
        }
        if (req.file) {

            await BPlace.create({ ...req.body, image: req.file.filename })
            res.json({ message: "products add success" })
        } else {
            return res.status(400).json({ message: "hero image is required" })
        }
    })

})
exports.updateProducts = asyncHandler(async (req, res) => {
    await BPlace.findByIdAndUpdate(req.params.id, req.body)
    res.json({ message: "Product update successss" })
})
exports.deleteProducts = asyncHandler(async (req, res) => {
    await BPlace.findByIdAndDelete(req.params.id)
    res.json({ message: "Product delete successss" })
})

//order
exports.getAllOrders = asyncHandler(async (req, res) => {
    const result = await Order.find()
    res.json({ message: "Product fetch successss", result })
})

