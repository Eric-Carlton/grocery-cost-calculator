'use strict';

class CrudCache {
  static getCollectionForUrl(key) {
    // first strip any query params off of the key
    key = key.replace(/\?.*/, '');

    /**
     * To isolate the collection here, we're checking if the final route parameter
     * is a number. If it is, we remove it from the route to create the collectionUri.
     * If it is not, then the collectionUri is equivalent to the key provided minus
     * any query params.
     */
    const routeParams = key.split('/'),
      finalParam = routeParams.pop();
    if (isNaN(finalParam)) {
      routeParams.push(finalParam);
    }

    return routeParams.join('/');
  }

  constructor() {
    this.cache = {};
  }

  store(key, value) {
    this.cache[key] = value;
  }

  retrieve(key) {
    return this.cache[key];
  }

  clear(key) {
    delete this.cache[key];
  }

  clearCacheForCollection(collectionUri) {
    /*
     * key looks like /api/collection for POST, /api/collection/id for PUT / DELETE
     * in both cases we want to clear any cached values for the stores collection
     * at /api/stores. To do so, we need to isolate the collection.
     *
     * In addition, we only want to clear the cache for keys that match /api/collection,
     * /api/collection?arbitraryFilter=filterVal, or /api/collection/id where id is the
     * id of the provided key. Any other ids should remain cached.
     */
    for (const cacheKey in this.cache) {
      if (
        cacheKey === collectionUri ||
        cacheKey.startsWith(`${collectionUri}?`)
      ) {
        this.clear(cacheKey);
      }
    }
  }
}

const conf = require('../conf/app.conf'),
  { readdirSync } = require('fs'),
  path = require('path'),
  routesToCache = readdirSync(
    path.join(
      path.dirname(require.main.filename),
      conf.express.crudOperationsPath
    ),
    {
      withFileTypes: true
    }
  )
    .filter(dirent => dirent.isDirectory())
    .map(dir => `${conf.express.apiRoutesPrefix || ''}/${dir.name}`),
  cache = new CrudCache(),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({
    name: 'crudCache.js',
    level: conf.log.level
  });

module.exports = {
  priority: 5,
  use: (req, res, next) => {
    // check if this is a CRUD route, if not we don't handle the cache for it
    if (routesToCache.includes(CrudCache.getCollectionForUrl(req.url))) {
      const cacheKey = req.url;

      if (req.method === 'GET') {
        const cachedRes = cache.retrieve(cacheKey);

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
              cache.store(cacheKey, body);
            }
            res.send = original;
            res.send.apply(res, arguments);
          };
          // no cached response, so continue handling
          next();
        }
      } else {
        const original = res.send;
        res.send = function() {
          // success could be anything in the 2xx range
          if (Math.floor(res.statusCode / 200) === 1) {
            log.trace(
              `Clearing GET cache for collection modified by ${req.headers.reqid}`
            );
            // clear cache for modified object
            cache.clear(cacheKey);
            // PUT / POST / DELETEs modify a collection, so clear any cached values for the entire collection
            cache.clearCacheForCollection(
              CrudCache.getCollectionForUrl(cacheKey)
            );
          }
          res.send = original;
          res.send.apply(res, arguments);
        };

        next();
      }
    } else {
      // we don't cache this route, so pass the request along
      next();
    }
  }
};
