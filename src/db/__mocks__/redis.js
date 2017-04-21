const async = require('../../lib/async')

let context = ''

const db = {
  getAsync: getAsync,
  setAsync: setAsync
}

function getAsync() {
  return async((resolve) => {
    resolve(context)
  })
}

function setAsync(senderId, context) {
  db.__setContext(context)
  return async((resolve) => {
    resolve(context)
  })
}

db.__setContext = (value) => {
  context = value
}

module.exports = db
