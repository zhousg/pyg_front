const product = require('../models/product')
const settings = require('../models/settings')
//首页猜你喜欢、轮播图
exports.index = (req, res, next) => {
  Promise.all([product.likeProducts(), settings.getSiteInfo()])
    .then(results => {
      res.locals.likeProducts = results[0]
      res.locals.bannerData = results[1]
      res.render('home')
    }).catch(e => next(e))
}
//猜你喜欢
exports.like = (req, res) => {
  product.likeProducts().then(data => {
    res.json(data)
  }).catch(err => {
    return Promise.reject(err)
  })
}