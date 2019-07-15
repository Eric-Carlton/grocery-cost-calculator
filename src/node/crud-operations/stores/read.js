'use strict';

const conf = require('../../conf/app.conf'),
  StoresDB = require('../../services/storesDatabase'),
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
      const storesDB = new StoresDB(req);

      storesDB
        .getStoresById(req.params.id)
        .then(stores => {
          if (stores[0]) {
            res.json(stores[0]);
          } else {
            res.status(404).send();
          }
        })
        .catch(() => {
          res.status(500).send();
        });
    }
  }

  getAllStores(req, res) {
    const storesDB = new StoresDB(req);

    storesDB
      .getStoresById()
      .then(stores => {
        if (req.query.name) {
          req.query.name = req.query.name.toUpperCase();

          log.debug(
            `Filtering stores for ${req.headers.reqid} on name '${req.query.name}'`
          );

          res.json(stores.filter(store => store.name === req.query.name));
        } else {
          res.json(stores);
        }
      })
      .catch(() => {
        res.status(500).send();
      });
  }
}

module.exports = Read;
