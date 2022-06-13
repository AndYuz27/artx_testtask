
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
function setRes(username, repos){
    return `<h2>${username} has ${repos} Github repos</h2>`
}

async function getRepos(req, res, next) {
    try{
        console.log("Fetching Data")
        const {username} = req.params;
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        const repos = data.public_repos;
        client.setEx(username, 3600, repos)
        

        res.send(setRes(username, repos))
    
    
    }catch(err){
    
        console.error(err)
        res.status(500)
    }
}
//Установите ограничение скорости по ip до 100 запросов в час.
const limiter = rateLimit({
    windowMS: 20, //15 мин
    max: 100, //ограничение по IP за 100 req
    message: 'Превышен лимит' // сообщение по преодолению лимита
    
}
)

app.get("/",limiter, (req, res) => {
    res.send("<h1>Dream Clothes</h1>")
});
app.get('/repos/:username', getRepos)
app.set("views", "./server/views");
app.set("view engine", "pug");

app.get('/api',limiter, (req, res) =>{
    res.json({
        message: 'Welcome to the API'
    })
})
app.post('/api/posts', (req, res)=> {
    res.json({
        message: 'Post created...'
    })

})
app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        username: 'Andy',
        email: 'aaaand@mail.ru'
    }
    jwt.sign({user: user}, 'secretkey', (err, token) => {
        res.json({
            token
        })
        console.log(res)
    })
})


app.use(express.static("./public"));

app.use("/", serverRouter);



app.listen(port);
console.log('Всячина\n',app,'\n сервер работает на ', port, 'порте')