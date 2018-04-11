'use strict';
const EventEmitter = require('events');
const Os = require('os');
const EventLoopEmitter = require('./loop');

const defaults = {
  period: NaN,
  loop: true,
  loopPeriod: 1000,
  loopEmit: false
};

const processData = {
  argv: process.argv,
  execArgv: process.execArgv,
  execPath: process.execPath,
  mainModule: process.mainModule.filename,
  memoryUsage: null,
  pid: process.pid,
  ppid: process.ppid,
  title: process.title,
  uptime: null,
  versions: process.versions
};

const systemData = {
  arch: process.arch,
  freemem: null,
  hostname: Os.hostname(),
  loadavg: null,
  platform: process.platform,
  totalmem: Os.totalmem(),
  uptime: null
};


function processMetrics () {
  processData.memoryUsage = process.memoryUsage();
  processData.uptime = process.uptime();

  return processData;
}


function systemMetrics () {
  systemData.freemem = Os.freemem();
  systemData.loadavg = Os.loadavg();
  systemData.uptime = Os.uptime();

  return systemData;
}


function emitMetrics (ee) {
  ee.emit('metrics', ee.metrics());
}


class NodeProcessEmitter extends EventEmitter {
  constructor (options) {
    super();

    const settings = Object.assign({}, defaults, options);

    if (settings.loop) {
      this.loop = new EventLoopEmitter(settings.loopPeriod, settings.loopEmit);
    } else {
      this.loop = null;
    }

    if (Number.isInteger(settings.period)) {
      const emitFn = emitMetrics.bind(null, this);

      this._interval = setInterval(emitFn, settings.period);
      this._interval.unref();
    } else {
      this._interval = null;
    }
  }

  metrics () {
    return {
      process: processMetrics(),
      system: systemMetrics(),
      cpu: Os.cpus(),
      loop: this.loop === null ? NaN : this.loop.delay,
      handles: process._getActiveHandles().length,
      requests: process._getActiveRequests().length
    };
  }
}


module.exports = NodeProcessEmitter;
