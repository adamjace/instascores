'use strict'

require('dotenv').config()
const Client = require('instagram-private-api').V1;
const config = require('../config')

const device = new Client.Device('instascores');
const storage = new Client.CookieFileStorage(__dirname + '/cookies/instascores.json');

const login = async () => {
  return await Client.Session.create(
    device,
    storage,
    config.instagram_username,
    config.instagram_password
  )
}

const post = async (path) => {
  const session = await login()
  const upload = await Client.Upload.photo(session, path)
  const done = await Client.Media.configurePhoto(session, upload.params.uploadId, 'test');
  return upload
}

post('images/1529068363.jpg')
