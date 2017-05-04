const db = require('./redis')
const Logger = require('../lib/logger')
const async = require('../lib/async')

// repository wrapper
// get: fetches data from redis
// set: stores a true value to redis
// del: delete key from redis
const get = (key) => {
  return async((resolve, reject) => {
    db.getAsync(key).then((value, err) => {
      if (err) return reject(err)
      Logger.log('info', `fetching from redis "${key}"`)
      return resolve(value)
    })
  })
}

const set = (key) => {
  return async((resolve) => {
    db.setAsync(key, true).then(() => {
      Logger.log('info', `saving to redis "${key}"`)
      return resolve(true)
    })
  })
}


module.exports = {
  get, set
}
