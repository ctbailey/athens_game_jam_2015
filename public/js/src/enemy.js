/* jshint browserify: true */
'use strict';

var stage = require('./stage');
var enemyBullets = require('./enemy_bullets');
var spriteFromImage = require('./sprite_from_image');
var timestamp = require('./timestamp');
var em = require('./event_manager');

var anchor = { x: 0.5, y: 0.5 };
var imagePath = "img/enemy.png";

var smallWidth = 50;
var smallHeight = 50;
var bigWidth = 60;
var bigHeight = 60;

module.exports = function() {
  var enemy = spriteFromImage(imagePath, anchor);
  var x = Math.random() * window.innerWidth;
  var y = enemy.height * anchor.y ;
  enemy.x = x;
  enemy.y = y;
  enemy.hitBox = function() {
    return {
      x: enemy.x - (enemy.width * anchor.x), 
      y: enemy.y - (enemy.height * anchor.y), 
      width: enemy.width,
      height: enemy.height
    };
  };
  enemy.pulsing = true; //(Math.random() > 0.7);
  em.on('beat', function() {
    enemy.pulsing = !enemy.pulsing;
    if(enemy.pulsing) {
      enemy.width = bigWidth;
      enemy.height = bigHeight;
    } else {
      enemy.width = smallWidth;
      enemy.height = smallHeight;
    }

  });

  enemy.lastFired = 0;

  enemy.fire = function() {
    var bulletAnchor = { x: 0.5, y: 0 }; 
    var startPos = { x: enemy.x, y: enemy.y };
    var imagePath = "img/phonon1.png";
    var bullet = spriteFromImage(imagePath, bulletAnchor, startPos);
    bullet.width = 20;
    bullet.height = 50;
    bullet.hitBox = function() { 
      var bb = {
        x: bullet.x - (bullet.width * bulletAnchor.x), 
        y: bullet.y - (bullet.height * bulletAnchor.y),
        width: bullet.width,
        height: bullet.height
      };
      return bb;
    };
    enemy.lastFired = timestamp();
    stage.addChild(bullet);
    enemyBullets.push(bullet);
  };

  return enemy;
};
