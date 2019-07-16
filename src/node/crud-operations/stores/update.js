'use strict';

const conf = require('../../conf/app.conf'),
  StoresDB = require('../../services/storesDatabase'),
  { body, param, validationResult } = require('express-validator'),
  bunyan = require('bunyan'),
  path = require('path'),
  log = bunyan.createLogger({
    name: 'stores/create.js',
    level: conf.log.level
  });

class Update {
  constructor(router) {
    log.debug(
      `${path.basename(__dirname)} operation: create has one route: PUT /:id`
    );
    router.put(
      '/:id',
      [
        param('id')
          .exists()
          .withMessage('missing a required parameter')
          .isNumeric()
          .withMessage('must be numeric'),
        body('name')
          .exists()
          .withMessage('missing a required parameter')
          .isLength({ min: 1, max: 256 })
          .withMessage('must be between 1 and 256 characters')
      ],
      this.updateStore
    );
  }

  updateStore(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      req.body.name = req.body.name.toUpperCase();

      const storesDB = new StoresDB(req);

      storesDB
        .getStoresById(req.params.id)
        .then(result => {
          if (result[0]) {
            return storesDB.updateStore({
              id: result[0].id,
              name: req.body.name
            });
          } else {
            return res.status(404).send();
          }
        })
        .then(() => {
          return storesDB.getStoresById(req.params.id);
        })
        .then(result => {
          if (result[0]) {
            return res.json(result[0]);
          } else {
            res.status(500).send();
          }
        })
        .catch(() => {
          res.status(500).send();
        });
    }
  }
}

module.exports = Update;
