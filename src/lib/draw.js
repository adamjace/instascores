'use strict'

const fs = require('fs')
const path = require('path')
const Canvas = require('canvas')
const async = require('./async')
const Logger = require('./logger')
const _ = require('lodash')

const thin = new Canvas.Font('thin', 'src/images/fonts/Radikal Thin.otf')
const bold = new Canvas.Font('bold', 'src/images/fonts/Radikal Bold.otf')

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

  // draw background
  const bg = new Canvas.Image()
  bg.src = getRandomFile('src/images/bg')
  ctx.drawImage(bg, 0, 0)

  const overlay = new Canvas.Image()
  overlay.src = fs.readFileSync('src/images/overlay.png')
  ctx.drawImage(overlay, 0, 0)
  //ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  //ctx.fillRect(0, 0, canvas.width, canvas.height)

  // draw logo
  const logo = new Canvas.Image()
  //logo.src = getRandomFile('src/images/logo')
  logo.src = fs.readFileSync('src/images/logo/lion-white.png')
  ctx.drawImage(logo, 800, 750)

  const left = 80
  const top1 = 220
  const top2 = 425
  const top3 = 565
  const homeTeam = fixture.home.team
  const awayTeam = fixture.away.team
  const matchDay = `Matchday ${fixture.matchDay}`
  const fullTime = 'Full-time'

  // fonts
  // team names
  ctx.font = '100px bold'
  ctx.fillStyle = 'rgba(0,0,0,.85)'
  const home = ctx.measureText(homeTeam);
  ctx.fillRect(0, top2 - 100, home.width + 190, 130)
  const away = ctx.measureText(awayTeam);
  ctx.fillRect(0, top3 - 100, away.width + 190, 130)

  ctx.fillStyle = '#FFF'
  ctx.fillText(homeTeam, left, top2)
  ctx.fillText(awayTeam, left, top3)

  // scores
  ctx.font = '85px thin'
  ctx.fillText(fixture.home.score, home.width + 110, top2)
  ctx.fillText(fixture.away.score, away.width + 110, top3)

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
  const file = files[random(0, files.length + 5)]
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
