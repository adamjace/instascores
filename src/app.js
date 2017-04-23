'use strict'

require('dotenv').config()

const Timer = require('./lib/timer')
const Logger = require('./lib/logger')

const repo = require('./db/repo')
const getscores = require('./lib/getscores')
const draw = require('./lib/draw')
const { competitions } = require('./competitions/index')

const { run } = require('./lib/utils')
const { postToInstagram } = require('./lib/instagram')

const timer = new Timer();

(async () => {
  for (let comp of competitions) {
    timer.start()

    const scores = await getscores(comp)
    if (scores.length === 0)
      complete()

    for (let [index, fixture] of scores.entries()) {

      let res = await run(draw, fixture)
      if (res.error) {
        Logger.log('error', res.error)
        complete(scores, index, false)
        continue
      }

      res = await run(postToInstagram, res.value, comp, fixture)
      if (res.error) {
        Logger.log('error', res.error)
        complete(scores, index, false)
        continue
      }

      complete(scores, index, true)
    }
  }
})()

const complete = async (scores, index, ok) => {
  if (ok) await repo.set(scores[index].id)
  if (!scores || index === scores.length - 1) {
    timer.stop()
    Logger.log('info', `${scores ? scores.length : 'No'} fixtures processed`)
    Logger.log('info', timer.report)
    process.exit()
  }
}
