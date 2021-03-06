'use strict';

require('dotenv').config();

const schedule = require('node-schedule');
const Timer = require('./lib/timer');
const Logger = require('./lib/logger');
const config = require('./config');
const repo = require('./db/repo');
const draw = require('./lib/draw');
const instagram = require('./lib/instagram');
const { getFixtures } = require('./lib/footballdata');
const { competitions } = require('./competitions/index');
const { run } = require('./lib/utils');

const timer = new Timer();

// startWorker is our main worker method
const startWorker = async () => {
    timer.start();
    Logger.log('info', 'Starting worker');

    for (let comp of competitions) {
        const processed = {
            done: [],
            failed: []
        };
        const fixtures = await getFixtures(comp);

        if (fixtures.length === 0)
            complete();

        processFixtures(fixtures, comp, processed);
    }
};

// processFixtures handles:
// 1) processing artwork
// 2) posting to instragram
const processFixtures = async (fixtures, comp, processed) => {

    // create a new instagram session
    const session = await instagram.login(config.instagram_username, config.instagram_password);

    for (let [index, fixture] of fixtures.entries()) {
        // draw artwork
        let res = await run(draw, fixture);
        if (res.error) {
            Logger.log('error', res.error);
            complete(fixtures, index, processed);
            continue;
        }

        if (config.enable_posting) {
            // post to instagram
            res = await run(instagram.post, session, res.value, comp, fixture);
            if (res.error) {
                Logger.log('error', res.error);
                complete(fixtures, index, processed);
                continue;
            }
        }

        complete(fixtures, index, processed, true);
    }
};

// handles completed attempts
const complete = async (fixtures, index, processed, ok) => {
    if (!fixtures)
        return exit([{
            status: 'info',
            message: 'No fixtures processed'
        }]);

    if (ok)
        await repo.set(fixtures[index].id);

    processed[ok ? 'done' : 'failed'].push(fixtures[index].id);

    // this is the last record. log and exit
    if (index === fixtures.length - 1) {
        const logs = [];
        addLogs(logs, processed, 'success', 'done');
        addLogs(logs, processed, 'warning', 'failed');
        return exit(logs);
    }
};

const addLogs = (logs, processed, status, outcome) => {
    if (processed[outcome].length > 0) {
        logs.push({
            status,
            message: `${processed[outcome].length} ${outcome}`
        });
    }
};

// and we're done
const exit = (logs) => {
    timer.stop();
    logs.forEach((log) => Logger.log(log.status, log.message));
    Logger.log('info', timer.report);
    process.exit();
};

if (!config.run_schedule) {
    return startWorker();
}

schedule.scheduleJob(config.schedule_pattern, startWorker);
