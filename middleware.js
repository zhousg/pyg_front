const category = require('./models/category')
const cart = require('./models/cart')
const user = require('./models/user')
const product = require('./models/product')
const config = require('./config')

const setCategory = (req, res) => {
  if (req.app.locals.categoryData) {
    res.locals.categoryData = req.app.locals.categoryData
    return Promise.resolve()
  } else {
    return category.getCategoryTree().then(data => {
      req.app.locals.categoryData = data
      res.locals.categoryData = req.app.locals.categoryData
    })
  }
}
const setCart = (req, res) => {
  if (!req.session.user) {
    /*未登录查询购物车信息*/
    return Promise.resolve()
      .then(() => {
        //商品ID 件数 [{id:'',amount:1}]
        const cart = req.cookies[config.cookie.key_cart] || []
        console.log(cart)
        const tasks = cart.map((item) => {
          return product.getProduct(item.id).then(data => ({
            id: data.id,
            name: data.name,
            thumbnail: data.thumbnail,
            price: data.price,
            amount: item.amount,
            total: item.amount * data.price,
          }))
        })
        return Promise.all(tasks)
      })
      .then(cart => {
        res.locals.cartData = {
          products: cart,
          totalPrice: cart.reduce((sum, next) => sum + parseFloat(next.total), 0),
          totalAmount: cart.reduce((sum, next) => sum + parseInt(next.amount), 0)
        }
      })
  } else {
    /*TODO 已经登录*/
    return cart.getCart(req.session.user.id).then(cart => {
      res.locals.cartData = {
        products: cart,
        totalPrice: cart.reduce((sum, next) => sum + parseFloat(next.total), 0),
        totalAmount: cart.reduce((sum, next) => sum + parseInt(next.amount), 0)
      }
    })
  }
}
const global = (req, res, next) => {
  res.locals.title = config.site.title
  res.locals.description = config.site.description
  res.locals.keywords = config.site.keywords
  Promise.all([
    setCategory(req, res),
    setCart(req, res)]).then(() => {
    next()
  }).catch(err => {
    next(err)
  })
}

const autoLogin = (req, res, next) => {
  //1.已经登录
  if (req.session.user){
    res.locals.user = req.session.user
    return next()
  }
  //2.未设置自动登录
  const cookieUser = req.cookies[config.cookie.key_remember]
  if (!cookieUser) return next()
  //3.数据不合法
  const {uid, pwd} = cookieUser
  if (!(uid && pwd)) return next()
  //4.开始自动登录
  //4.1 根据uid获取用户信息
  //4.2 拿到用户信息后 比对cookie中的密码是否一致
  user.getUser(uid).then(userInfo => {
    if (!(userInfo && userInfo.id)) throw new Error('用户信息获取失败')
    if (pwd !== userInfo.password) throw new Error('密码比对失败')
    req.session.user = userInfo
    res.locals.user = userInfo
    next()
  }).catch(err => {
    console.log('自动登录失败：' + err.message)
    next()
  })
}

const checkUser = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login?returnUrl=' + encodeURIComponent(req.url))
  }
  next()
}

module.exports = {global, checkUser, autoLogin}