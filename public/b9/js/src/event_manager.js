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
