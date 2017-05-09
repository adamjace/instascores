'use strict'

require('dotenv').config()

const draw = require('../src/lib/draw')
const { run } = require('../src/lib/utils')
const { getFixturesForDrawing } = require('../src/lib/footballdata')
const repo = require('../src/db/repo')
const db = require('../src/db/redis')
const fs = require('fs')

const cleanUpFs = (path) => {
  fs.unlinkSync(path)
}

describe('Tests', async () => {

  it('should draw and save artwork to file', async () => {

    const fixture = {
      id: '__test',
      index: 1,
      matchDay: 35,
      home: {
        team: 'Man United',
        score: 4
      },
      away: {
        team: 'Liverpool',
        score: 2
      }
    }

    await run(draw, fixture)
    const path = 'output/__test.jpg'
    const file = fs.readFileSync(path)
    expect(file).not.toEqual(undefined)
    cleanUpFs(path)
  })

  it('should return fixtures that have not been drawn', async () => {
    db.__clear()
    const data = {
      fixtures:[{id: 1}, {id: 2}, {id: 3}]
    }
    const fixtures = await getFixturesForDrawing(data.fixtures)
    expect(fixtures.length).toEqual(3)
  })

  it('should not return fixtures that have been drawn', async () => {
    db.__set(1,2,3)
    const data = {
      fixtures: [{id: 1}, {id: 2}, {id: 3}]
    }
    const fixtures = await getFixturesForDrawing(data.fixtures)
    expect(fixtures.length).toEqual(0)
    db.__clear()
  })

})
