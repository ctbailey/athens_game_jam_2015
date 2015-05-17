/* jshint browserify: true */
'use strict';

var timestamp = require('./timestamp');
var physics = require('./physics');
var audio = require('./audio_loop');
var render = require('./render');
var intro = require('./intro');

var now,
    dt   = 0,
    last = timestamp(),
    physicsStep = 1/60;

function frame() {
  console.log('looping...');
  now = timestamp();
  dt += Math.min(1, (now - last) / 1000);
  while(dt > physicsStep) {
    dt -= physicsStep;
    physics(physicsStep);
  }
  audio(dt);
  render(dt);
  last = now;
  requestAnimationFrame(frame);
}

setTimeout(function() {
  intro(frame);
}, 4000);

module.exports = frame;