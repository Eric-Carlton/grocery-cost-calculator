'use strict';

class DatabaseLogger {
  constructor(log, req, table) {
    this.log = log;
    this.req = req;
    this.table = table;
  }

  queryStarted() {
    this.log.debug(`Querying ${this.table} for ${this.req.headers.reqid}`);
  }

  queryConstructed(query) {
    this.log.debug(
      `Constructed ${this.table} query for ${this.req.headers.reqid}: ${query}`
    );
  }

  queryError(err) {
    this.log.error(
      `Error querying ${this.table} for ${this.req.headers.reqid}`,
      err
    );
  }

  queryComplete(results) {
    this.log.debug(
      `${this.table} query successful for ${this.req.headers.reqid}: `,
      results
    );
  }
}

module.exports = DatabaseLogger;
