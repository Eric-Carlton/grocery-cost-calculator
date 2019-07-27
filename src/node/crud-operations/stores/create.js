'use strict';

const conf = require('../../conf/app.conf'),
  DB = require('../../services/database'),
  { body, validationResult } = require('express-validator'),
  bunyan = require('bunyan'),
  path = require('path'),
  log = bunyan.createLogger({
    name: 'stores/create.js',
    level: conf.log.level
  }),
  Formatter = require('../../services/formattingService'),
  Filter = require('../../services/filteringService');

class Create {
  constructor(router) {
    log.debug(
      `${path.basename(__dirname)} operation: create has one route: POST /`
    );
    router.post(
      '/',
      [
        body('name')
          .exists()
          .withMessage('missing a required parameter')
          .isLength({ min: 1, max: 256 })
          .withMessage('must be between 1 and 256 characters')
      ],
      this.createStore
    );
  }

  createStore(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMap = errors.mapped();

      log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

      return res.status(400).json({ errors: errorMap });
    } else {
      const formatter = new Formatter(req);

      req.body = formatter.formatKeysCamelToSnake(
        new Filter(req).filterObjectOnlyKnownKeys(req.body, ['name'])
      );
      req.body.name = req.body.name;

      const db = new DB(req, conf.dbTables.stores);

      db.create(req.body)
        .then(() => {
          return db.get(req.body);
        })
        .then(result => {
          if (result[0]) {
            res.status(201).json(formatter.formatKeysSnakeToCamel(result[0]));
          } else {
            res.status(500).send();
          }
        })
        .catch(err => {
          if (err.code === 'ER_DUP_ENTRY') {
            res.status(409).json({
              errors: {
                name: {
                  value: req.body.name,
                  msg: 'unable to add duplicate entry',
                  param: 'name',
                  location: 'body'
                }
              }
            });
          } else {
            log.error(`Error processing ${req.headers.reqid}: ${err}`);
            res.status(500).send();
          }
        });
    }
  }
}

module.exports = Create;
