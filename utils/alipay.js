const Alipay = require('node-alipay-sdk')
const config = require('../config')
const fs = require('fs')
const path = require('path')

const alipay = new Alipay({
  appId: '2016092300579138',
  notifyUrl: config.site.url + 'pay/notify',
  rsaPrivate: fs.readFileSync(path.join(__dirname, 'app_private.pem'),'utf-8'),
  rsaPublic: fs.readFileSync(path.join(__dirname, 'alipay_public.pem'),'utf-8'),
  sandbox: true,
  signType: 'RSA2'
})

exports.pay = order => {
  const params = alipay.pagePay({
    subject: '测试商品描述测试商品描述测试商品描述',
    body: '测试商品描述测试商品描述测试商品描述测试商品描述测试商品描述测试商品描述测试商品描述测试商品描述',
    outTradeId: Date.now(),
    timeout: '10m',
    amount: '10.00',
    goodsType: '1',
    qrPayMode: 1,
    return_url:config.site.url+'pay/callback'
  })
  return 'https://openapi.alipaydev.com/gateway.do?' + params
}