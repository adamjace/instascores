'use strict'

const config = {
  port: process.env.PORT,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  redis_user: process.env.REDIS_USER,
  redis_password: process.env.REDIS_PASSWORD
}

for (const key of Object.keys(config)) {
  if (!config[key]) {
    //throw new Error(`Invalid configuration. Missing "${key}"`)
  }
}

module.exports = config
