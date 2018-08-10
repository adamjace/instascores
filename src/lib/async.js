'use strict';

const Promise = require('bluebird');

const async = (() => {
    function F(args) {
        return Promise.apply(this, args);
    }

    F.prototype = Promise.prototype;

    return function() {
        return new F(arguments);
    };
})();

module.exports = async;
