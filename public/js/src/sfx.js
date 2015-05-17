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