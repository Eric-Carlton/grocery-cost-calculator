'use strict';

const conf = require('../../conf/app.conf'),
  DB = require('../../services/database'),
  { body, param, validationResult } = require('express-validator'),
  bunyan = require('bunyan'),
  path = require('path'),
  log = bunyan.createLogger({
    name: 'stores/update.js',
    level: conf.log.level
  }),
  Formatter = require('../../services/formattingService'),
  Filter = require('../../services/filteringService');

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
          .optional()
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
      req.body.name = req.body.name ? req.body.name : undefined;

      const formatter = new Formatter(req),
        filter = new Filter(req);

      req.body = filter.filterNullValues(
        formatter.formatKeysCamelToSnake(
          filter.filterObjectOnlyKnownKeys(req.body, ['name'])
        )
      );

      const db = new DB(req, conf.dbTables.stores);

      db.get({ id: req.params.id })
        .then(result => {
          if (result[0]) {
            return db.update(
              result[0].id,
              Object.assign({}, result[0], req.body)
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
          log.error(`Error processing ${req.headers.reqid}: ${err}`);
          res.status(500).send();
        });
    }
  }
}

module.exports = Update;
