/* jshint browserify: true */
'use strict';

var util = require('./util');
var player = require('./player');
var stage = require('./stage');
var playerBullets = require('./player_bullets');
var enemies = require('./enemies');
var collision = require('./collision');
var sfx = require('./sfx');
var util = require('./util');

var playerSpeed = 500; // px per second
var phononSpeed = 600;

function playerPhysics(dt) {
  move(dt);
  bullets(dt);
}

function move(dt) {
  if(player.input.left()) player.x += -playerSpeed * dt;
  if(player.input.right()) player.x += playerSpeed * dt;
  if(player.input.down()) player.y += playerSpeed * dt;
  if(player.input.up()) player.y += -playerSpeed * dt;
}

function bullets(dt) {

  function update(bullet) {
    bullet.y -= phononSpeed * dt; 
    if(!util.isOnStage(bullet)) {
      stage.removeChild(bullet);
      util.remove(playerBullets, bullet);
    }

    checkCollisions(bullet);
  }

  playerBullets.forEach(update);
}

function checkCollisions(bullet) {
  enemies.forEach(function(enemy) {
    var c = collision(bullet.hitBox(), enemy.hitBox());
    if(c) {
      util.remove(enemies, enemy);
      stage.removeChild(enemy);
      sfx.onEnemyDamaged.play();
    }
  });
}

module.exports = playerPhysics;
