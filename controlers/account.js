const config = require('../config')
const user = require('../models/user')
const cart = require('../models/cart')
const emailUtil = require('../utils/email')
const svgCaptcha = require('svg-captcha')
//注册页面
exports.register = (req, res) => {
  res.locals.titlePrefix = '个人注册-'
  res.render('register')
}
//注册逻辑
exports.registerPost = (req, res) => {
  const {username, email, password, rePass, agree} = req.body
  Promise.resolve().then(() => {
    //1. 基本校验
    if (!(username && email && password && rePass)) {
      throw new Error('必须完整填写信息')
    }
    if (!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email)) {
      throw new Error('邮箱格式不正确')
    }
    if (password !== rePass) {
      throw new Error('密码必须一致')
    }
    if (!agree) {
      throw new Error('必须同意注册协议')
    }
    //2. 校验用户名或邮箱是否存在
    return user.hasEmailOrUsername(username, email)
  }).then(res => {
    if (res.username) {
      throw new Error('用户名已存在')
    }
    if (res.email) {
      throw new Error('邮箱已存在')
    }
    //3. 入库
    return user.register(username, email, password)
  }).then(userInfo => {
    if (!userInfo || !userInfo.id) {
      throw new Error('注册失败，稍后再试')
    }
    req.userId = userInfo.id
    //4. 发送激活邮件
    return emailUtil.sendActiveEmail(userInfo)
  }).then((msg) => {
    //5. 注册成功
    res.locals.sucMsg = '注册成功,5秒后跳转登录！\n 请查收邮件激活您的邮箱！'
    res.render('register', req.body)
  }).catch((err) => {
    req.userId && user.delete(req.userId)
    res.locals.titlePrefix = '个人注册-'
    res.locals.errMsg = err.message
    res.render('register', req.body)
  })
}
//登录页面
exports.login = (req, res) => {
  res.locals.titlePrefix = '个人登录-'
  //验证码
  const c = svgCaptcha.createMathExpr({width: 96, height: 32, fontSize: 32})
  req.session.captchaText = c.text
  res.locals.captcha = c.data
  res.render('login', {returnUrl: encodeURIComponent(req.query.returnUrl || '')})
}

//登录逻辑
exports.loginPost = (req, res) => {
  const {username, password, captcha, remember} = req.body
  Promise.resolve().then(() => {
    //1.检验数据
    if (!(username && password && captcha)) {
      throw new Error('提交信息不完整')
    }
    //2.验证码
    const captchaText = req.session.captchaText
    /*比对之前删除*/
    delete req.session.captchaText
    if (captcha !== captchaText) {
      throw new Error('验证码不正确')
    }
    return user.login(username, password)
  }).then(userInfo => {
    //3.校验 用户名 密码 是否正确
    if (!(userInfo && userInfo.id)) {
      throw new Error('用户名或密码不对')
    }
    //4.判断用户是否激活
    // if (!userInfo.actived) {
    //   throw new Error('该账号还未激活')
    // }
    //5.记住我
    req.session.user = userInfo
    if (remember) {
      const expires = new Date(Date.now() + config.cookie.key_remember_expires)
      res.cookie(config.cookie.key_remember, {
        uid: userInfo.id,
        pwd: userInfo.password
      }, {expires, httpOnly: true})
    }
    //6.合并购物车
    const cartCookie = req.cookies[config.cookie.key_cart] || []
    /*cartCookie ====> [{id:456,amount:2}] */
    /*根据购物车信息一起查询*/
    console.log(cartCookie)
    const tasks = cartCookie.map(item => cart.addCart(userInfo.id, item.id, item.amount))
    return Promise.all(tasks)
  }).then(() => {
    //清楚已经合并的购物车在客户端的信息
    res.clearCookie(config.cookie.key_cart)
    res.redirect(req.query.returnUrl || '/member')
  }).catch(err => {
    res.locals.titlePrefix = '个人登录-'
    //验证码
    const c = svgCaptcha.createMathExpr({width: 96, height: 32, fontSize: 32})
    req.session.captchaText = c.text
    res.locals.captcha = c.data
    res.locals.errMsg = err.message
    res.render('login', {returnUrl: encodeURIComponent(req.query.returnUrl||'')})
  })
}

//激活
exports.active = (req, res, next) => {
  const {v} = req.query
  if (!v) {
    throw new Error('未找到激活码')
  }
  if (v !== req.session.user.email_verify) {
    throw  new Error('激活码不可用')
  }
  user.active(req.session.user.id).then(user => {
    req.session.user = user
    res.redirect('/member')
  }).catch(e => next(e))
}

//退出
exports.logout = (req, res, next) => {
  delete req.session.user
  res.clearCookie(config.cookie.key_remember)
  res.redirect('/login')
}