/* jshint browserify: true */
'use strict';

var stage = require('./stage');
var timestamp = require('./timestamp');
var util = require('./util');
var player = require('./player');
var collision = require('./collision');
var sfx = require('./sfx');
var gameStart = require('./game_start_time');
var preboss = require('./preboss');
var updateHealthDisplay = require('./health_meter');
var em = require('./event_manager');
var enemyCounter = require('./enemy_counter');
var warning = "Beethoven 9000 has dispatched \na ton of forces.\nWhat a jerk.\n\nKill 50 to win.";

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
      enemiesToRemove.push(enemy);
    }
  });

  enemiesToRemove.forEach(function(enemy) {
    stage.removeChild(enemy);
    util.remove(enemies, enemy);
  });

  bullets(dt);
}

var lastSpawnTime = 0;
function shouldSpawnEnemy() {
  return util.timeElapsedSince(lastSpawnTime) > spawnDelay() && enemies.length < maxEnemies();
}

var durationBeforeBoss = 15  * 1000;
var minEnemies = 1;
var transitionedToPreboss = false;
var bossFight = false;
var enemiesKilledDuringBossFight = 0;
var alreadyWon = false;
function boss() {
  enemyCounter();
  em.on('enemy killed', function() { // boss fight enemy kills counted here
    enemiesKilledDuringBossFight++;
    if(enemiesKilledDuringBossFight > 49) {
      bossFight = false;
      if(!alreadyWon) {
        alreadyWon = true;
        preboss(null, "Congratulations! You beat B9.", 200000, "outro");
      }
    }
  });
  bossFight = true;
}

function lerp(initial, target) {
  var t;
  if(!gameStart.introEnd) {
    t = 0;
  } else {
    t = util.timeElapsedSince(gameStart.introEnd) / durationBeforeBoss;
    if(t > 1) {
      t = 0;
      minEnemies = 0;
      if(enemies.length === 0 && !transitionedToPreboss) {
        transitionedToPreboss = true;
        preboss(boss, warning, 2000, "preboss");
      }
    }
  }

  return target + t * (initial - target);
}
function maxEnemies() {
  var mx = lerp(50, minEnemies);
  if(bossFight) {
    mx = 150;
  }
  return mx;
}

function spawnDelay() {
  var del = lerp(500, 1000);
  if(bossFight) {
    del = 100;
  }
  return del;
}

function shouldFire(enemy) {
  return util.timeElapsedSince(enemy.lastFired) > enemyFireRate();
}

function enemyFireRate() {
  var fireRate = lerp(1000, 5000);
  if(bossFight) {
    fireRate = 10000;
  }
  return fireRate;
}

function spawnEnemy() {
  lastSpawnTime = timestamp();
  var enemy = makeEnemy();
  stage.addChild(enemy);
  return enemy;
}

var bulletSpeed = 200;
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
    updateHealthDisplay();
    console.log(player.health);
    if(player.health < 1) {
      stage.removeChild(player);
    }
    util.remove(enemyBullets, bullet);
    stage.removeChild(bullet);
  }
}

module.exports = enemyPhysics;
