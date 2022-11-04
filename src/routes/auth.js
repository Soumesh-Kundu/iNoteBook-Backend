const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fetchUser = require('../middleware/fetchUser')
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET_TOKEN

//Route: 1 =>
//create user using: POST '/api/auth/createUser' no login require
router.post('/createUser', [
    body('name', 'Enter a Valid Name').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password must be more than 5 Characters').isLength({ min: 5 })
], async (req, res) => {
    //if there are errors then return bad requests and the errors
    let success=false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // check weather the email exists or not
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({success, error: "Sorry but this user already Exists" })
        }
        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPass,
            Date: req.body.date
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        success=true
        res.status(200).json({success, authToken })
    }
    catch (err) {
        console.error(err)
        res.status(500).send("some error occered")
    }
})

//Route: 2 =>
//authenticate user using: POST "/api/auth/login" , no login Required
router.post('/login', [
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password can not be Blank').exists(),
], async (req, res) => {
    let success=false
    //if there are errors then return bad requests and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    }
    const { email, password } = req.body
    try {
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({success, error: "Please try to login with correct Credentials" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status(400).json({ success,error: "Please try to login with correct Credentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        success=true
        const authToken = jwt.sign(data, JWT_SECRET)
        res.status(200).json({ success,authToken })
    }
    catch (err) {
        console.error(err)
        res.status(500).send("some error occered")
    }
})

//Route: 3 =>
//fetching user Credentials using: GET "api/auth/getUser" , login required
router.get('/getUser', fetchUser, async (req, res) => {
    try{
        userId=req.user.id
        const user = await User.findById(userId).select("-password")
        res.status(200).json(user)
    }
    catch(err){
        console.error(err)
        res.status(500).send("some error occered")
    }
})
module.exports = router