const connectToMongo=require('./db')
const express=require('express')
const app=express()
connectToMongo()

//taking routes
const auth=require('./routes/auth')
const notes=require('./routes/notes')

app.use(express.json())
app.use('/api/auth',auth)
app.use('/api/notes',notes)

app.get('/',(req,res)=>{
    res.send('hello world')
})

app.listen(5050,()=>{
    console.log('server is running at http://localhost:5050/')
})