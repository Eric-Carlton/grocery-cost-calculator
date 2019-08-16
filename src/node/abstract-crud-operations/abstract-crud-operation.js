'use strict';

const conf = require('../conf/app.conf'),
  bunyan = require('bunyan');

class AbstractCrudOperation {
  constructor(collection, operation) {
    if (this.constructor === AbstractCrudOperation) {
      throw new TypeError(
        'Abstract class AbstractCrudOperation cannot be instantiated directly.'
      );
    }

    if (this.table === undefined) {
      throw new TypeError(
        'Classes extending AbstractCrudOperation must implement a table property'
      );
    }

    this.log = bunyan.createLogger({
      level: conf.log.level,
      name: `${collection}/${operation}`
    });
  }
}

module.exports = AbstractCrudOperation;
