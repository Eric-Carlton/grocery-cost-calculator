'use strict';

const conf = require('../conf/app.conf'),
  mysql = require('mysql'),
  pool = mysql.createPool(conf.mysql),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({
    name: 'storesDatabase.js',
    level: conf.log.level
  });

class StoresDB {
  constructor(req) {
    this.req = req;
  }

  getStoresById(id) {
    log.debug(`Querying database for ${this.req.headers.reqid}`);

    return new Promise((resolve, reject) => {
      let query = 'SELECT * from stores';
      if (id) {
        query += ` WHERE id = ${pool.escape(id)}`;
      }

      log.debug(`Constructed query for ${this.req.headers.reqid}: ${query}`);

      pool.query(query, (err, results) => {
        if (err) {
          log.error(
            `Error querying database for ${this.req.headers.reqid}`,
            err
          );
          reject(err);
        } else {
          log.debug(
            `DB query successful for ${this.req.headers.reqid}: `,
            results
          );
          resolve(Array.from(results));
        }
      });
    });
  }

  getStoresByName(name) {
    log.debug(`Querying database for ${this.req.headers.reqid}`);

    return new Promise((resolve, reject) => {
      if (!name) {
        log.error(
          `Unable to query stores by name for ${this.req.headers.reqid}: No name provided`
        );
        reject(new Error('No name provided'));
      }
      const query = `SELECT * from stores WHERE name = ${pool.escape(name)}`;

      log.debug(`Constructed query for ${this.req.headers.reqid}: ${query}`);

      pool.query(query, (err, results) => {
        if (err) {
          log.error(
            `Error querying database for ${this.req.headers.reqid}`,
            err
          );
          reject(err);
        } else {
          log.debug(
            `DB query successful for ${this.req.headers.reqid}: `,
            results
          );
          resolve(Array.from(results));
        }
      });
    });
  }

  createStore(name) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO stores (name) VALUES (${pool.escape(name)})`;

      log.debug(`Constructed query for ${this.req.headers.reqid}: ${query}`);

      pool.query(query, (err, results) => {
        if (err) {
          log.error(
            `Error querying database for ${this.req.headers.reqid}`,
            err
          );
          reject(err);
        } else {
          log.debug(
            `DB query successful for ${this.req.headers.reqid}: `,
            results
          );
          resolve(results);
        }
      });
    });
  }
}

module.exports = StoresDB;
