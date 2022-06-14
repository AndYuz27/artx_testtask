// тест
const express = require('express');
const serverRouter = require("./server/routes/mRoute");
// const dbRouter = require("./server/routes/dbRouter");
const rateLimit = require("express-rate-limit")
const fetch = require('node-fetch')
const redis = require('redis')
const port = process.env.PORT || 3000;
const REDIS_PORT = process.env.PORT || 6379
const client = redis.createClient(REDIS_PORT)
const app = express();
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const uuid = require('uuid')
const uniqID = uuid.v4()
const authRouter = require('./authRouter')

async function start(){
    try{
        await mongoose.connect(`mongodb+srv://andy:andy@cluster0.laxisfk.mongodb.net/?retryWrites=true&w=majority`)
        app.listen(port, () => console.log('Server is started on port ', port))
    }catch(e){
        console.log(e)
    }
}
start()