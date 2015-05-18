// jshint browserify: true
// jshint browser: true
'use strict';
var backingTrack = require('./backing_track');
var em = require('./event_manager');
var lastDistanceBelowZero = true;

module.exports = function loop() {
  var distance = (backingTrack.getTiming().distanceToClosestBeat) / 1000;
  if(distance >= 0 && lastDistanceBelowZero) {
    em.notify('beat');
  }
  lastDistanceBelowZero = (distance < 0);
};

