# node-process-metrics

[![Current Version](https://img.shields.io/npm/v/node-process-metrics.svg)](https://www.npmjs.org/package/node-process-metrics)
[![Build Status via Travis CI](https://travis-ci.org/cjihrig/node-process-metrics.svg?branch=master)](https://travis-ci.org/cjihrig/node-process-metrics)
![Dependencies](http://img.shields.io/david/cjihrig/node-process-metrics.svg)
[![belly-button-style](https://img.shields.io/badge/eslint-bellybutton-4B32C3.svg)](https://github.com/cjihrig/belly-button)

Get process, system, memory, CPU, and event loop metrics from a Node.js process. Can be used synchronously, or as an event emitter.

## Basic Usage

```javascript
'use strict';
const NodeProcessMetrics = require('node-process-metrics');

// Use synchronously
const pm = new NodeProcessMetrics();
console.log(pm.metrics());

// Use as an event emitter
const pm = new NodeProcessMetrics({ period: 1000 });

pm.on('metrics', (metrics) => {
  console.log(metrics);
});
```

## API

`node-process-metrics` exports a single constructor with the following API.

### `NodeProcessEmitter([options])`

  - Arguments
    - `options` (object) - An optional configuration supporting the following options:
      - `period` (number) - The amount of time that should pass between `'metrics'` events being emitted. If not specified, `'metrics'` events will not automatically be emitted.
      - `loop` (boolean) - Indicates whether event loop delays should be measured. If `false`, event loop delays will be reported as `NaN`. Defaults to `true`.
      - `loopPeriod` (number) - The period used to sample the event loop delay. Defaults to `1000` (one second). Ignored if `loop` is `false`.

### `'metrics'` Event

The `'metrics'` event contains the following data.

- `process` (object) - Process level information.
- `system` (object) - System level information containing the following fields, including the system architecture, hostname, load average, platform, amount of free memory, amount of total memory, and system uptime.
- `cpu` (array) - Result of `Os.cpus()`.
- `loop` (number) - The delay associated with each event loop turn, measured in milliseconds.
- `handles` (number) - The number of handles associated with the event loop.
- `requests` (number) - The number of requests associated with the event loop.
