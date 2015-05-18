var stage = require('./stage');
var spriteFromImage = require('./sprite_from_image');
var player = require('./player');
var util = require('./util');
var healthSprites = [];

function removeSprite(sp) {
  stage.removeChild(sp);
}

var anchor = {x: 1, y: 1 };
function updateHealthDisplay() {
  healthSprites.forEach(removeSprite);
  healthSprites = [];

  for(var i = 0; i < player.health; i++) {
    var healthSprite = spriteFromImage("img/player0.png", anchor);
    healthSprite.width = 35;
    healthSprite.height = 35;
    healthSprite.x = window.innerWidth;
    healthSprite.y = window.innerHeight - (healthSprite.height * i);
    stage.addChild(healthSprite);
    healthSprites.push(healthSprite);
  }
}

updateHealthDisplay();

module.exports = updateHealthDisplay;
