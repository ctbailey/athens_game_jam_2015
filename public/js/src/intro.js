var stage = require('./stage');
var background = require('./background');
var backingTrack = require('./backing_track');
var keyboard = require('./keyboard');
var gameStart = require('./game_start_time');
var timestamp = require('./timestamp');
var updateHealthDisplay = require('./health_meter');

var copy = "A long, long time ago in a galaxy\na moderate distance away, the \nE.E.E.E.E.E.E.E., commonly\nknown as the Alliance of the\nEight E's, lent their greatest\nmusical instruments, the Really\nSacred Utensils of Whimsical\nDelight, to the famed robot\ncomposer, Beethoven 9000.\n\nThey were like, \"Don\'t lose these man.\"\nBut he did even worse.\nBeethoven 9000 stole them to use for his \nEvil Crystalline Orchestra of Doom.\n\nWhat a jerk.\n\nSomeone has to get them back.\nLooks like it's gonna be you.\nTap SPACE with the music.\nMove with WASD.\n\nGood luck.";

//var introMusicLoop = new Howl({
  //urls: ['audio/intro_loop.mp3'],
  //onplay: function() {
    //backingTrack.getTrack("ambience").play();
  //},
  //loop: true
//});

var skippedIntro = false;

function intro(onIntroFinished) {
  var text = new PIXI.Text(copy, {font: "70px Arial", fill: "yellow", align: "center"});
  text.anchor.y = 0;
  text.anchor.x = 0.5;
  text.x = window.innerWidth / 2;
  text.y = window.innerHeight + 0;
  stage.addChild(text);
  background.alpha = 0;
  var delay = 30;
  var scrollrate = 1.5;

  var enterKey = keyboard(13);
  enterKey.press = function skip() {
    skippedIntro = true;
    delay = 1;
    scrollrate = 5;
  };

  function alphaLerp(textY) {
    var t = (textY + text.height) / (window.innerHeight + text.height);
    return 1 + t * (0 - 1);
  }
  setTimeout(scrollText, delay);
  function scrollText() {
    text.y -= scrollrate;
    // linear interpolation between
    // alpha = 0 at the beginning
    // and alpha = 1 at the end
    background.alpha = alphaLerp(text.y);
    if(text.y > -text.height) {
      setTimeout(scrollText, delay);
    } else {
      stage.removeChild(text);
      background.alpha = 1;
      gameStart.introEnd = timestamp();
      updateHealthDisplay();
      if(skippedIntro) {
        backingTrack.getTrack("loop1").play();
      }
    }
  }
}

module.exports = intro;
