'use strict'

require('dotenv').config()
const request = require('request-promise')
const config = require('../config')
const repo = require('../db/repo')
const { hashcode } = require('./utils')
const { getTeam } = require('../competitions')

const options = (uri) => {
  return {
    uri,
    json: true,
    headers: {
      'X-Auth-Token': config.football_data_auth_token
    }
  }
}

const baseUrl = (id) => {
  return `http://api.football-data.org/v1/competitions/${id}`
}

const getCurrentMatchDay = async (id) => {
  const data = await request(options(baseUrl(id)))
  return 32//data.currentMatchday
}

const getFixtures = async (comp, matchDay) => {
  let fixtures = []
  const data = await request(options(`${baseUrl(comp.id)}/fixtures?matchday=${matchDay}`))

  if (data && data.fixtures) {
    for (let item of data.fixtures) {
      const fixture = transformFixture(comp, item)
      if (fixture.status === 'FINISHED') {
        const shouldSkip = await repo.get(fixture.id)
        if (!shouldSkip)
          fixtures.push(fixture)
      }
    }
  }
  return fixtures
}

const transformFixture = (comp, fixture) => {
  const { matchDay, awayTeamName, homeTeamName, status } = fixture
  const homeTeam = getTeam(comp, homeTeamName)
  const awayTeam = getTeam(comp, awayTeamName)
  return {
    id: hashcode(`${matchDay}${homeTeamName}${awayTeamName}`),
    status: status,
    home: {
      team: homeTeam.short,
      score: fixture.result.goalsHomeTeam,
      tags: homeTeam.tags
    },
    away: {
      team: awayTeam.short,
      score: fixture.result.goalsAwayTeam,
      tags: awayTeam.tags
    }
  }
}

module.exports = async (comp) => {
  const currentMatchday = await getCurrentMatchDay(comp.id)
  return await getFixtures(comp, currentMatchday)
}
