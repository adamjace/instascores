'use strict';

const config = {
    'port': process.env.PORT,
    'redis_host': process.env.REDIS_HOST,
    'redis_port': process.env.REDIS_PORT,
    'redis_user': process.env.REDIS_USER,
    'redis_password': process.env.REDIS_PASSWORD,
    'football_data_auth_token': process.env.FOOTBALL_DATA_AUTH_TOKEN,
    'instagram_username': process.env.INSTAGRAM_USERNAME,
    'instagram_password': process.env.INSTAGRAM_PASSWORD,
    'enable_posting': process.env.ENABLE_POSTING === 'true',
    'schedule_pattern': process.env.SCHEDULE_PATTERN,
    'run_schedule': process.env.RUN_SCHEDULE === 'true'
};

for (const key of Object.keys(config)) {
    if (config[key] == null) {
        throw new Error(`Invalid configuration. Missing "${key}"`);
    }
}

module.exports = config;
