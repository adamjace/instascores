'use strict'

class Logger {
  static log(...args) {
    if (!args[1]) {
      return console.log(`${args[0]}`)
    }
    return console.log(`${args[0]}: ${args[1]}`)
  }
}

module.exports = Logger
