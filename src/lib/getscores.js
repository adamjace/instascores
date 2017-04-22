'use strict'

const request = require('request-promise')
const config = require('../config')
const repo = require('../db/repo')
const { hashcode } = require('./utils')

const baseUrl = 'http://api.football-data.org/v1/competitions/426'
const options = (uri) => {
  return {
    uri,
    json: true,
    headers: {
      'X-Auth-Token': config.football_data_auth_token
    }
  }
}

const getCurrentMatchDay = async () => {
  const data = await request(options(baseUrl))
  return data.currentMatchday
}

const getFixtures = async (matchDay) => {
  let fixtures = []
  const data = await request(options(`${baseUrl}/fixtures?matchday=${matchDay}`))

  if (data && data.fixtures) {
    for (let item of data.fixtures) {
      const fixture = transformFixture(item)
      //if (fixture.status === 'FINISHED') {
        const shouldSkip = await repo.get(fixture.id)
        if (!shouldSkip)
          fixtures.push(fixture)
      //}
    }
  }
  return fixtures
}

const transformFixture = (fixture) => {
  const { matchDay, awayTeamName, homeTeamName, status } = fixture
  return {
    id: hashcode(`${matchDay}${homeTeamName}${awayTeamName}`),
    status: status,
    home: {
      team: fixture.homeTeamName,
      goals: fixture.result.goalsHomeTeam
    },
    away: {
      team: fixture.awayTeamName,
      goals: fixture.result.goalsAwayTeam
    }
  }
}

module.exports = async () => {
  const currentMatchday = await getCurrentMatchDay()
  return await getFixtures(currentMatchday)
}
