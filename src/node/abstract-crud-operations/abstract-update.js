'use strict';

const DB = require('../services/database'),
  Filter = require('../services/filteringService'),
  Formatter = require('../services/formattingService'),
  { validationResult } = require('express-validator'),
  AbstractCrudOperation = require('./abstract-crud-operation');

class AbstractUpdate extends AbstractCrudOperation {
  constructor(router, collection, operation) {
    super(collection, operation);

    if (this.constructor === AbstractUpdate) {
      throw new TypeError(
        'Abstract class AbstractUpdate cannot be instantiated directly.'
      );
    }

    if (this.validator === undefined) {
      throw new TypeError(
        'Classes extending AbstractUpdate must implement a validator property'
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

    this.log.debug(`/${collection}/${operation} has one operation: PUT /:id`);

    router.put('/:id', this.validator, this.update.bind(this));
  }

  update(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      this.log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      const formatter = new Formatter(req),
        filter = new Filter(req);

      req.body = formatter.formatKeysCamelToSnake(req.body);

      const db = new DB(req, this.table);

      db.get({ id: req.params.id })
        .then(result => {
          if (result[0]) {
            return db.update(
              result[0].id,
              filter.filterNullValues(
                filter.filterObjectOnlyKnownKeys(
                  Object.assign({}, result[0], req.body),
                  this.allowedFields
                )
              )
            );
          } else {
            return res.status(404).send();
          }
        })
        .then(() => {
          return db.get({ id: req.params.id });
        })
        .then(result => {
          if (result[0]) {
            return res.json(formatter.formatKeysSnakeToCamel(result[0]));
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

module.exports = AbstractUpdate;
