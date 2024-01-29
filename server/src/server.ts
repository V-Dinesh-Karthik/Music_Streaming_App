import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from "mongoose";

dotenv.config({path: './.env'})

const app = express()
const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI)

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB!')
})

mongoose.connection.on('disconnected',() => {
    console.log('Disconnected to MongoDB!')
})

mongoose.connection.on('error', err => {
    console.log('Error Connecting to MongoDB!')
    console.log(err)
})

app.use(cors())
app.use(express.json())

app.get('/', (req,res) => {
    res.status(200).send('Hello World!')
})

app.get('/hi',(req,res) => {
    res.send('HIIIIIIII')
})

app.listen(PORT,() => {
    console.log(`App is listening on port ${PORT}`)
})
