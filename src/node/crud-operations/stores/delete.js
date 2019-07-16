'use strict';

const conf = require('../../conf/app.conf'),
  StoresDB = require('../../services/storesDatabase'),
  { param, validationResult } = require('express-validator'),
  bunyan = require('bunyan'),
  path = require('path'),
  log = bunyan.createLogger({
    name: 'stores/delete.js',
    level: conf.log.level
  });

class Delete {
  constructor(router) {
    log.debug(
      `${path.basename(__dirname)} operation: create has one route: DELETE /:id`
    );
    router.delete(
      '/:id',
      [
        param('id')
          .exists()
          .withMessage('missing a required parameter')
          .isNumeric()
          .withMessage('must be numeric')
      ],
      this.deleteStore
    );
  }

  deleteStore(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      const storesDB = new StoresDB(req);

      let toDelete;

      storesDB
        .getStoresById(req.params.id)
        .then(result => {
          if (result[0]) {
            toDelete = result[0];
            return storesDB.deleteStore(req.params.id);
          } else {
            return res.status(404).send();
          }
        })
        .then(() => {
          res.json(toDelete);
        })
        .catch(err => {
          log.error(`Error processing ${req.headers.reqid}: ${err}`);
          res.status(500).send();
        });
    }
  }
}

module.exports = Delete;
