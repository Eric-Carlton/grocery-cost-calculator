'use strict';

const DB = require('../services/database'),
  Filter = require('../services/filteringService'),
  Formatter = require('../services/formattingService'),
  { validationResult } = require('express-validator'),
  AbstractCrudOperation = require('./abstract-crud-operation');

class AbstractCreate extends AbstractCrudOperation {
  constructor(collection, operation) {
    super(collection, operation);

    if (this.constructor === AbstractCreate) {
      throw new TypeError(
        'Abstract class AbstractCreate cannot be instantiated directly.'
      );
    }

    if (this.validator === undefined) {
      throw new TypeError(
        'Classes extending AbstractCreate must implement a validator property'
      );
    }

    if (this.allowedFields === undefined) {
      throw new TypeError(
        'Classes extending AbstractCrudOperation must implement an allowedFields property'
      );
    }

    if (typeof this.createDupEntryError !== 'function') {
      throw new TypeError(
        'Classes extending AbstractCreate must implement a createDupEntryError function'
      );
    }
  }

  create(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      this.log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      const formatter = new Formatter(req),
        filter = new Filter(req);

      req.body = filter.filterNullValues(
        formatter.formatKeysCamelToSnake(
          filter.filterObjectOnlyKnownKeys(req.body, this.allowedFields)
        )
      );

      const db = new DB(req, this.table);

      db.create(req.body)
        .then(() => {
          return db.get(req.body);
        })
        .then(result => {
          if (result[0]) {
            res.status(201).json(formatter.formatKeysSnakeToCamel(result[0]));
          } else {
            res.status(500).send();
          }
        })
        .catch(err => {
          if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json(this.createDupEntryError(req));
          } else {
            this.log.error(`Error processing ${req.headers.reqid}: ${err}`);
            res.status(500).send();
          }
        });
    }
  }
}

module.exports = AbstractCreate;
