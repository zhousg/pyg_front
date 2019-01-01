const api = require('./api')

const getSiteInfo = () => {
  return api.get('settings/home_slides').then(res => res.data).catch(err => {
    return Promise.reject(err)
  })
}

module.exports = {getSiteInfo}