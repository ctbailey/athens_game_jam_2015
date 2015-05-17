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
