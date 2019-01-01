const api = {
  serverUrl: 'https://ns-api.uieee.com/v1/',
  localUrl: 'http://127.0.0.1:8000/v1/',
  timeout: 3000,
  key: 'newshop-frontend',
  secret: 'd8667837fce5a0270a35f4a8fa14be479fadc774'
}
const site = {
  description: '品优购PYG.COM-专业的综合网上购物商城，为您提供正品低价的购物选择、优质便捷的服务体验。商品来自全球数十万品牌商家，囊括家电、手机、电脑、服装、居家、母婴、美妆、个护、食品、生鲜等丰富品类，满足各种购物需求。',
  keywords: '网上购物,网上商城,家电,手机,电脑,服装,居家,母婴,美妆,个护,食品,生鲜,品优购',
  title: '品优购(PYG.COM)-正品低价、品质保障、配送及时、轻松购物！',
  name: '品优购',
  url: 'http://localhost:3000/'
}
const cookie = {
  key_cart: 'pyg_cart',
  key_cart_expires: 30 * 24 * 60 * 60 * 1000,
  key_remember: 'pyg_remember',
  key_remember_expires: 7 * 24 * 60 * 60 * 1000
}

const email = {
  user: 'pyg_admin@163.com',
  password: 'a123456789',
  host: 'smtp.163.com'
}
const mysql = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'pyg_session'
}
module.exports = {api, site, cookie, email, mysql}