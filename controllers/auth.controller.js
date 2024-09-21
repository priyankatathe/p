const asyncHandler = require("express-async-handler")
const { checkEmpty } = require("../utils/checkEmpty")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const JWT = require("jsonwebtoken")
const sendEmail = require("../utils/email")
const Tauth = require("../models/Tauth")
// const Auth = require("../models/Auth")


exports.RegisterAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, mobile } = req.body
    const { isError, error } = checkEmpty({ name, email, password, mobile })
    if (isError) {
        return res.status(400).json({ message: "All Feiled Required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: "Provide Strong Password" })
    }
    const isFound = await Tauth.findOne({ email })
    if (isFound) {
        return res.status(400).json({ message: "Email Already registered with us" })
    }
    const hash = await bcrypt.hash(password, 10)
    await Tauth.create({ name, email, password: hash })
    res.json({ message: "Admin Register Success" })
})
exports.LoginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { isError, error } = checkEmpty({ email, password })
    if (isError) {
        return res.status(401).json({ message: "All Fields required" })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "invalid email" : "Invalid Credentials" })
    }
    const isFound = await Tauth.findOne({ email })
    if (!isFound) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "invalid email" : "Invalid Credentials" })
    }
    const isVerify = await bcrypt.compare(password, isFound.password)
    if (!isVerify) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "invalid password" : "Invalid Credentials" })
    }

    // send OTP
    const otp = Math.floor(10000 + Math.random() * 900000)
    await Tauth.findByIdAndUpdate(isFound._id, { otp: otp })
    await sendEmail({
        to: email, subject: `Login OTP`, message: `<h1>Do Not share Your Account OTP</h1>
        <p>Your Login OTP <strong>${otp}</strong> </p>`
    })
    res.json({
        message: "Credentials Verify Success. OTP send to your registered Email", result: {
            _id: isFound._id,
            name: isFound.name,
            email: isFound.email,
            active: isFound.active,
            mobile: isFound.mobile,
        }
    })

})
exports.VerifyOTP = asyncHandler(async (req, res) => {
    const { otp, email } = req.body
    const { isError, error } = checkEmpty({ otp, email })
    if (isError) {
        return res.status(401).json({ message: "All Fields required" })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "invalid email" : "Invalid Credentials" })
    }
    const isFound = await Tauth.findOne({ email })
    if (!isFound) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "invalid email" : "Invalid Credentials" })
    }
    if (otp !== isFound.otp) {
        res.status(401).json({ message: "Invalid OTP" })
    }
    //jWT
    const Token = JWT.sign({ userID: isFound._id }, process.env.JWT_KEY, { expiresIn: "1d" })
    //Cookie
    res.cookie("admin", Token, {
        maxAge: 86400000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    })
    res.json({
        message: "OTP Verify Success.",
    })
})
exports.LogoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("admin")
    res.json({ message: "Admin Login Success" })
})

// table
exports.getAllUser = asyncHandler(async (req, res) => {
    const result = await Tauth.find()
    res.json({ message: "get fetch  Success", result })
})
exports.addUser = asyncHandler(async (req, res) => {
    await Tauth.create(req.body)
    res.json({ message: "add  Success" })
})
exports.updateUser = asyncHandler(async (req, res) => {
    await Tauth.findByIdAndUpdate(req.params.id, req.body)
    res.json({ message: " update Success" })
})
exports.deleteUser = asyncHandler(async (req, res) => {
    await Tauth.findByIdAndDelete(req.params.id)
    res.json({ message: "delete  Success" })
})

