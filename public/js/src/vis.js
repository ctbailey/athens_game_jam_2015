var stage = new PIXI.Stage(0x66FF99);
var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.view);

addBackground();
var player = addPlayer();
requestAnimationFrame(animate);

function animate() {
  requestAnimationFrame(animate);
  console.log(player.input);
  //player.rotation += 0.1;
  if(player.input === "left") player.x += -0.1;
  if(player.input === "right") player.x += 0.1;
  if(player.input === "down") player.y += -0.1;
  if(player.input === "up") player.y += 0.1;
  console.log(player.position);
  renderer.render(stage);
}

function addBackground() {
  background = addSpriteFromImage("img/background.png", { x: 0, y: 0 }, { x: 0, y: 0});
  background.width = window.innerWidth;
  background.height = window.innerHeight;
}

function addPlayer() {
  var playerAnchor = { x: 0.5, y: 1 };
  var playerStartPos = { x: window.innerWidth / 2,  y: window.innerHeight };
  player = addSpriteFromImage("img/player.png", playerAnchor, playerStartPos);
  player.width = 75;
  player.height = 75;
  player.input = "";

  var keys = {};
  keys['119'] = 'up';
  keys['97'] = 'left';
  keys['115'] = 'down';
  keys['100'] = 'right';

  $("html").keypress(onKeyDown);
  function onKeyDown(event) {
    console.log(event.charCode);
    var input = keys[event.charCode.toString()];
    player.input = input;
    console.log(player.input);
  }
  $("html").keyup(onKeyUp);
  function onKeyUp(event) {
    var input = keys[event.charCode.toString()];
    if(player.input === input) player.input = "";
  }

  return player;
}

function addSpriteFromImage(path, anchor, position) {
  var texture = PIXI.Texture.fromImage(path);
  sprite = new PIXI.Sprite(texture);
  sprite.anchor.x = anchor.x;
  sprite.anchor.y = anchor.y;
  sprite.position.x = position.x;
  sprite.position.y = position.y;
  stage.addChild(sprite);
  return sprite;
}

