'use strict';

const conf = require('../conf/app.conf'),
  bunyan = require('bunyan'),
  bunyanLogger = bunyan.createLogger({
    name: 'storesDatabase.js',
    level: conf.log.level
  }),
  pool = require('./databaseConnectionPool'),
  StandardLog = require('./standardDatabaseLogger');

class StoresDB {
  constructor(req) {
    this.req = req;
    this.standardLog = new StandardLog(bunyanLogger, req);
  }

  getStoresById(id) {
    this.standardLog.queryStarted();

    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM stores';
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

  getStoresByName(name) {
    this.standardLog.queryStarted();

    return new Promise((resolve, reject) => {
      if (!name) {
        log.error(
          `Unable to query stores by name for ${this.req.headers.reqid}: No name provided`
        );
        reject(new Error('No name provided'));
      }
      const query = `SELECT * FROM stores WHERE name = ${pool.escape(name)}`;

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

  createStore(store) {
    this.standardLog.queryStarted();

    return new Promise((resolve, reject) => {
      if (!store.name) {
        log.error(
          `Unable to create store for ${this.req.headers.reqid}: No name provided`
        );
        reject(new Error('No name provided'));
      }

      const query = `INSERT INTO stores (name) VALUES (${pool.escape(
        store.name
      )})`;

      this.standardLog.queryConstructed(query);

      pool.query(query, (err, results) => {
        if (err) {
          this.standardLog.queryError(err);
          reject(err);
        } else {
          this.standardLog.queryComplete(results);
          resolve(results);
        }
      });
    });
  }

  updateStore(store) {
    this.standardLog.queryStarted();

    return new Promise((resolve, reject) => {
      if (!store.name) {
        log.error(
          `Unable to update store for ${this.req.headers.reqid}: No name provided`
        );
        reject(new Error('No name provided'));
      }
      if (!store.id) {
        log.error(
          `Unable to update store for ${this.req.headers.reqid}: No id provided`
        );
        reject(new Error('No id provided'));
      }

      const query = `UPDATE stores SET name = ${pool.escape(
        store.name
      )} WHERE id = ${pool.escape(store.id)}`;
      this.standardLog.queryConstructed(query);

      pool.query(query, (err, results) => {
        if (err) {
          this.standardLog.queryError(err);
          reject(err);
        } else {
          this.standardLog.queryComplete(results);
          resolve(results);
        }
      });
    });
  }

  deleteStore(id) {
    this.standardLog.queryStarted();

    return new Promise((resolve, reject) => {
      if (!id) {
        log.error(
          `Unable to delete store for ${this.req.headers.reqid}: No id provided`
        );
        reject(new Error('No id provided'));
      }

      const query = `DELETE FROM stores WHERE id = ${pool.escape(id)}`;
      this.standardLog.queryConstructed(query);

      pool.query(query, (err, results) => {
        if (err) {
          this.standardLog.queryError(err);
          reject(err);
        } else {
          this.standardLog.queryComplete(results);
          resolve(results);
        }
      });
    });
  }
}

module.exports = StoresDB;
