'use strict';

const conf = require('../conf/app.conf'),
  bunyan = require('bunyan'),
  path = require('path'),
  log = bunyan.createLogger({
    name: `${path.basename(__dirname)}/${path
      .basename(__filename)
      .replace(/\.js/, '')}`,
    level: conf.log.level
  });

module.exports = {
  priority: 99,
  use: (err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      log.error(
        `Invalid CSRF token in ${req.method} request ${req.headers.reqid} to ${req.originalUrl}`
      );
      res.status(403).send('Invalid CSRF token');
    } else {
      next(err);
    }
  }
};
