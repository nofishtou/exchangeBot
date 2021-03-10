const cache = {};

function setToCache(key, value) {
  cache[key] = value;
}

function getFromCache(key) {
  return cache[key] || null;
}

module.exports.setToCache = setToCache;
module.exports.getFromCache = getFromCache;
