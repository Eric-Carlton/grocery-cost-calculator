'use strict';

const conf = require('../../conf/app.conf'),
  DB = require('../../services/database'),
  Filter = require('../../services/filteringService'),
  Formatter = require('../../services/formattingService'),
  { param, validationResult, query } = require('express-validator'),
  bunyan = require('bunyan'),
  path = require('path'),
  log = bunyan.createLogger({
    name: 'grocieres/read.js',
    level: conf.log.level
  });

class Read {
  constructor(router) {
    log.debug(
      `${path.basename(
        __dirname
      )} operation: read has two routes: GET /:id, GET /`
    );
    router.get(
      '/:id',
      [
        param('id')
          .exists()
          .withMessage('missing a required parameter')
          .isNumeric()
          .withMessage('must be numeric')
      ],
      this.getGroceryById
    );
    router.get(
      '/',
      [
        query('name')
          .optional()
          .isLength({ min: 0, max: 256 })
          .withMessage('must be no more than 256 characters'),
        query('unit')
          .optional()
          .matches(/^EA|LB$/)
          .withMessage('must be one of: EA, LB'),
        query(['costPerUnit', 'storeId'])
          .optional()
          .isNumeric()
          .withMessage('must be numeric')
      ],
      this.getAllGroceries
    );
  }

  getGroceryById(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      const db = new DB(req, conf.dbTables.groceries);

      db.get({ id: req.params.id })
        .then(groceries => {
          if (groceries[0]) {
            res.json(new Formatter(req).formatKeysSnakeToCamel(groceries[0]));
          } else {
            res.status(404).send();
          }
        })
        .catch(err => {
          log.error(`Error processing ${req.headers.reqid}: ${err}`);
          res.status(500).send();
        });
    }
  }

  getAllGroceries(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      const db = new DB(req, conf.dbTables.groceries);

      db.get()
        .then(groceries => {
          const filter = new Filter(req);

          req.query = filter.filterObjectOnlyKnownKeys(req.query, [
            'name',
            'unit',
            'costPerUnit',
            'storeId',
            'id',
            'lastUpdateDate'
          ]);

          res.json(
            filter.filterCollection(
              new Formatter(req).formatCollectionKeysSnakeToCamel(groceries),
              Object.assign({}, req.query, {
                name: req.query.name ? req.query.name.toUpperCase() : null
              })
            )
          );
        })
        .catch(err => {
          log.error(`Error processing ${req.headers.reqid}: ${err}`);
          res.status(500).send();
        });
    }
  }
}

module.exports = Read;
