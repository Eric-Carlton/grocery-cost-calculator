'use strict';

const conf = require('../conf/app.conf'),
  DB = require('../services/database'),
  path = require('path'),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({
    name: 'routes/health-check.js',
    level: conf.log.level
  });

class HealthCheck {
  constructor(router) {
    log.debug(
      `/${path
        .basename(__filename)
        .replace(/\.js/, '')} has one operation: GET /`
    );
    router.get('/', (req, res) => {
      // health isn't an actual table, just passing in something for logging purposes
      const db = new DB(req, 'health');

      db.checkConnection()
        .then(() => {
          log.debug(`Health check successful for ${req.headers.reqid}`);
          res.json({ server: 'ALIVE', database: 'ALIVE' });
        })
        .catch(e => {
          log.error(`DB error during health check: ${e}`);
          res.status(500).json({ server: 'ALIVE', database: 'ERROR' });
        });
    });
  }
}

module.exports = HealthCheck;
