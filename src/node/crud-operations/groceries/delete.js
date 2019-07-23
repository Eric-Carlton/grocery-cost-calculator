'use strict';

const conf = require('../../conf/app.conf'),
  DB = require('../../services/database'),
  { param, validationResult } = require('express-validator'),
  bunyan = require('bunyan'),
  path = require('path'),
  log = bunyan.createLogger({
    name: 'stores/delete.js',
    level: conf.log.level
  }),
  Formatter = require('../../services/formattingService');

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
      this.deleteGrocery
    );
  }

  deleteGrocery(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      const db = new DB(req, conf.dbTables.groceries);

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
          log.error(`Error processing ${req.headers.reqid}: ${err}`);
          res.status(500).send();
        });
    }
  }
}

module.exports = Delete;
