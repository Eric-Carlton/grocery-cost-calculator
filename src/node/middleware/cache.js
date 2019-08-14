'use strict';

const conf = require('../conf/app.conf'),
  cache = {},
  bunyan = require('bunyan'),
  log = bunyan.createLogger({
    name: 'cache.js',
    level: conf.log.level
  });

function getCached(key) {
  const cached = cache[key];

  if (cached) {
    if (
      new Date().getTime() - cached.time >=
      conf.cacheOpts.standardTTL * 1000
    ) {
      delete cache[key];
      return undefined;
    }

    return cached.value;
  }

  return undefined;
}

function setCache(key, value) {
  cache[key] = {
    time: new Date().getTime(),
    value: value
  };
}

function clearCacheForKey(key) {
  delete cache[key];
}

module.exports = {
  priority: 5,
  use: conf.cacheOpts
    ? (req, res, next) => {
        const cacheKey = req.url,
          cachedRes = getCached(cacheKey);

        if (req.method === 'GET') {
          if (cachedRes) {
            log.trace(
              `Responding to ${req.method} request ${req.headers.reqid} to ${req.originalUrl} with cached data`
            );
            return res.json(JSON.parse(cachedRes));
            // do not call next here since a response has already been sent
          } else {
            const original = res.send;
            res.send = function(body) {
              if (res.statusCode === 200) {
                setCache(cacheKey, body);
              }
              res.send = original;
              res.send.apply(res, arguments);
            };
            // no cached response, so continue handling
            return next();
          }
        } else if (cachedRes) {
          // PUT / POST / DELETEs modify a collection, so clear the cached GET value if there is one
          log.trace(
            `Clearing GET cache for ${cacheKey} because of ${req.method} request ${req.headers.reqid} to ${req.originalUrl}`
          );
          clearCacheForKey(cacheKey);
          return next();
        }

        next();
      }
    : (req, res, next) => {
        // no cacheOpts? Then this is a noop
        next();
      }
};
