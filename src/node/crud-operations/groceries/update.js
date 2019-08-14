'use strict';

const conf = require('../../conf/app.conf'),
  DB = require('../../services/database'),
  { body, param, validationResult } = require('express-validator'),
  bunyan = require('bunyan'),
  path = require('path'),
  log = bunyan.createLogger({
    name: 'groceries/update.js',
    level: conf.log.level
  }),
  Formatter = require('../../services/formattingService'),
  Filter = require('../../services/filteringService');

class Update {
  constructor(router) {
    log.debug(
      `${path.basename(__dirname)} operation: update has one route: PUT /:id`
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
          .withMessage('must be between 1 and 256 characters'),
        body('unit')
          .optional()
          .matches(/^EA|LB$/)
          .withMessage('must be one of: EA, LB'),
        body(['costPerUnit', 'storeId'])
          .optional()
          .isNumeric()
          .withMessage('must be numeric')
      ],
      this.updateGrocery
    );
  }

  updateGrocery(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      const formatter = new Formatter(req),
        filter = new Filter(req);

      req.body = formatter.formatKeysCamelToSnake(req.body);

      const db = new DB(req, conf.dbTables.groceries);

      db.get({ id: req.params.id })
        .then(result => {
          if (result[0]) {
            return db.update(
              result[0].id,
              filter.filterNullValues(
                filter.filterObjectOnlyKnownKeys(
                  Object.assign({}, result[0], req.body),
                  ['name', 'unit', 'cost_per_unit', 'store_id']
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
          log.error(`Error processing ${req.headers.reqid}: ${err}`);
          res.status(500).send();
        });
    }
  }
}

module.exports = Update;
