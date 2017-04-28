'use strict'

const fs = require('fs')
const path = require('path')
const Canvas = require('canvas')
const async = require('./async')
const Logger = require('./logger')
const _ = require('lodash')

const thin = new Canvas.Font('thin', 'src/images/fonts/Radikal Thin.otf')
const bold = new Canvas.Font('bold', 'src/images/fonts/Radikal Bold.otf')

const themes = [
  {
    // white
    bg: '#FFF',
    logo: 'lion5.png',
    preTextBg: 'rgba(235,255,0, 1)',
    preTextColour: '#000',
    teamNameBg: 'rgba(0,0,0,0.85)',
    teamNameColour: '#FFF'
  },
  {
    // pink
    bg: '#ff015b',
    logo: 'lion5.png',
    preTextBg: 'rgba(235,255,0, 1)',
    preTextColour: '#000',
    teamNameBg: '#000',
    teamNameColour: '#FFF'
  },
  {
    // blue
    bg: '#05f1ff',
    logo: 'lion5.png',
    preTextBg: '#FFF',
    preTextColour: '#000',
    teamNameBg: '#000',
    teamNameColour: '#FFF'
  },
  {
    // green
    bg: '#00ff87',
    logo: 'lion5.png',
    preTextBg: '#FFF',
    preTextColour: '#000',
    teamNameBg: '#000',
    teamNameColour: '#FFF'
  },
  {
    // yellow
    bg: '#ebff00',
    logo: 'lion5.png',
    preTextBg: '#FFF',
    preTextColour: '#000',
    teamNameBg: '#000',
    teamNameColour: '#FFF'
  }
]

const draw = (fixture) => {

  const canvas = new Canvas(1080, 1080)
  const ctx = canvas.getContext('2d')
  ctx.addFont(thin)
  ctx.addFont(bold)

  template(fixture, canvas, ctx)

  return async((resolve, reject) => {
    const imagePath = `output/${fixture.id}.jpg`
    const fileStream = canvas.createJPEGStream({
      quality: 100
    }).pipe(fs.createWriteStream(imagePath))
    fileStream.on('finish', () => resolve(imagePath))
    fileStream.on('error', (error) => handleError(reject, error))
  })
}

const drawImage = (ctx, path, left, top) => {
  const img = new Canvas.Image()
  img.src = fs.readFileSync(path)
  ctx.drawImage(img, left, top)
}

const drawRect = (ctx, color, top, left, width, height) => {
  ctx.fillStyle = color
  ctx.fillRect(top, left, width, height)
}

const setFont = (ctx, font, color) => {
  ctx.font = font
  ctx.fillStyle = color
}

const template = (fixture, canvas, ctx) => {

  const left = 80
  const top1 = 245
  const top2 = 455
  const top3 = 620
  const homeTeam = fixture.home.team
  const awayTeam = fixture.away.team
  const matchDay = `Matchday ${fixture.matchDay}`
  const fullTime = 'Full-time'
  const theme = themes[fixture.index%themes.length]

  drawRect(ctx, theme.bg, 0, 0, canvas.width, canvas.height)
  drawImage(ctx, `src/images/logo/${theme.logo}`, 800, 750)

  // fonts
  // team names
  ctx.font = '115px bold'
  ctx.fillStyle = theme.teamNameBg
  const home = ctx.measureText(homeTeam);
  ctx.fillRect(0, top2 - 115, home.width + 200, 150)
  const away = ctx.measureText(awayTeam);
  ctx.fillRect(0, top3 - 115, away.width + 200, 150)

  ctx.fillStyle = theme.teamNameColour
  ctx.fillText(homeTeam, left, top2)
  ctx.fillText(awayTeam, left, top3)

  // scores
  ctx.font = '105px thin'
  ctx.fillText(fixture.home.score, home.width + 110, top2)
  ctx.fillText(fixture.away.score, away.width + 110, top3)

  // full time
  ctx.font = '30px bold'
  ctx.fillStyle = theme.preTextBg
  const md = ctx.measureText(matchDay);
  ctx.fillRect(0, top1 - 32, md.width + 20, 45)
  const ft = ctx.measureText(fullTime);
  ctx.fillRect(0, top1 - 32 + 50, ft.width + 20, 45)

  ctx.fillStyle = theme.preTextColour
  ctx.fillText(matchDay, 10, top1)
  ctx.fillText(fullTime, 10, top1 + 50)
}

const template2 = (fixture, canvas, ctx) => {

  ctx.fillStyle = 'rgba(255,255,255,1)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // draw logo
  const logo = new Canvas.Image()
  logo.src = fs.readFileSync('src/images/logo/lion-white.png')
  ctx.drawImage(logo, 800, 750)

  const left = 50
  const top1 = 220
  const top2 = 425
  const top3 = 565
  const crestSize = 85
  const homeTeam = fixture.home.team
  const awayTeam = fixture.away.team
  const matchDay = `Matchday ${fixture.matchDay}`
  const fullTime = 'Full-time'

  // fonts
  // team names
  ctx.font = '100px bold'
  ctx.fillStyle = 'rgba(0,0,0,.85)'
  const home = ctx.measureText(homeTeam);
  ctx.fillRect(110, top2 - 100, home.width + 190 + crestSize, 130)
  const away = ctx.measureText(awayTeam);
  ctx.fillRect(110, top3 - 100, away.width + 190 + crestSize, 130)

  ctx.fillStyle = '#FFF'
  ctx.fillText(homeTeam, left + crestSize + 30, top2)
  ctx.fillText(awayTeam, left + crestSize + 30, top3)

  // crests
  ctx.fillStyle = '#FFF'
  ctx.fillRect(0, top2 - 100, 120, 130)
  ctx.fillRect(0, top3 - 100, 120, 130)
  const homeCrest = new Canvas.Image()
  homeCrest.src = fs.readFileSync(`src/images/crests/${fixture.home.crest}`)
  ctx.drawImage(homeCrest, 18, top2 - crestSize + 10, crestSize, crestSize)

  const awayCrest = new Canvas.Image()
  awayCrest.src = fs.readFileSync(`src/images/crests/${fixture.away.crest}`)
  ctx.drawImage(awayCrest, 18, top3 - crestSize + 10, crestSize, crestSize)

  // scores
  ctx.font = '85px thin'
  ctx.fillText(fixture.home.score, home.width + crestSize + 110, top2)
  ctx.fillText(fixture.away.score, away.width + crestSize + 110, top3)

  // full time
  ctx.font = '30px bold'
  ctx.fillStyle = 'rgba(235,255,0, 1)'
  const md = ctx.measureText(matchDay);
  ctx.fillRect(0, top1 - 32, md.width + 20, 45)
  const ft = ctx.measureText(fullTime);
  ctx.fillRect(0, top1 - 32 + 50, ft.width + 20, 45)

  ctx.fillStyle = '#000'
  ctx.fillText(matchDay, 10, top1)
  ctx.fillText(fullTime, 10, top1 + 50)
}

const getRandomFile = (path) => {
  const files = fs.readdirSync(path)
  const file = files[random(0, files.length - 1)]
  return `${path}/${file}`
}

const random = (a, b) => {
  return Math.floor(Math.random() * b) + a
}

const handleError = (reject, error) => {
  Logger.log('error', error)
  reject(error)
}

module.exports = draw
