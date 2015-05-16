var express = require('express');
var router = express.Router();

/* GET home page. */

createRoute('/', 'views/index.html');

function createRoute(urlFragment, path) {
  router.get(urlFragment, function(req, res, next) {
    function onComplete(err) {
      if (err) {
        console.log(err);
        res.status(err.status).end();
      }
      else {
        console.log('Request completed.');
      }
    }

    var options = { root: __dirname + '/public/'};
    res.sendFile(path, options, onComplete);
  });
}

module.exports = router;