'use strict';

const conf = require('../conf/app.conf'),
  bunyan = require('bunyan'),
  path = require('path'),
  log = bunyan.createLogger({
    name: `${path.basename(__dirname)}/${path
      .basename(__filename)
      .replace(/\.js/, '')}`,
    level: conf.log.level
  });

class FilteringService {
  constructor(req) {
    this.req = req;
  }

  filterObjectOnlyKnownKeys(object, knownKeys) {
    log.debug(
      `Filtering object keys: ${JSON.stringify(
        object
      )} to only include known values: ${JSON.stringify(knownKeys)} for ${
        this.req.headers.reqid
      }`
    );

    const result = {};

    for (const key in object) {
      if (knownKeys.includes(key)) {
        result[key] = object[key];
      }
    }

    return result;
  }

  filterNullValues(object) {
    log.debug(
      `Filtering object keys with null values from : ${JSON.stringify(
        object
      )} for ${this.req.headers.reqid}`
    );

    const result = {};

    for (const key in object) {
      if (object[key] != null) {
        result[key] = object[key];
      }
    }

    return result;
  }

  filterCollection(collection, filters) {
    log.debug(
      `Filtering collection: ${JSON.stringify(
        collection
      )} with ${JSON.stringify(filters)} for ${this.req.headers.reqid}`
    );

    return collection.filter(item =>
      Object.keys(filters).every(key => {
        if (filters[key] != null) {
          // case insensitive match for string
          const caseInsensitiveFilter =
              typeof filters[key] === 'string'
                ? filters[key].toUpperCase()
                : filters[key],
            caseInsensitiveItem =
              typeof item[key] === 'string'
                ? item[key].toUpperCase()
                : item[key];

          // == so that "1" is equal to 1
          return caseInsensitiveFilter == caseInsensitiveItem;
        }

        return true;
      })
    );
  }
}

module.exports = FilteringService;
