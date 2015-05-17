var background = require('./background');
var stage = require('./stage');
var backingTrack = require('./backing_track');

module.exports = function(callback, words, duration, trak) {
  backingTrack.getTrack(trak).play();
 function fadeOutScreen() {
   background.alpha -= 0.01;
   if(background.alpha > 0) {
     setTimeout(fadeOutScreen, 40);
   } else {
     fadeInText();
   }
 } 

 function fadeInText() {
   text.alpha += 0.01;
   if(text.alpha < 1) {
     setTimeout(fadeInText, 10);
   } else {
     setTimeout(function() {
       fadeOutText();
       fadeInScreen();
     }, duration);
   }
 }

 function fadeOutText() {
   text.alpha -= 0.01;
   if(text.alpha > 0) {
     setTimeout(fadeOutText, 10);
   } 
 }

 function fadeInScreen() {
   background.alpha += 0.01;
   if(background.alpha < 1) {
     setTimeout(fadeInScreen, 10);
   } else {
     callback();
   }
 }
 var text = new PIXI.Text(words, {font: "70px Arial", fill: "yellow", align: "center"});
 text.anchor.y = 0.5;
 text.anchor.x = 0.5;
 text.x = window.innerWidth / 2;
 text.y = window.innerHeight / 2;
 stage.addChild(text);
 text.alpha = 0;
 fadeOutScreen();

};
