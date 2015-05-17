/* jshint browserify: true */
'use strict';

var keyboard = require('./keyboard');
var spriteFromImages = require('./sprite_from_images');
var timestamp = require('./timestamp');
var util = require('./util');
var sound = require('./sound');
var sfx = require('./sfx');
var rawFire = require('./fire');

var player = makePlayer();
var fire = function() {
  return rawFire(player);
};
  
function makePlayer() {
  var playerAnchor = { x: 0.5, y: 0.5 };
  var playerStartPos = { x: window.innerWidth / 2,  y: window.innerHeight };
  var imagePaths = [];
  for(var i = 0; i < 5; i++) {
    imagePaths.push("img/player" + i + ".png");
  }
  var player = spriteFromImages(imagePaths, playerAnchor, playerStartPos);

  player.width = 75;
  player.height = 75;
  player.hitBox = function () {
    var bb = {
        x: player.x - (player.width * playerAnchor.x), 
        y: player.y - (player.height * playerAnchor.y),
        width: player.width,
        height: player.height
      };
      return bb;
    };

  player.powerUpCount = 0;
  player.powerUp = function() {
    return this.powerUpCount > 3;
  };

  player.input = playerInput();
  player.health = 5;

  return player;
}

var lastShotTime = 0;

function playerInput() {
  var upKey = keyboard(87); // W
  var leftKey = keyboard(65); // A
  var downKey = keyboard(83); // S
  var rightKey = keyboard(68); // D
  var fireKey = keyboard(32); // SPACE
  var input = {
    up: isKeyPressed(upKey),
    left: isKeyPressed(leftKey),
    right: isKeyPressed(rightKey),
    down: isKeyPressed(downKey)
  };
  
  fireKey.press = function logShot() {
    if (canFire()) {
      console.log('something');
      lastShotTime = timestamp();
      var shots = sound.makeShots();
      if(shots[0].rating === "perfect") {
        player.powerUpCount++;
      } else { 
        player.powerUpCount = 0;
      }
      var textureNumber = Math.min(player.powerUpCount, 4);
      player.useTexture(textureNumber);

      shots.forEach(scheduleShot);
    }
  };


  function isKeyPressed(keyObject) {
    return function() {
      return keyObject.isDown;
    };
  }

  return input;
}

function canFire() {
  return util.timeElapsedSince(lastShotTime) > 500;
}


function scheduleShot(shot) {
  setTimeout(shoot(shot), shot.delay);
}

function shoot(shot) {
  return function() {
    sfx.onPlayerFire(shot.rating).play();
    fire();
  };
}

module.exports = player;
