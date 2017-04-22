const db = require('./redis')
const Logger = require('../lib/logger')
const async = require('../lib/async')

// repository wrapper
// get: fetches data from redis
// set: stores to redis
const get = (id) => {
  return async((resolve, reject) => {
    db.getAsync(id).then((value, err) => {
      if (err) return reject(err)
      Logger.log('info', `fetching from redis "${id}"`)
      return resolve(value)
    })
  })
}

const set = (id) => {
  return async((resolve) => {
    db.setAsync(id, true).then(() => {
      Logger.log('info', `saving to redis "${id}"`)
      return resolve(true)
    })
  })
}

module.exports = {
  get, set
}
