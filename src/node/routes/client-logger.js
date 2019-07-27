'use strict';

const conf = require('../conf/app.conf'),
  { body, validationResult } = require('express-validator'),
  path = require('path'),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({
    name: 'routes/client-logger',
    level: conf.log.level
  });

class ClientLogger {
  constructor(router) {
    log.debug(
      `${path.basename(__dirname)} operation: read has one route: POST /`
    );
    router.post(
      '/',
      [
        body('level')
          .exists()
          .withMessage('missing a required parameter')
          .matches(/^error|warn|info|debug|trace$/)
          .withMessage('must be one of: error, warn, info, debug, trace'),
        body('arguments')
          .exists()
          .withMessage('missing a required parameter')
          .isArray()
          .withMessage('must be an array')
      ],
      (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          const errorMap = errors.mapped();

          log.error(`Bad request for ${req.headers.reqid}: `, errorMap);

          return res.status(400).json({ errors: errorMap });
        } else {
          log[req.body.level](
            `Client log received for ${req.headers.reqid}:`,
            ...req.body.arguments
          );
          res.json();
        }
      }
    );
  }
}

module.exports = ClientLogger;
