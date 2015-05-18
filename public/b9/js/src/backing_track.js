var ambiencePlaying = false;

var ambience = new Howl({
  urls: ['b9/audio/ambience.mp3'],
  loop: true
});

var outro = new Howl({
  urls: ['b9/audio/outro.mp3'],
  onplay: function() {
    nowPlaying.stop();
    nowPlaying = loop1;
  }
});
// var engine = new Howl({
//   urls: ['b9/audio/player_engine_normal.mp3'],
//   loop: true
// });
var intro = new Howl({
  urls: ['b9/audio/intro.mp3'],
  onplay: function() {
    nowPlaying = intro;
  },
  onend: function () {
    loop1.play();
  },
  autoplay: true
});

var nowPlaying = intro;

var loop1 = new Howl({
  urls: ['b9/audio/level_loop1.mp3'],
  onplay: function() {
    nowPlaying.stop();
    nowPlaying = loop1;
  },
  onend: function() {
    if(!ambiencePlaying) {
      ambience.play();
      ambiencePlaying = true;
    }
    loop2.play();
  }
});
var loop2 = new Howl({
  urls: ['b9/audio/level_loop2.mp3'],
  onplay: function() {
    nowPlaying.stop();
    nowPlaying = loop2;
  },
  onend: function() {
    loop3.play();
  }
});
var loop3 = new Howl({
  urls: ['b9/audio/level_loop3.mp3'],
  onplay: function() {
    nowPlaying.stop();
    nowPlaying = loop3;
  },
  onend: function() {
    loop1.play();
  }
});
var preboss = new Howl({
  urls: ['b9/audio/preboss.mp3'],
  onplay: function() {
    nowPlaying.stop();
    nowPlaying = preboss;
  },
  onend: function() {
    loop3.play();
  }
});

var numBeats = 32;
var audioDuration = 17.455600907029478; // seconds
var beatDuration = audioDuration / numBeats;

function getTiming() {
  var currentPos = nowPlaying.pos();
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

function getTrack(name) {
  switch(name) {
    case "loop1":
      return loop1;
    case "loop2":
      return loop2;
    case "loop3":
      return loop3;
    case "preboss":
      return preboss;
    case "outro":
      return outro;
    case "ambience":
      return ambience;
    case "intro":
      return intro;
    case "now playing":
      return nowPlaying;
  }
}

module.exports = {
  numBeats: numBeats,
  duration: audioDuration,
  beatDuration: beatDuration,
  getTiming: getTiming,
  getTrack: getTrack
};
