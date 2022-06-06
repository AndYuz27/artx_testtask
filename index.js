
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

app.get('/repos/:username', getRepos)
app.set("views", "./server/views");
app.set("view engine", "pug");

app.get('/api', (req, res) =>{
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
// app.use("/api", dbRouter);






// function AccessLogger(n, t, blockTime) {
//     this.qty = n;
//     this.time = t;
//     this.blockTime = blockTime;
//     this.requests = {};
//     // schedule cleanup on a regular interval (every 30 minutes)
//     this.interval = setInterval(this.age.bind(this), 30 * 60 * 1000);
// }

// AccessLogger.prototype = {
//     check: function(ip) {
//         var info, accessTimes, now, limit, cnt;

//         // add this access
//         this.add(ip);

//         // should always be an info here because we just added it
//         info = this.requests[ip];
//         accessTimes = info.accessTimes;

//         // calc time limits
//         now = Date.now();
//         limit = now - this.time;

//         // short circuit if already blocking this ip
//         if (info.blockUntil >= now) {
//             return false;
//         }

//         // short circuit an access that has not even had max qty accesses yet
//         if (accessTimes.length < this.qty) {
//             return true;
//         }
//         cnt = 0;
//         for (var i = accessTimes.length - 1; i >= 0; i--) {
//             if (accessTimes[i] > limit) {
//                 ++cnt;
//             } else {
//                 // assumes cnts are in time order so no need to look any more
//                 break;
//             }
//         }
//         if (cnt > this.qty) {
//             // block from now until now + this.blockTime
//             info.blockUntil = now + this.blockTime;
//             return false;
//         } else {
//             return true;
//         }

//     },
//     add: function(ip) {
//         var info = this.requests[ip];
//         if (!info) {
//             info = {accessTimes: [], blockUntil: 0};
//             this.requests[ip] = info;
//         }
//         // push this access time into the access array for this IP
//         info.accessTimes.push[Date.now()];
//     },
//     age: function() {
//         // clean up any accesses that have not been here within this.time and are not currently blocked
//         var ip, info, accessTimes, now = Date.now(), limit = now - this.time, index;
//         for (ip in this.requests) {
//             if (this.requests.hasOwnProperty(ip)) {
//                 info = this.requests[ip];
//                 accessTimes = info.accessTimes;
//                 // if not currently blocking this one
//                 if (info.blockUntil < now) {
//                     // if newest access is older than time limit, then nuke the whole item
//                     if (!accessTimes.length || accessTimes[accessTimes.length - 1] < limit) {
//                         delete this.requests[ip];
//                     } else {
//                         // in case an ip is regularly visiting so its recent access is never old
//                         // we must age out older access times to keep them from 
//                         // accumulating forever
//                         if (accessTimes.length > (this.qty * 2) && accessTimes[0] < limit) {
//                             index = 0;
//                             for (var i = 1; i < accessTimes.length; i++) {
//                                 if (accessTimes[i] < limit) {
//                                     index = i;
//                                 } else {
//                                     break;
//                                 }
//                             }
//                             // remove index + 1 old access times from the front of the array
//                             accessTimes.splice(0, index + 1);
//                         }
//                     }
//                 }
//             }
//         }
//     }
// };

// var accesses = new AccessLogger(10, 3000, 15000);

// // put this as one of the first middleware so it acts 
// // before other middleware spends time processing the request
// app.use(function(req, res, next) {
//     if (!accesses.check(req.connection.remoteAddress)) {
//         // cancel the request here
//         res.end("No data for you!");
//     } else {
//         next();
//     }
// });
const limiter = rateLimit({
    windowMS: 1000, //15 мин
    max: 1, //ограничение по IP за 100 req
    message: 'гыг'
})
app.get("/",limiter, (req, res) => {
    res.send("<h1>Dream Clothes</h1>")
});

app.listen(port);