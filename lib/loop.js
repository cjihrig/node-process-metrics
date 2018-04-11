'use strict';
const EventEmitter = require('events');


class EventLoopEmitter extends EventEmitter {
  constructor (period, emitOnInterval = false) {
    super();
    this.period = period;
    this.delay = 0;
    this.mark = mark();
    const update = updateDelay.bind(null, this, emitOnInterval);
    this._interval = setInterval(update, period);
    this._interval.unref();
  }

  stop () {
    clearInterval(this._interval);
    this.delay = 0;
    this._interval = null;
  }
}


function updateDelay (ee, emit) {
  const now = mark();

  ee.delay = now - ee.mark - ee.period;
  ee.mark = now;

  if (emit) {
    ee.emit('delay', ee.delay);
  }
}


function mark () {
  const hrtime = process.hrtime();

  return hrtime[0] * 1000 + hrtime[1] / 1e6;
}


module.exports = EventLoopEmitter;
