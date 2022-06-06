const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt
    if (token){
        jwt.verify(token, 'secret infa', (err, decodedToken) =>{
            if(err){
                console.log(err.message);
                res.redirect('/why')
            } else {
                console.log(decodedToken)
                next();
            }
        })
    }else{
        res.redirect('/why')
    }
}