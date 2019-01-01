const categoryModel = require('../models/category')
const productModel = require('../models/product')

exports.list = (req, res, next) => {
  const id = req.params.id
  if (!id) return next() //未传参放过不处理

  const page = +req.query.page || 1   //当前页码
  const size = +req.query.size || 20  //每页多少条
  const sort = req.query.sort || 'commend' //默认综合排序

  res.locals.page = page
  res.locals.size = size
  res.locals.sort = sort

  categoryModel.getCategory(id).then(cat => {
    res.locals.cat = cat
    return productModel.getProducts(id, page, size, sort)
  }).then(products => {
    res.locals.products = products
    res.render('list')
  }).catch(err => {
    next(err)
  })
}

exports.search = (req, res) => {
  res.render('list')
}

exports.item = (req, res, next) => {
  const id = req.params.id
  if (!id) return next() //未传参放过不处理
  Promise.all([productModel.likeProducts(), productModel.getProduct(id)]).then(results => {
    res.locals.likes = results[0]
    res.locals.item = results[1]
    res.render('item')
  }).catch(err => {
    next(err)
  })
}