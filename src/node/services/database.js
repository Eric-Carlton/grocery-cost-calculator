'use strict';

const conf = require('../conf/app.conf'),
  bunyan = require('bunyan'),
  bunyanLogger = bunyan.createLogger({
    name: 'storesDatabase.js',
    level: conf.log.level
  }),
  pool = require('./databaseConnectionPool'),
  StandardLog = require('./standardDatabaseLogger'),
  Formatter = require('./formattingService');

class DB {
  constructor(req, table) {
    this.table = table;
    this.req = req;
    this.standardLog = new StandardLog(bunyanLogger, req, this.table);
    this.formatter = new Formatter(req);
  }

  _runQuery(query, resolve, reject) {
    pool.query(query, (err, results) => {
      if (err) {
        this.standardLog.queryError(err);
        reject(err);
      } else {
        this.standardLog.queryComplete(results);
        resolve(Array.from(results));
      }
    });
  }

  get(item) {
    this.standardLog.queryStarted();

    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM ${this.table}`;
      if (item) {
        Object.keys(item).forEach((key, idx) => {
          query += ` ${idx === 0 ? 'WHERE' : 'AND'} ${key} = ${pool.escape(
            item[key]
          )}`;
        });
      }

      this.standardLog.queryConstructed(query);

      this._runQuery(query, resolve, reject);
    });
  }

  create(item) {
    this.standardLog.queryStarted();

    return new Promise((resolve, reject) => {
      const keys = Object.keys(item);

      let query = `INSERT INTO ${this.table} (`;
      keys.forEach((key, idx) => {
        query += `${key}${idx === keys.length - 1 ? '' : ', '}`;
      });
      query += ') VALUES (';
      keys.forEach((key, idx) => {
        query += `${pool.escape(item[key])}${
          idx === keys.length - 1 ? '' : ', '
        }`;
      });
      query += ')';

      this.standardLog.queryConstructed(query);

      this._runQuery(query, resolve, reject);
    });
  }

  update(id, item) {
    this.standardLog.queryStarted();

    return new Promise((resolve, reject) => {
      item = this.formatter.formatKeysCamelToSnake(item);

      let query = `UPDATE ${this.table} SET `;
      Object.keys(item).forEach((key, idx) => {
        query += `${key} = ${pool.escape(item[key])}${
          idx === Object.keys(item).length - 1 ? '' : ','
        }`;
      });
      query += ` WHERE id = ${pool.escape(id)}`;
      this.standardLog.queryConstructed(query);

      this._runQuery(query, resolve, reject);
    });
  }

  delete(item) {
    this.standardLog.queryStarted();

    return new Promise((resolve, reject) => {
      let query = `DELETE FROM ${this.table} `;
      Object.keys(item).forEach((key, idx) => {
        query += ` ${idx === 0 ? 'WHERE' : 'AND'} ${key} = ${pool.escape(
          item[key]
        )}`;
      });
      this.standardLog.queryConstructed(query);

      this._runQuery(query, resolve, reject);
    });
  }
}

module.exports = DB;
