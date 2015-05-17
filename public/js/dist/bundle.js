(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// jshint browserify: true
// jshint browser: true
'use strict';
var backingTrack = require('./backing_track');
var em = require('./event_manager');
var lastDistanceBelowZero = true;

module.exports = function loop() {
  var distance = (backingTrack.getTiming().distanceToClosestBeat) / 1000;
  if(distance >= 0 && lastDistanceBelowZero) {
    em.notify('beat');
  }
  lastDistanceBelowZero = (distance < 0);
};


},{"./backing_track":3,"./event_manager":9}],2:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

var spriteFromImage = require('./sprite_from_image');
var background = makeBackground();

function makeBackground() {
  background = spriteFromImage("img/background.png", { x: 0, y: 0 }, { x: 0, y: 0});
  background.width = window.innerWidth;
  background.height = window.innerHeight;
  return background;
}

module.exports = background;

},{"./sprite_from_image":21}],3:[function(require,module,exports){
// var ambience = new Howl({
//   urls: ['audio/player_engine_normal.mp3'],
//   loop: true
// });

var audio = new Howl({
  urls: ['audio/backing_track.mp3'],
  onend: function() {
    audio.play();
  }
});

var numBeats = 32;
var audioDuration = 17.455600907029478; // seconds
var beatDuration = audioDuration / numBeats;

function getTiming() {
  var currentPos = audio.pos();
  var currentPosInBeats = currentPos / beatDuration;
  var closestBeatPos = Math.round(currentPosInBeats) * beatDuration;
  var distanceToClosestBeat = currentPos - closestBeatPos;
  //console.log(distanceToClosestBeat);
  return {
    currentPos: currentPos,
    currentPosInBeats: currentPosInBeats,
    closestBeatPos: closestBeatPos,
    distanceToClosestBeat: distanceToClosestBeat
  };
}

module.exports = {
  numBeats: numBeats,
  duration: audioDuration,
  beatDuration: beatDuration,
  getTiming: getTiming,
  audio: audio
};

},{}],4:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

module.exports = function(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.height + a.y > b.y
  );
};

},{}],5:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

var enemies = [];
module.exports = enemies;

},{}],6:[function(require,module,exports){
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

},{"./enemy_bullets":7,"./event_manager":9,"./sprite_from_image":21,"./stage":23,"./timestamp":24}],7:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

var enemyBullets = [];
module.exports = enemyBullets;

},{}],8:[function(require,module,exports){
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

},{"./collision":4,"./enemies":5,"./enemy":6,"./enemy_bullets":7,"./player":15,"./sfx":19,"./stage":23,"./timestamp":24,"./util":25}],9:[function(require,module,exports){
var util = require('./util');
var listeners = {};

function on(eventType, callback) {
  ensureExists(eventType);
  listeners[eventType].push(callback);
}

function off(eventType, callback) {
  if(!(eventType in listeners)) {
    throw (eventType + ' not found in event manager');
  }
  util.remove(listeners[eventType], callback);
}

function notify(eventType, event) {
  ensureExists(eventType);
  listeners[eventType].forEach(function(callback) {
    callback.call(null, event);
  });
}

function ensureExists(eventType) {
  if(!(eventType in listeners)) {
    listeners[eventType] = [];
  }
}

var eventManager = {
  on: on,
  off: off,
  notify: notify
};

module.exports = eventManager;

},{"./util":25}],10:[function(require,module,exports){
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

},{"./player_bullets":16,"./sprite_from_image":21,"./stage":23}],11:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

var timestamp = require('./timestamp');
var physics = require('./physics');
var audio = require('./audio_loop');
var render = require('./render');
var intro = require('./intro');

var now,
    dt   = 0,
    last = timestamp(),
    physicsStep = 1/60;

