/* jshint browserify: true */
'use strict';

var timestamp = require('./timestamp');
var backingTrack = require('./backing_track');

var beatDuration = backingTrack.beatDuration;
var numBeats = backingTrack.numBeats;
var backingTrackDuration = backingTrack.duration;

function evaluate(distanceToClosestBeat) {
  var absDistance = Math.abs(distanceToClosestBeat);
  if(absDistance < 0.1) {
    return "perfect";
  } else if (absDistance < 0.15) {
    return "good";
  } else {
    return "bad";
  }
}

function getShotDelays(rating, closestBeatPos) {
  var numShots;
  if(rating === "perfect") {
    numShots = 4;
  } else if (rating === "good") {
    numShots = 2;
  } else if (rating === "bad") {
    numShots = 1;
  }
  var shotDuration = beatDuration / numShots; // seconds

  var shotDelays = [];
  for(var i = 0; i < numShots; i++) {
    var delay = (shotDuration * i) * 1000; // ms
    shotDelays.push(delay);
  }
  return shotDelays;
}

function makeShots() {
  var timing = backingTrack.getTiming();
  var rating = evaluate(timing.distanceToClosestBeat);
  var shotDelays = getShotDelays(rating, timing.closestBeatPos);
  var shots = shotDelays.map(function makeShot(delay) {
    return { rating: rating, delay: delay };
  });
  return shots;
}

module.exports = {
  makeShots: makeShots
};
