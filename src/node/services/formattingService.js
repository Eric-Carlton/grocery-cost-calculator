'use strict';

const conf = require('../conf/app.conf'),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({
    name: 'filteringService.js',
    level: conf.log.level
  });

class FormattingService {
  constructor(req) {
    this.req = req;
  }

  formatKeysCamelToSnake(object) {
    log.debug(
      `Formatting keys object: ${JSON.stringify(
        object
      )} from camel to snake for ${this.req.headers.reqid}`
    );

    const result = {};

    for (const key in object) {
      const camelKey = key
        .replace(/[\w]([A-Z])/g, match => {
          return match[0] + '_' + match[1];
        })
        .toLowerCase();

      result[camelKey] = object[key];
    }

    return result;
  }

  formatCollectionKeysCamelToSnake(collection) {
    log.debug(
      `Formatting keys for all objects in: ${JSON.stringify(
        collection
      )} from camel to snake for ${this.req.headers.reqid}`
    );

    const result = [];

    collection.forEach(object => {
      result.push(this.formatKeysCamelToSnake(object));
    });

    return result;
  }

  formatKeysSnakeToCamel(object) {
    log.debug(
      `Formatting keys object: ${JSON.stringify(
        object
      )} from snake to camel for ${this.req.headers.reqid}`
    );

    const result = {};

    for (const key in object) {
      const camelKey = key.replace(/_([a-z])/g, match => {
        return match[1].toUpperCase();
      });
      result[camelKey] = object[key];
    }

    return result;
  }

  formatCollectionKeysSnakeToCamel(collection) {
    log.debug(
      `Formatting keys for all objects in: ${JSON.stringify(
        collection
      )} from snake to camel for ${this.req.headers.reqid}`
    );

    const result = [];

    collection.forEach(object => {
      result.push(this.formatKeysSnakeToCamel(object));
    });

    return result;
  }
}

module.exports = FormattingService;
