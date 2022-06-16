const User = require('./models/User')
const Role = require('./models/Role')



class authCtrl {
    async registration(req, res){
        try{
            const {username, password} = req.body
            const cand = await User.findOne({username})
            if(cand){
                return res.status(400).json({message: 'Юзер уже существует'})
            }else{

            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({value: "USER"})
            const user = new User({username, password: hashPassword, roles: [userRole.value]});
            await user.save()
            return res.json({message: 'Пользователь добавлен'})
        }catch(e){
        console.log(e)
        res.starus(400).json({message: 'Register error'})
        }
    }

    async login(req, res) {
        try{

        }catch(e){
            console.log(e)
            res.starus(400).json({message: 'Login error'})
        }
    }
    async getUser(req, res) {
        try{
            const userRole = new Role()
            const adminRole = new Role({value: "ADMIN"})
            await userRole.save()
            await adminRole.save()
            res.json('server work')
            console.log(res.json('server work'))
        }catch(e){
            console.log(e)
            res.starus(400).json({message: 'Get User error'})
        }
    }
}





module.exports = new authCtrl()

console.log('[authCtrl] All OK')