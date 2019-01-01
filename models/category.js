const api = require('./api')

exports.getCategoryTree = () => {
  return api.get('categories?format=tree')
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err)
    })
}

exports.getCategory = id => {
  return api.get(`categories/${id}?include=parent`)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err)
    })
}
