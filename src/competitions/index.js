const premierLeague = require('./premierLeague')

const getTeam = (comp, teamName) => {
  return comp.teams.filter((team) => team.name === teamName)[0]
}

module.exports = {
  getTeam,
  competitions: [
    premierLeague
  ]
}
