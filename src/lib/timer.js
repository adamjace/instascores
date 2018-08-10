'use strict';

class Timer {

    constructor() {
        this.instance = null;
        this.time = 0;
    }

    get report() {
        return `Took ${this.time < 1000 ? `${this.time}ms` : `${this.time / 1000}s`}`;
    }

    start() {
        this.instance = setInterval(() => {
            this.time++;
        }, 1);
    }

    stop() {
        clearInterval(this.instance);
    }
}

module.exports = Timer;