function frame() {
  console.log('looping...');
  now = timestamp();
  dt += Math.min(1, (now - last) / 1000);
  while(dt > physicsStep) {
    dt -= physicsStep;
    physics(physicsStep);
  }
  audio(dt);
  render(dt);
  last = now;
  requestAnimationFrame(frame);
}

setTimeout(function() {
  intro(frame);
}, 4000);

module.exports = frame;
},{"./audio_loop":1,"./intro":12,"./physics":14,"./render":18,"./timestamp":24}],12:[function(require,module,exports){
var stage = require('./stage');
var background = require('./background');

var copy = "A long, long time ago in a galaxy\na moderate distance away, the \nE.E.E.E.E.E.E.E., commonly\nknown as the Alliance of the\nEight E's, lent their greatest\nmusical instruments, the Really\nSacred Utensils of Whimsical\nDelight, to the famed robot\ncomposer, Beethoven 9000.\n\nThey were like, \"Don\'t lose these man.\"\nBut he did even worse.\nBeethoven 9000 stole them to use for his \nEvil Crystalline Orchestra of Doom.\n\nWhat a jerk.\n\nSomeone has to get them back.\nLooks like it's gonna be you.\nTap SPACE with the music.\nMove with WASD.\n\nGood luck.";

var introMusicLoop = new Howl({
  urls: ['audio/intro_loop.mp3'],
  loop: true
});

var introMusic = new Howl({
  urls: ['audio/intro.mp3'],
  autoplay: true,
  onend: function () {
    introMusicLoop.play();
  }
});

function intro(callback) {
  requestAnimationFrame(callback);
  var text = new PIXI.Text(copy, {font: "70px Arial", fill: "yellow", align: "center"});
  text.anchor.y = 0;
  text.anchor.x = 0.5;
  text.x = window.innerWidth / 2;
  text.y = window.innerHeight;
  stage.addChild(text);
  background.alpha = 0;
  var delay = 15;

  function alphaLerp(textY) {
    var t = (textY + text.height) / (window.innerHeight + text.height);
    return 1 + t * (0 - 1);
  }
  setTimeout(scrollText, delay);
  function scrollText() {
    text.y -= 1.5;
    // linear interpolation between
    // alpha = 0 at the beginning
    // and alpha = 1 at the end
    background.alpha = alphaLerp(text.y);
    if(text.y > -text.height) {
      setTimeout(scrollText, delay);
    } else {
      stage.removeChild(text);
      background.alpha = 1;
      
    }
  }
}

module.exports = intro;

},{"./background":2,"./stage":23}],13:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

module.exports = function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
      event.preventDefault();
    }
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
};

},{}],14:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

var playerPhysics = require('./player_physics');
var enemyPhysics = require('./enemy_physics');

function physics(dt) {
  playerPhysics(dt);
  enemyPhysics(dt);
}

module.exports = physics;

},{"./enemy_physics":8,"./player_physics":17}],15:[function(require,module,exports){
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

},{"./fire":10,"./keyboard":13,"./sfx":19,"./sound":20,"./sprite_from_images":22,"./timestamp":24,"./util":25}],16:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

var playerBullets = [];
module.exports = playerBullets;

},{}],17:[function(require,module,exports){
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

var playerSpeed = 500; // px per second
var phononSpeed = 600;

function playerPhysics(dt) {
  move(dt);
  bullets(dt);
}

function move(dt) {
  if(player.input.left()) player.x += -playerSpeed * dt;
  if(player.input.right()) player.x += playerSpeed * dt;
  if(player.input.down()) player.y += playerSpeed * dt;
  if(player.input.up()) player.y += -playerSpeed * dt;
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
      util.remove(enemies, enemy);
      stage.removeChild(enemy);
      sfx.onEnemyDamaged.play();
    }
  });
}

module.exports = playerPhysics;

},{"./collision":4,"./enemies":5,"./player":15,"./player_bullets":16,"./sfx":19,"./stage":23,"./util":25}],18:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

