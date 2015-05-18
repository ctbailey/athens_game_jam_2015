/* jshint browserify: true */
'use strict';

module.exports = function spriteFromImage(path, anchor, position) {
  path = "b9/" + path;
  var texture = PIXI.Texture.fromImage(path);
  var sprite = new PIXI.Sprite(texture);

  if(anchor) {
    sprite.anchor.x = anchor.x;
    sprite.anchor.y = anchor.y;
  }

  if(position) {
    sprite.position.x = position.x;
    sprite.position.y = position.y;
  }

  return sprite;
};
