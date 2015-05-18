// jshint browserify: true 
// jshint browser: true

'use strict';

var stage = require('./stage');
var timestamp = require('./timestamp');

function isOnStage(sprite) {
  return (sprite.y > 0 && sprite.y < window.innerHeight &&
          sprite.x > 0 && sprite.x < window.innerWidth);
}

function remove(array, elt) {
  var index = array.indexOf(elt);
  if (index > -1) {
      array.splice(index, 1);
  }
}

function timeElapsedSince(t) { // since last enemy physics update
  var now = timestamp();
  return now - t;
}

module.exports = {
  remove: remove,
  isOnStage: isOnStage,
  timeElapsedSince: timeElapsedSince
};
