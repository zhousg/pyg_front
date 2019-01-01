const api = require('./api')

exports.addCart = (userId, id, amount) => {
  return api.post(`users/${userId}/cart`, {id, amount}).then(res => res.data)
}

exports.getCart = (userId) => {
  return api.get(`users/${userId}/cart`).then(res => res.data)
}