/* jshint browserify: true */
'use strict';

var spriteFromImage = require('./sprite_from_image');
var background = makeBackground();

function makeBackground() {
  background = spriteFromImage("img/background.png", { x: 0, y: 0 }, { x: 0, y: 0});
  background.width = window.innerWidth;
  background.height = window.innerHeight;
  return background;
}

module.exports = background;
