/*内置模块*/
const path = require('path')

const config = require('./config')
const job = require('./utils/job')

/*依赖模块*/
const express = require('express')
const logger = require('morgan')
const artTemplate = require('express-art-template')
const cookieParser = require('cookie-parser')
const favicon = require('express-favicon')
const Youch = require('youch')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const store = new MySQLStore(config.mysql)

const middleware = require('./middleware')
const routers = require('./controlers/routers')

/*启动服务*/
const app = express()
app.listen(3000)
//定时任务
job.categoryJob(app)

/*模版引擎*/
app.engine('art', artTemplate)
//设置默认引擎
app.set('view engine', 'art')
//artTemplate的配置项
app.set('view options', {
  debug: process.env.NODE_ENV !== 'production'
})

/*中间件*/
app.use(logger('dev'))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'favicon.ico')))
app.use(session({
  key: 'pygSessionID',
  secret: 'pyg_project',
  store: store,
  resave: false,
  saveUninitialized: false
}))

/*自定义中间件*/
app.use(middleware.global)

//业务路由
app.use(routers)

//错误处理
app.use(function (req, res, next) {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
app.use((err, req, res, next) => {
  if (req.app.get('env') === 'development') {
    return new Youch(err, req).toHTML().then(html => {res.send(html)})
  }
  res.status(err.status || 500)
  res.render('error')
})





