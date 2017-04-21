'use strict'

const request = require('request-promise')
const { hashcode } = require('./utils')

const baseUrl = 'http://api.football-data.org/v1/competitions/426'
const options = (uri) => {
  return { uri, json: true }
}

const getscores = () => {
  return getCurrentMatchDay().then(getFixtures)
}

const getCurrentMatchDay = () => {
  return request(options(baseUrl)).then((data) => {
    return data.currentMatchday
  })
}

const getFixtures = (matchDay) => {
  return request(options(`${baseUrl}/fixtures?matchday=${matchDay}`)).then((data) => {
    let fixtures = []
    data.fixtures.map((item) => {
      const fixture = transformFixture(item)
      if (fixture.status === 'FINISHED') {
        fixtures.push(fixture)
      }
    })
    return fixtures
  })
}

const transformFixture = (fixture) => {
  return {
    id: hashcode(fixture.awayTeamName + fixture.homeTeamName),
    status: fixture.status,
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

module.exports = getscores
