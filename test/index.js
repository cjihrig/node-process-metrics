'use strict';
const Barrier = require('cb-barrier');
const Code = require('code');
const Lab = require('lab');
const NPM = require('../lib'); // yes, I realize the name is NPM
const Loop = require('../lib/loop');

// Test shortcuts
const lab = exports.lab = Lab.script();
const { describe, it } = lab;
const { expect } = Code;


describe('Node Process Metrics', () => {
  it('captures expected metrics', () => {
    const ee = new NPM();

    expect(ee).to.be.an.instanceOf(NPM);
    expect(ee.loop).to.exist();
    expect(ee._interval).to.not.exist();
    checkMetrics(ee.metrics());
  });

  it('can function as an event emitter', () => {
    const barrier = new Barrier();
    const ee = new NPM({ period: 100 });

    expect(ee._interval).to.exist();

    ee.on('metrics', (metrics) => {
      checkMetrics(metrics);
      barrier.pass();
    });

    return barrier;
  });

  it('event loop monitoring can be disabled', () => {
    const ee = new NPM({ loop: false });

    expect(ee.loop).to.not.exist();
    checkMetrics(ee.metrics());
  });

  it('event loop monitoring does not emit events by default', () => {
    const barrier = new Barrier();
    const ee = new Loop(100);
    const mark = ee.mark;

    setTimeout(() => {
      expect(ee.delay).to.be.a.number();
      expect(ee.mark).to.be.a.number();
      expect(ee.mark).to.not.equal(mark);
      barrier.pass();
    }, 1000);

    ee.on('delay', () => {
      Code.fail('no event should be emitted');
    });

    expect(ee.delay).to.equal(0);
    expect(ee.period).to.equal(100);
    expect(mark).to.be.a.number();
    expect(ee._interval).to.exist();
    return barrier;
  });

  it('event loop monitoring can be stopped', () => {
    const barrier = new Barrier();
    const ee = new Loop(100, true);

    ee.on('delay', (delay) => {
      expect(delay).to.be.a.number();
      expect(delay).to.equal(ee.delay);
      ee.stop();
      expect(ee.delay).to.equal(0);
      expect(ee._interval).to.equal(null);
      barrier.pass();
    });

    return barrier;
  });
});


function checkMetrics (metrics) {
  expect(metrics.process).to.be.an.object();
  expect(metrics.process.argv).to.be.an.array();
  expect(metrics.process.execArgv).to.be.an.array();
  expect(metrics.process.execPath).to.be.a.string();
  expect(metrics.process.mainModule).to.be.a.string();
  expect(metrics.process.memoryUsage).to.be.an.object();
  expect(metrics.process.pid).to.be.a.number();
  expect(metrics.process.ppid).to.be.a.number();
  expect(metrics.process.title).to.be.a.string();
  expect(metrics.process.uptime).to.be.a.number();
  expect(metrics.process.versions).to.be.an.object();
  expect(metrics.system).to.be.an.object();
  expect(metrics.system.arch).to.be.a.string();
  expect(metrics.system.freemem).to.be.a.number();
  expect(metrics.system.hostname).to.be.a.string();
  expect(metrics.system.loadavg).to.be.an.array();
  expect(metrics.system.platform).to.be.a.string();
  expect(metrics.system.totalmem).to.be.a.number();
  expect(metrics.system.uptime).to.be.a.number();
  expect(metrics.cpu).to.be.an.array();
  expect(metrics.loop).to.be.a.number();
  expect(metrics.handles).to.be.a.number();
  expect(metrics.requests).to.be.a.number();
}
