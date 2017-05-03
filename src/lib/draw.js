'use strict'

const fs = require('fs')
const path = require('path')
const Canvas = require('canvas')
const async = require('./async')
const Logger = require('./logger')
const _ = require('lodash')

//Canvas.registerFont('src/images/fonts/Radikal.otf', {family: 'Radikal'});
//Canvas.registerFont('src/images/fonts/Radikal Bold.otf', {family: 'Radikal Bold'});

const thin = new Canvas.Font('Radikal', 'src/images/fonts/Radikal.otf')
const bold = new Canvas.Font('Radikal Bold', 'src/images/fonts/Radikal Bold.otf')

const themes = [
  {
    // white
    bg: '#FFF',
    logo: 'lion2.png',
    preTextBg: 'rgba(235,255,0, 1)',
    preTextColour: '#000',
    teamNameBg: 'rgba(0,0,0,0.85)',
    teamNameColour: '#FFF'
  },
  {
    // pink
    bg: '#ff015b',
    logo: 'lion.png',
    preTextBg: 'rgba(235,255,0, 1)',
    preTextColour: '#000',
    teamNameBg: 'rgba(0,0,0,0.85)',
    teamNameColour: '#FFF'
  },
  {
    // blue
    bg: '#05f1ff',
    logo: 'lion.png',
    preTextBg: '#FFF',
    preTextColour: '#000',
    teamNameBg: 'rgba(0,0,0,0.85)',
    teamNameColour: '#FFF'
  },
  {
    // green
    bg: '#00ff87',
    logo: 'lion.png',
    preTextBg: '#FFF',
    preTextColour: '#000',
    teamNameBg: 'rgba(0,0,0,0.85)',
    teamNameColour: '#FFF'
  },
  {
    // yellow
    bg: '#ebff00',
    logo: 'lion.png',
    preTextBg: '#FFF',
    preTextColour: '#000',
    teamNameBg: 'rgba(0,0,0,0.90)',
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
  ctx.font = '115px "Radikal"'
  ctx.fillStyle = theme.teamNameBg
  const home = ctx.measureText(homeTeam);
  ctx.fillRect(0, top2 - 115, home.width + (fixture.home.score < 10 ? 210 : 250), 150)
  const away = ctx.measureText(awayTeam);
  ctx.fillRect(0, top3 - 115, away.width + (fixture.away.score < 10 ? 210 : 250), 150)

  ctx.fillStyle = theme.teamNameColour
  ctx.fillText(homeTeam, left, top2)
  ctx.fillText(awayTeam, left, top3)

  // scores
  ctx.font = '105px "Radikal Bold"'
  ctx.fillText(fixture.home.score, home.width + 110, top2)
  ctx.fillText(fixture.away.score, away.width + 110, top3)

  // full time
  ctx.font = '30px "Radikal Bold"'
  ctx.fillStyle = theme.preTextBg
  const md = ctx.measureText(matchDay);
  ctx.fillRect(0, top1 - 32, md.width + 20, 45)
  const ft = ctx.measureText(fullTime);
  ctx.fillRect(0, top1 - 32 + 50, ft.width + 20, 45)

  ctx.fillStyle = theme.preTextColour
  ctx.fillText(matchDay, 10, top1)
  ctx.fillText(fullTime, 10, top1 + 50)
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

const handleError = (reject, error) => {
  Logger.log('error', error)
  reject(error)
}

module.exports = draw
