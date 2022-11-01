const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: { type: String, requireed: true },
    email: { type: String, requireed: true, unique: true },
    password: { type: String, requireed: true },
    date: { type: Date, default: Date.now }
})
const User=mongoose.model('user',UserSchema)
module.exports =User