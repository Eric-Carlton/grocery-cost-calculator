'use strict';

const DB = require('../services/database'),
  Filter = require('../services/filteringService'),
  Formatter = require('../services/formattingService'),
  { validationResult } = require('express-validator'),
  AbstractCrudOperation = require('./abstract-crud-operation');

class AbstractDelete extends AbstractCrudOperation {
  constructor(router, collection, operation) {
    super(collection, operation);

    if (this.constructor === AbstractDelete) {
      throw new TypeError(
        'Abstract class AbstractDelete cannot be instantiated directly.'
      );
    }

    if (this.validator === undefined) {
      throw new TypeError(
        'Classes extending AbstractDelete must implement a validator property'
      );
    }

    this.log.debug(
      `/${collection}/${operation} has one operation: DELETE /:id`
    );

    router.delete('/:id', this.validator, this.delete.bind(this));
  }

  delete(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      this.log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      const db = new DB(req, this.table);

      let toDelete;

      db.get({ id: req.params.id })
        .then(result => {
          if (result[0]) {
            toDelete = result[0];
            return db.delete(toDelete);
          } else {
            return res.status(404).send();
          }
        })
        .then(() => {
          // if there's nothing to delete, then we've already sent back a 404
          if (toDelete) {
            res.json(new Formatter(req).formatKeysSnakeToCamel(toDelete));
          }
        })
        .catch(err => {
          this.log.error(`Error processing ${req.headers.reqid}: ${err}`);
          res.status(500).send();
        });
    }
  }
}

module.exports = AbstractDelete;
