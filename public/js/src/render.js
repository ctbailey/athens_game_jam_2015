/* jshint browserify: true */
'use strict';

var background = require('./background');
var player = require('./player');
var stage = require('./stage');
var physics = require('./physics');
var enemies = require('./enemies');

// order matters
stage.addChild(background); 
stage.addChild(player);

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.view);

module.exports = function render(dt) {
  renderer.render(stage);
};
