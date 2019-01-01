const express = require('express')
const routers = express.Router()
const {checkUser, autoLogin} = require('../middleware')

const home = require('./home')
const account = require('./account')
const member = require('./member')
const product = require('./product')
const cart = require('./cart')
const order = require('./order')

routers.use(autoLogin)

//show product
routers.get('/', home.index)
routers.get('/like', home.like)
routers.get('/list/:id(\\d+)', product.list)
routers.get('/search', product.search)
routers.get('/item/:id(\\d+)', product.item)

//cart handle
routers.get('/cart', cart.index)
routers.get('/cart/add/', cart.add)

//account handle
routers.get('/register', account.register)
routers.post('/register', account.registerPost)
routers.get('/login', account.login)
routers.post('/login', account.loginPost)
routers.get('/logout', account.logout)
routers.get('/active', checkUser, account.active)

//member manage
routers.get('/member', checkUser, member.index)

//pay
routers.get('/pay/checkout', checkUser, order.index)

module.exports = routers