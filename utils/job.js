const schedule = require('node-schedule')
const category = require('../models/category')
/**
 * 定时任务  每个小时的0分0秒  获取一次服务端数据
 * @param app<Object> 应用对象
 */
exports.categoryJob = (app) => {
  schedule.scheduleJob('0 0 * * * *', () => {
    category.getCategoryTree().then(data => {
      //缓存到 app.locals 上
      app.locals.categoryData = data
      console.log('定时获取分类信息成功')
    }).catch(err => {
      console.log('定时获取分类信息异常：', err.message)
    })
  })
}