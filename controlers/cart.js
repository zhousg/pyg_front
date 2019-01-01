const createError = require('http-error')
const cartModel = require('../models/cart')
const productModel = require('../models/product')
const config = require('../config')

exports.add = (req, res, next) => {
  const id = req.query.id
  const amount = req.query.amount || 1
  res.locals.amount = amount
  //参数不合法
  if (!id) next(createError(500))
  //已登录
  if (req.session.user) {
    cartModel.addCart(req.session.user.id, id, amount).then((cart) => {
      res.locals.cartData = {
        products: cart,
        totalPrice: cart.reduce((sum, next) => sum + parseFloat(next.total), 0),
        totalAmount: cart.reduce((sum, next) => sum + parseInt(next.amount), 0)
      }
      res.locals.product = cart[0]
      res.render('cartAdd')
    })
  }
  //未登录
  else {
    const cookieCart = req.cookies[config.cookie.key_cart] || []
    const sameItem = cookieCart.find(item => item.id === id)
    if (sameItem) {
      sameItem.amount = sameItem.amount + amount
    } else {
      cookieCart.push({id, amount})
    }
    //设置新的cookie
    const expires = new Date(Date.now + config.cookie.key_cart_expires)
    res.cookie(config.cookie.key_cart, cookieCart, {expires})
    //更新req.locals.cartData数据
    if (sameItem) {
      const item = res.locals.cartData.products.find(item => item.id = id)
      item.amount = item.amount + amount
      res.locals.product = item
      res.render('cartAdd')
    } else {
      productModel.getProduct(id).then(product => {
        const cartData = res.locals.cartData
        const item = {
          id: product.id,
          name: product.name,
          thumbnail: product.thumbnail,
          price: product.price,
          amount: amount,
          total: amount * product.price,
        }
        cartData.products.push(item)
        cartData.totalPrice = cartData.products.reduce((sum, next) => sum + parseFloat(next.total), 0)
        cartData.totalAmount = cartData.products.reduce((sum, next) => sum + parseInt(next.amount), 0)
        res.locals.product = item
        res.render('cartAdd')
      }).catch(err => next(createError(500)))
    }
  }
}

exports.index = (req, res, next) => {
  res.render('cart')
}