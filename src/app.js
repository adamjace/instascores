'use strict'

require('dotenv').config()

const Timer = require('./lib/timer')
const Logger = require('./lib/logger')

const getscores = require('./lib/getscores')
const draw = require('./lib/draw')
const async = require('./lib/async')

//const { postToInstagram } = require('./lib/instagram')
//const { uploadToS3Bucket } = require('./lib/aws')

const timer = new Timer();

(() => {
  timer.start()

  getscores().then((data) => {
    if (data.length === 0) {
      complete()
    }
    data.map((fixture, index) => {
      Logger.log('info', `drawing fixture ${JSON.stringify(fixture)}`)
      draw(fixture)
        //.then(uploadToS3Bucket)
        //.then(postToInstagram)
        .then(complete.bind(this, data, index))
    })
  })
})()

const complete = (data, index, ok) => {
  if (!data || index === data.length - 1) {
    timer.stop()
    Logger.log('info', `${data ? data.length : 'No'} fixtures processed`)
    Logger.log('info', timer.report)
    process.exit()
  }
}
