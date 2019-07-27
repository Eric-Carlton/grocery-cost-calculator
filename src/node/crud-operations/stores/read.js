'use strict';

const conf = require('../../conf/app.conf'),
  DB = require('../../services/database'),
  Filter = require('../../services/filteringService'),
  Formatter = require('../../services/formattingService'),
  { param, validationResult, query } = require('express-validator'),
  bunyan = require('bunyan'),
  path = require('path'),
  log = bunyan.createLogger({
    name: 'stores/read.js',
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
      this.getStoreById
    );
    router.get(
      '/',
      [
        query('name')
          .optional()
          .isLength({ min: 0, max: 256 })
          .withMessage('must be no more than 256 characters')
      ],
      this.getAllStores
    );
  }

  getStoreById(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      const db = new DB(req, conf.dbTables.stores);

      db.get({ id: req.params.id })
        .then(stores => {
          if (stores[0]) {
            res.json(new Formatter(req).formatKeysSnakeToCamel(stores[0]));
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

  getAllStores(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      const db = new DB(req, conf.dbTables.stores);

      db.get()
        .then(stores => {
          const filter = new Filter(req);

          req.query = filter.filterObjectOnlyKnownKeys(req.query, [
            'name',
            'id'
          ]);

          res.json(
            filter.filterCollection(
              new Formatter(req).formatCollectionKeysSnakeToCamel(stores),
              Object.assign({}, req.query, {
                name: req.query.name ? req.query.name : undefined
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
