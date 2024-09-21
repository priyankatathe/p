const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String, required: true },
    price: { type: Number, required: true },
    place: { type: String, required: true },
    image: { type: String, required: true },
})

module.exports = mongoose.model("bplace", productSchema)