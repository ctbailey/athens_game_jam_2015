var perfect = new Howl({
  urls: ['b9/audio/on_player_fire_perfect.mp3'],
  volume: 0.3
});

var good = new Howl({
  urls: ['b9/audio/on_player_fire_good.mp3'],
  volume: 0.3
});

var bad = new Howl({
  urls: ['b9/audio/on_player_fire_bad.mp3'],
  volume: 0.3
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
  urls: ['b9/audio/on_player_damaged.mp3'],
  volume: 0.3
});

var onEnemyDamaged = new Howl({
  urls: ['b9/audio/enemy_ded.mp3'],
  volume: 0.1
});

module.exports = {
  onPlayerFire: onPlayerFire,
  onPlayerDamaged: onPlayerDamaged,
  // onEnemyFire: onEnemyFire,
  onEnemyDamaged: onEnemyDamaged
};
