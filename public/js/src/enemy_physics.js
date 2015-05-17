/* jshint browserify: true */
'use strict';

var stage = require('./stage');
var timestamp = require('./timestamp');
var util = require('./util');
var player = require('./player');
var collision = require('./collision');
var sfx = require('./sfx');

var makeEnemy = require('./enemy');
var enemies = require('./enemies');
var enemyBullets = require('./enemy_bullets');

function enemyPhysics(dt) {
  if(shouldSpawnEnemy()) {
    enemies.push(spawnEnemy());
  }
  var enemiesToRemove = [];
  enemies.forEach(function(enemy) {
    var rand = Math.random();
    if(shouldFire(enemy) && rand > 0.9) {
      enemy.fire();
    }
    enemy.y += 100 * dt;
    if (!util.isOnStage(enemy)) {
      console.log('marking enemy for removal!');
      enemiesToRemove.push(enemy);
    }
  });

  enemiesToRemove.forEach(function(enemy) {
    console.log('before ' + enemies.length);
    stage.removeChild(enemy);
    util.remove(enemies, enemy);
    console.log('after ' + enemies.length);
  });

  bullets(dt);
}

var lastSpawnTime = 0;
function shouldSpawnEnemy() {
  return util.timeElapsedSince(lastSpawnTime) > 1000 && enemies.length < 20; 
}

function shouldFire(enemy) {
  return util.timeElapsedSince(enemy.lastFired) > 5000;
}

function spawnEnemy() {
  lastSpawnTime = timestamp();
  var enemy = makeEnemy();
  stage.addChild(enemy);
  return enemy;
}

var bulletSpeed = 300;
function bullets(dt) {

  function update(bullet) {
    bullet.y += bulletSpeed * dt;
    if (!util.isOnStage(bullet)) {
      stage.removeChild(bullet);
      util.remove(enemyBullets, bullet);
    }

    checkCollisions(bullet);
  }

  enemyBullets.forEach(update);
}


function checkCollisions(bullet) {
  var c = collision(bullet.hitBox(), player.hitBox());
  if (c) {
    // player was hit
    // play sound
    sfx.onPlayerDamaged.play();
    // decrease health
    player.health--;
    console.log(player.health);
    util.remove(enemyBullets, bullet);
    stage.removeChild(bullet);
  }
}

module.exports = enemyPhysics;
