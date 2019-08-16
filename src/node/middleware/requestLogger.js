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
  priority: 1,
  use: (req, res, next) => {
    const reqLogMessage = `${req.method} request ${req.headers.reqid} to ${req.originalUrl} received`;

    if (Object.keys(req.body).length > 0) {
      log.trace(`${reqLogMessage} with body`, req.body);
    } else {
      log.trace(reqLogMessage);
    }

    const oldSend = res.send;

    res.send = function(data) {
      const resLogMessage = `Responding to ${req.method} request ${req.headers.reqid} to ${req.originalUrl} with status ${res.statusCode}`;

      if (data) {
        log.trace(`${resLogMessage} and body`, data);
      } else {
        log.trace(resLogMessage);
      }
      res.send = oldSend;
      res.send.apply(res, arguments);
    };

    next();
  }
};
