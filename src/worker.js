'use strict'

const Timer = require('./lib/timer')
const Logger = require('./lib/logger')
const config = require('./config')
const repo = require('./db/repo')
const getscores = require('./lib/getscores')
const draw = require('./lib/draw')
const instagram = require('./lib/instagram')
const { competitions } = require('./competitions/index')
const { run } = require('./lib/utils')

const timer = new Timer();

// startWorker is our main worker method
// responsible for fetching results, processing images
// and posting to instagram
const startWorker = async () => {
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

      if (config.enable_posting) {
        res = await run(instagram.post, res.value, comp, fixture)
        if (res.error) {
          Logger.log('error', res.error)
          complete(scores, index, false)
          continue
        }
      }
      complete(scores, index, true)
    }
  }
}

const complete = async (scores, index, ok) => {
  if (ok) await repo.set(scores[index].id)
  if (!scores || index === scores.length - 1) {
    timer.stop()
    Logger.log('info', `${scores ? scores.length : 'No'} fixtures processed`)
    Logger.log('info', timer.report)
    process.exit()
  }
}

schedule.scheduleJob('*/5 * * * *', async startWorker)

module.exports = {
  run: startWorker
}
