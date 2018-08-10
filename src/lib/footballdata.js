'use strict';

require('dotenv').config();
const request = require('request-promise');
const config = require('../config');
const repo = require('../db/repo');
const { hashcode } = require('./utils');
const { getTeam } = require('../competitions');

const options = (uri) => {
    return {
        uri,
        'json': true,
        'headers': {
            'X-Auth-Token': config.football_data_auth_token
        }
    };
};

const baseUrl = (id) => {
    return `http://api.football-data.org/v1/competitions/${id}`;
};

const getFixtures = async (comp) => {
    const currentMatchday = await getCurrentMatchDay(comp.id);
    const fixtures = await getFixturesByMatchDay(comp, currentMatchday);
    const completed = getCompletedFixtures(fixtures);
    return getFixturesForDrawing(completed);
};

const getCurrentMatchDay = async (id) => {
    const data = await request(options(baseUrl(id)));
    return data.currentMatchday;
};

const getFixturesByMatchDay = async (comp, matchDay) => {
    const data = await request(options(`${baseUrl(comp.id)}/fixtures?matchday=${matchDay}`));
    return data && transformFixtures(data.fixtures, comp) || [];
};

const getCompletedFixtures = (fixtures) => {
    return fixtures.filter((fixture) => fixture.status === 'FINISHED');
};

const getFixturesForDrawing = async (fixtures) => {
    const queue = [];
    for (let fixture of fixtures) {
        const hasBeenDrawn = await repo.get(fixture.id);
        if (!hasBeenDrawn)
            queue.push(fixture);
    }
    return queue;
};

const transformFixtures = (fixtures, comp) => {
    let transformed = [];
    for (let [index, fixture] of fixtures.entries()) {

        const {
            matchday,
            awayTeamName,
            homeTeamName,
            status
        } = fixture;

        const homeTeam = getTeam(comp, homeTeamName);
        const awayTeam = getTeam(comp, awayTeamName);

        transformed.push({
            id: hashcode(`${matchday}${homeTeamName}${awayTeamName}`),
            index,
            status,
            matchDay: matchday,
            home: {
                team: homeTeam.short,
                score: fixture.result.goalsHomeTeam,
                tags: homeTeam.tags
            },
            away: {
                team: awayTeam.short,
                score: fixture.result.goalsAwayTeam,
                tags: awayTeam.tags
            }
        });
    }

    return transformed;
};

module.exports = {
    getFixtures,
    getFixturesForDrawing
};
