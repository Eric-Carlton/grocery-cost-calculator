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
  priority: 100,
  use: (err, req, res, next) => {
    const errMessage = `Unable to process ${req.method} request ${req.headers.reqid} to ${req.originalUrl}`;

    log.error(errMessage, err);

    res.status(err.status || 500).send([{ error: errMessage }]);

    next(err);
  }
};
