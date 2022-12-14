const connectToMongo=require('./db')
const express=require('express')
const cors=require('cors')
const app=express()
connectToMongo()

require('dotenv').config()
//taking routes
const auth=require('./routes/auth')
const notes=require('./routes/notes')

app.use(cors())
app.use(express.json())
app.use('/api/auth',auth)
app.use('/api/notes',notes)

app.get('/',(req,res)=>{
    res.send('hello world')
})

app.listen(process.env.PORT,()=>{
    console.log('server is running at http://localhost:5050/')
})