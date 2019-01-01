const api = require('./api')

exports.likeProducts = (cat = 0, len = 6) => {
  return api.get(`products?type=like&limit=${len}&filter=cat:${cat}`)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err)
    })
}

exports.getProduct = (id) => {
  return api.get(`products/${id}?include=introduce,category,pictures`)
    .then(res => res.data)
    .catch(err => {
      return Promise.reject(err)
    })
}

exports.getProducts = (catId, page, size, sort) => {
  return api.get(`products?page=${page}&per_page=${size}&sort=${sort}&filter=cat:${catId}`)
    .then(res => ({list: res.data, totalPages: +res.headers['x-total-pages']}))
    .catch(err => {
      return Promise.reject(err)
    })
}

exports.searchProducts = (q, page, size, sort) => {
  return api.get(`products?q=${q} &page=${page}&per_page=${size}&sort=${sort}`)
    .then(res => ({list: res.data, totalPages: +res.headers['x-total-pages']}))
    .catch(err => {
      return Promise.reject(err)
    })
}
