const {Schema, model} = require('mongoose')



const User = new Schema({
    usernmae:{type: String, unique:true, required:true},
    password:{type: String, unique:true, required:true},
    roles: [{type: String, ref: 'Role'}]
})



module.exports = model('User', User)
console.log('[User] All OK')