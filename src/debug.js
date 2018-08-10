'use strict';

require('dotenv').config();

const Timer = require('./lib/timer');
const Logger = require('./lib/logger');
const draw = require('./lib/draw');
const { run } = require('./lib/utils');

const timer = new Timer();

const fixture = {
    id: '__test',
    index: 1,
    matchDay: 35,
    home: {
        team: 'Man United',
        score: 4
    },
    away: {
        team: 'Liverpool',
        score: 2
    }
};

const startWorker = async () => {
    timer.start();
    Logger.log('info', 'Starting debug worker');
    await run(draw, fixture);
    timer.stop();
    Logger.log('info', timer.report);
};

startWorker();
