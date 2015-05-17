/* jshint browserify: true */
'use strict';

var playerBullets = require('./player_bullets');
var stage = require('./stage');
var spriteFromImage = require('./sprite_from_image');

var anchor = { x: 0.5, y: 1 };
var i = 0;

module.exports = function fire(player) {
  var phononStartPos = { x: player.x, y: player.y };

  var imagePath = "img/phonon" + i;
  if(player.powerUp()) {
    imagePath +=  "-power_up";
  }
  imagePath += ".png";

  var phonon = spriteFromImage(imagePath, anchor, phononStartPos);
  phonon.width = 20;
  phonon.height = 50;
  phonon.hitBox = function() { 
    var bb = {
      x: phonon.x - (phonon.width * anchor.x), 
      y: phonon.y - (phonon.height * anchor.y),
      width: phonon.width,
      height: phonon.height
    };
    return bb;
  };

  stage.addChild(phonon);
  playerBullets.push(phonon);

  i++;
  if(i > 1) i = 0;
};
