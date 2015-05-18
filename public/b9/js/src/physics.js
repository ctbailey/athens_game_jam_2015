/* jshint browserify: true */
'use strict';

var playerPhysics = require('./player_physics');
var enemyPhysics = require('./enemy_physics');

function physics(dt) {
  playerPhysics(dt);
  enemyPhysics(dt);
}

module.exports = physics;
