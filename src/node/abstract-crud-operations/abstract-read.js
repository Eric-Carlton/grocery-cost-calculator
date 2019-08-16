'use strict';

const DB = require('../services/database'),
  Filter = require('../services/filteringService'),
  Formatter = require('../services/formattingService'),
  { validationResult } = require('express-validator'),
  AbstractCrudOperation = require('./abstract-crud-operation');

class AbstractRead extends AbstractCrudOperation {
  constructor(router, collection, operation) {
    super(collection, operation);

    if (this.constructor === AbstractRead) {
      throw new TypeError(
        'Abstract class AbstractRead cannot be instantiated directly.'
      );
    }

    if (this.getAllValidator === undefined) {
      throw new TypeError(
        'Classes extending AbstractRead must implement a getAllValidator property'
      );
    }

    if (this.getByIdValidator === undefined) {
      throw new TypeError(
        'Classes extending AbstractRead must implement a getByIdValidator property'
      );
    }

    if (this.allowedFields === undefined) {
      throw new TypeError(
        'Classes extending AbstractCrudOperation must implement an allowedFields property'
      );
    }

    this.log.debug(
      `/${collection}/${operation} has two operations: GET /:id, GET /`
    );

    router.get('/:id', this.getByIdValidator, this.getById.bind(this));
    router.get('/', this.getAllValidator, this.getAll.bind(this));
  }

  getById(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      this.log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      const db = new DB(req, this.table);

      db.get({ id: req.params.id })
        .then(allItems => {
          if (allItems[0]) {
            res.json(new Formatter(req).formatKeysSnakeToCamel(allItems[0]));
          } else {
            res.status(404).send();
          }
        })
        .catch(err => {
          this.log.error(`Error processing ${req.headers.reqid}: ${err}`);
          res.status(500).send();
        });
    }
  }

  getAll(req, res) {
    console.log(this);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      this.log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      const db = new DB(req, this.table);

      db.get()
        .then(allItems => {
          const filter = new Filter(req);

          req.query = filter.filterNullValues(
            filter.filterObjectOnlyKnownKeys(req.query, this.allowedFields)
          );

          res.json(
            filter.filterCollection(
              new Formatter(req).formatCollectionKeysSnakeToCamel(allItems),
              Object.assign({}, req.query)
            )
          );
        })
        .catch(err => {
          this.log.error(`Error processing ${req.headers.reqid}: ${err}`);
          res.status(500).send();
        });
    }
  }
}

module.exports = AbstractRead;
