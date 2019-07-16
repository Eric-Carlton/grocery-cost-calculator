'use strict';

const conf = require('../conf/app.conf'),
  bunyan = require('bunyan'),
  bunyanLogger = bunyan.createLogger({
    name: 'groceriesDatabse.js',
    level: conf.log.level
  }),
  pool = require('./databaseConnectionPool'),
  StandardLog = require('./standardDatabaseLogger');

class GroceriesDB {
  constructor(req) {
    this.req = req;
    this.standardLog = new StandardLog(bunyanLogger, req);
  }

  getGroceriesById(id) {
    this.standardLog.queryStarted();

    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM groceries';
      if (id) {
        query += ` WHERE id = ${pool.escape(id)}`;
      }

      this.standardLog.queryConstructed(query);

      pool.query(query, (err, results) => {
        if (err) {
          this.standardLog.queryError(err);
          reject(err);
        } else {
          this.standardLog.queryComplete(results);
          resolve(Array.from(results));
        }
      });
    });
  }
}

module.exports = GroceriesDB;
