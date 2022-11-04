const mongoose=require('mongoose')
require('dotenv').config()
const mongoURI=process.env.DB_URL

const connectToMongo= ()=>{
    mongoose.connect(mongoURI,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    },()=>{
        console.log('connected to mongo successfully')  
    })
}

module.exports = connectToMongo