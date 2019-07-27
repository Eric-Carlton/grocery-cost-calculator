'use strict';

const conf = require('../conf/app.conf'),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({
    name: 'filteringService.js',
    level: conf.log.level
  });

class FilteringService {
  constructor(req) {
    this.req = req;
  }

  filterObjectOnlyKnownKeys(object, knownKeys) {
    const result = {};

    for (const key in object) {
      if (knownKeys.includes(key)) {
        result[key] = object[key];
      }
    }

    return result;
  }

  filterNullValues(object) {
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

          return caseInsensitiveFilter === caseInsensitiveItem;
        }

        return true;
      })
    );
  }
}

module.exports = FilteringService;
