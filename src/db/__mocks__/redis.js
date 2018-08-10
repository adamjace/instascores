const async = require('../../lib/async');

let store = {};

const getAsync = (key) => {
    return async ((resolve) => {
        resolve(store[key]);
    });
};

const setAsync = (key) => {
    store[key] = true;
    return async ((resolve) => {
        resolve(store[key]);
    });
};

const redis = {
    getAsync: getAsync,
    setAsync: setAsync
};

redis.__clear = () => {
    store = {};
};

redis.__set = (...args) => {
    args.forEach((key) => store[key] = true);
};

module.exports = redis;