'use strict';

const redis = require('redis');
const bluebird = require('bluebird');
const config = require('../config');
const Logger = require('../lib/logger');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const client = redis.createClient(config.redis_port, config.redis_host, {
    no_ready_check: true
});
client.auth(config.redis_password);

client.on('error', (err) => {
    Logger.log('error', err);
});

module.exports = client;