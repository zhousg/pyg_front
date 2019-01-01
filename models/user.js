const api = require('./api')

exports.hasEmailOrUsername = (username, email) => {
  return api.get(`users/exists?username=${username}&email=${email}`).then(res => res.data)
}

exports.register = (username, email, password) => {
  return api.post('users/register', {username, email, password}).then(res => res.data)
}

exports.delete = id => {
  return api.delete(`users/${id}`).then(res => res.data)
}

exports.active = id => {
  return api.post(`users/${id}/active`).then(res => res.data)
}

exports.unActive = id => {
  return api.delete(`users/${id}/active`).then(res => res.data)
}

exports.login = (username, password) => {
  return api.post(`users/login`, {username, password}).then(res => res.data)
}

exports.getUser = id => {
  return api.get(`users/${id}`).then(res => res.data)
}



