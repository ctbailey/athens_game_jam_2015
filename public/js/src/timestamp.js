/* jshint browserify: true */
'use strict';

module.exports = function timestamp() {
  return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};
