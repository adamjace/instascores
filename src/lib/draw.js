const fs = require('fs')
const path = require('path')
const Canvas = require('canvas')
const async = require('./async')
const Logger = require('./logger')
const _ = require('lodash')

const opensans = new Canvas.Font('OpenSans-Bold', 'src/images/fonts/OpenSans-Bold.ttf')

const draw = (fixture) => {
  const canvas = new Canvas(1080, 1080)
  const ctx = canvas.getContext('2d')

  const img = new Canvas.Image()
  img.src = fs.readFileSync('src/images/oldtrafford.jpg')
  ctx.drawImage(img, 0, 0)

  ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.addFont(opensans);
  ctx.font = 'bold 110px OpenSans-Bold'
  ctx.fillStyle = 'white';
  ctx.fillText(fixture.home.score + ' ' + _.toUpper(fixture.home.team), 100, 350)
  ctx.fillText(fixture.away.score + ' ' + _.toUpper(fixture.away.team), 100, 500)

  return async((resolve, reject) => {
    const imagePath = `output/${fixture.id}.jpg`
    const fileStream = canvas.createJPEGStream({
      quality: 100
    }).pipe(fs.createWriteStream(path.join(imagePath)))
    fileStream.on('finish', () => resolve(imagePath))
    fileStream.on('error', (error) => handleError(reject, error))
  })

}

const handleError = (reject, error) => {
  Logger.log('error', error)
  reject(error)
}

module.exports = draw
