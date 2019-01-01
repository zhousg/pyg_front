const axios = require('axios')
const config = require('../config')

const instance = axios.create({
  baseURL: config.api.localUrl,
  timeout: config.api.timeout,
  auth: {
    username: config.api.key,
    password: config.api.secret
  }
})

instance.interceptors.response.use((res => res), err => {
  //过滤一些数据服务器错误
  if(err.response && err.response.data){
    err.message = '异常信息：' + err.response.data.message
    err.status = 500
  }
  return Promise.reject(err)
})

module.exports = instance