var background = require('./background');
var player = require('./player');
var stage = require('./stage');
var physics = require('./physics');
var enemies = require('./enemies');

// order matters
stage.addChild(background); 
stage.addChild(player);

var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.view);

module.exports = function render(dt) {
  renderer.render(stage);
};

},{"./background":2,"./enemies":5,"./physics":14,"./player":15,"./stage":23}],19:[function(require,module,exports){
var perfect = new Howl({
  urls: ['audio/on_player_fire_perfect.mp3']
});

var good = new Howl({
  urls: ['audio/on_player_fire_good.mp3']
});

var bad = new Howl({
  urls: ['audio/on_player_fire_bad.mp3']
});

var onPlayerFire = function (rating) {
  switch(rating) {
    case 'perfect':
      return perfect;
    case 'good':
      return good;
    case 'bad':
      return bad;
  }
};

var onPlayerDamaged = new Howl({
  urls: ['audio/on_player_damaged.mp3']
});

var onEnemyDamaged = new Howl({
  urls: ['audio/enemy_ded.mp3']
});

module.exports = {
  onPlayerFire: onPlayerFire,
  onPlayerDamaged: onPlayerDamaged,
  // onEnemyFire: onEnemyFire,
  onEnemyDamaged: onEnemyDamaged
};
},{}],20:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

var timestamp = require('./timestamp');
var backingTrack = require('./backing_track');

var beatDuration = backingTrack.beatDuration;
var numBeats = backingTrack.numBeats;
var backingTrackDuration = backingTrack.duration;

function evaluate(distanceToClosestBeat) {
  var absDistance = Math.abs(distanceToClosestBeat);
  if(absDistance < 0.1) {
    return "perfect";
  } else if (absDistance < 0.15) {
    return "good";
  } else {
    return "bad";
  }
}

function getShotDelays(rating, closestBeatPos) {
  var numShots;
  if(rating === "perfect") {
    numShots = 4;
  } else if (rating === "good") {
    numShots = 2;
  } else if (rating === "bad") {
    numShots = 1;
  }
  var shotDuration = beatDuration / numShots; // seconds

  var shotDelays = [];
  for(var i = 0; i < numShots; i++) {
    var delay = (shotDuration * i) * 1000; // ms
    shotDelays.push(delay);
  }
  return shotDelays;
}

function makeShots() {
  var timing = backingTrack.getTiming();
  var rating = evaluate(timing.distanceToClosestBeat);
  var shotDelays = getShotDelays(rating, timing.closestBeatPos);
  var shots = shotDelays.map(function makeShot(delay) {
    return { rating: rating, delay: delay };
  });
  return shots;
}

module.exports = {
  makeShots: makeShots
};

},{"./backing_track":3,"./timestamp":24}],21:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

module.exports = function spriteFromImage(path, anchor, position) {
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

},{}],22:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

module.exports = function spriteFromImages(paths, anchor, position) {
  var textures = paths.map(function getTexture(path) {
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

},{}],23:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

var stage = new PIXI.Stage(0x66FF99);
module.exports = stage;

},{}],24:[function(require,module,exports){
/* jshint browserify: true */
'use strict';

module.exports = function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};

},{}],25:[function(require,module,exports){
// jshint browserify: true 
// jshint browser: true

'use strict';

var stage = require('./stage');
var timestamp = require('./timestamp');

function isOnStage(sprite) {
  return (sprite.y > 0 && sprite.y < window.innerHeight &&
          sprite.x > 0 && sprite.x < window.innerWidth);
}

function remove(array, elt) {
  var index = array.indexOf(elt);
  if (index > -1) {
      array.splice(index, 1);
  }
}

function timeElapsedSince(t) { // since last enemy physics update
  var now = timestamp();
  return now - t;
}

module.exports = {
  remove: remove,
  isOnStage: isOnStage,
  timeElapsedSince: timeElapsedSince
};

},{"./stage":23,"./timestamp":24}]},{},[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25]);
