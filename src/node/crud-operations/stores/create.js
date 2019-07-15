'use strict';

const conf = require('../../conf/app.conf'),
  StoresDB = require('../../services/storesDatabase'),
  { body, validationResult } = require('express-validator'),
  bunyan = require('bunyan'),
  path = require('path'),
  log = bunyan.createLogger({
    name: 'stores/create.js',
    level: conf.log.level
  });

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
          .isLength({ min: 0, max: 256 })
          .withMessage('must be between 0 and 256 characters')
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
      req.body.name = req.body.name.toUpperCase();

      const storesDB = new StoresDB(req);

      storesDB
        .createStore(req.body.name)
        .then(() => {
          return storesDB.getStoresByName(req.body.name);
        })
        .then(result => {
          if (result[0]) {
            res.json(result[0]);
          } else {
            res.status(500).send();
          }
        })
        .catch(err => {
          if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({
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
            res.status(500).send();
          }
        });
    }
  }
}

module.exports = Create;
