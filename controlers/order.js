const alipay = require('../utils/alipay')

exports.index = (req,res) => {
  res.redirect(alipay.pay())
}