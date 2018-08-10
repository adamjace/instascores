'use strict';

const reset = '\x1b[0m';

const colours = {
    'info': '\x1b[36m',
    'success': '\x1b[32m',
    'warning': '\x1b[33m',
    'error': '\x1b[31m'
};

class Logger {
    static log(...args) {
        if (!args[1]) {
            return console.log(`${args[0]}`);
        }
        return console.log(`${colours[args[0]]}${args[0]}${reset}: ${args[1]}`);
    }
}

module.exports = Logger;
