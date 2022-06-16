const Router = require('express')
const router = new Router()
const ctrl = require('./authCtrl')

router.post('/registration', ctrl.registration)
router.post('/login', ctrl.login)
router.get('/users', ctrl.getUser)


module.exports = router
console.log('[authRouter] All OK')