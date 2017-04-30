'use strict'

require('dotenv').config()
const schedule = require('node-schedule')
const Timer = require('./lib/timer')
const Logger = require('./lib/logger')
const config = require('./config')
const repo = require('./db/repo')
const getscores = require('./lib/getscores')
const draw = require('./lib/draw')
const instagram = require('./lib/instagram')
const { competitions } = require('./competitions/index')
const { run } = require('./lib/utils')

const timer = new Timer()

// startWorker is our main worker method
// responsible for fetching results, processing images
// and posting to instagram
const startWorker = async () => {
  timer.start()
  Logger.log('info', 'Starting worker')

  for (let comp of competitions) {
    const processed = { done: [], failed: [] }
    const scores = await getscores(comp)
    if (scores.length === 0)
      complete()

    for (let [index, fixture] of scores.entries()) {
      let res = await run(draw, fixture)
      if (res.error) {
        Logger.log('error', res.error)
        complete(scores, index, false, processed)
        continue
      }

      if (config.enable_posting) {
        res = await run(instagram.post, res.value, comp, fixture)
        if (res.error) {
          Logger.log('error', res.error)
          complete(scores, index, false, processed)
          continue
        }
      }
      complete(scores, index, true, processed)
    }
  }
}

// handles completed attempts at:
// 1) processing artwork
// 2) posting to instragram
const complete = async (scores, index, ok, processed) => {
  if (scores) {
    const id = scores[index].id
    if (ok) {
      await repo.set(id)
      processed.done.push(id)
    } else {
      processed.failed.push(id)
    }
  }

  if (!scores || index === scores.length - 1) {
    timer.stop()
    if (!scores) {
      Logger.log('info', `No fixtures processed`)
    }
    else {
      if (processed.done.length > 0)
        Logger.log('success', `${processed.done.length} processed`)
      if (processed.failed.length > 0)
        Logger.log('warning', `${processed.failed.length} failed`)
    }
    Logger.log('info', timer.report)
    process.exit()
  }
}

schedule.scheduleJob('*/5 * * * *', startWorker)
