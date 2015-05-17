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
var em = require('./event_manager');

var playerSpeed = 500; // px per second
var phononSpeed = 600;

function playerPhysics(dt) {
  bullets(dt);
  if(player.health < 1) {
    return;
  }
  move(dt);
}

function move(dt) {
  if(player.input.left() && player.x > 0) player.x += -playerSpeed * dt;
  if(player.input.right() && player.x < window.innerWidth) player.x += playerSpeed * dt;
  if(player.input.down() && player.y < window.innerHeight) player.y += playerSpeed * dt;
  if(player.input.up() && player.y > 0) player.y += -playerSpeed * dt;
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
      em.notify('enemy killed');
      util.remove(enemies, enemy);
      stage.removeChild(enemy);

      util.remove(playerBullets, bullet);
      stage.removeChild(bullet);

      sfx.onEnemyDamaged.play();
    }
  });
}

module.exports = playerPhysics;
