const fs = require('fs')
const path = require('path')
const Canvas = require('canvas')
const async = require('./async')

const draw = (fixture) => {

  const Image = Canvas.Image
  const canvas = new Canvas(400, 400)
  const ctx = canvas.getContext('2d')

  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = '30px San Francisco'
  ctx.fillStyle = "blue";
  ctx.fillText(fixture.home.team, 50, 100)
  ctx.fillText(fixture.away.team, 50, 250)

  return async((resolve, reject) => {
    const fileStream = canvas.createPNGStream().pipe(fs.createWriteStream(path.join(`images/${fixture.id}.png`)))
    fileStream.on('finish', () => resolve(fixture))
    fileStream.on('error', (error) => {
      Logger.log('error', error)
      reject(error)
    })
  })

}

module.exports = draw
