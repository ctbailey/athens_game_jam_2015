var stage = require('./stage');
var em = require('./event_manager');

var enemyKilledCount = 0;
var text;
var enemiesKilledLabel =   " / 50";

function updateEnemyKilledCount() {
  text.setText(enemyKilledCount + enemiesKilledLabel);
}

module.exports = function() {
  text = new PIXI.Text(enemyKilledCount + enemiesKilledLabel, {font: "50px Arial", fill: "yellow", align: "center"});
  text.x = 0;
  text.y = 0;
  stage.addChild(text);

console.log('init enem counter');
  em.on('enemy killed', function() {
    enemyKilledCount++;
    updateEnemyKilledCount();
  });
};
