/* jshint browserify: true */
'use strict';

module.exports = function spriteFromImages(paths, anchor, position) {
  var textures = paths.map(function getTexture(path) {
    path = "b9/" + path;
    return PIXI.Texture.fromImage(path);
  });

  var sprite = new PIXI.Sprite(textures[0]);
  sprite.anchor.x = anchor.x;
  sprite.anchor.y = anchor.y;
  sprite.position.x = position.x;
  sprite.position.y = position.y;
  sprite.useTexture = function(i) {
    sprite.texture = textures[i];
  };
  sprite.name = "player";
  return sprite;
};
