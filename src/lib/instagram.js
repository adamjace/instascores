'use strict'

const Client = require('instagram-private-api').V1;
const config = require('../config')

const device = new Client.Device('instascores');
const storage = new Client.CookieFileStorage(__dirname + '/cookies/instascores.json');

const login = async (username, password) => {
  return await Client.Session.create(
    device,
    storage,
    username,
    password
  )
}

const post = async (session, path, comp, fixture) => {
  const upload = await Client.Upload.photo(session, path)
  console.log(upload)
  await Client.Media.configurePhoto(session, upload.params.uploadId, tags(comp, fixture));
  return upload
}

const tags = (comp, fixture) => {
  return `${fixture.home.tags} ${fixture.away.tags} ${comp.tags}`
}

module.exports = {
  login,
  post
}
