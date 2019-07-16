'use strict';

class DatabaseLogger {
  constructor(log, req) {
    this.log = log;
    this.req = req;
  }

  queryStarted() {
    this.log.debug(`Querying database for ${this.req.headers.reqid}`);
  }

  queryConstructed(query) {
    this.log.debug(`Constructed query for ${this.req.headers.reqid}: ${query}`);
  }

  queryError(err) {
    this.log.error(
      `Error querying database for ${this.req.headers.reqid}`,
      err
    );
  }

  queryComplete(results) {
    this.log.debug(
      `DB query successful for ${this.req.headers.reqid}: `,
      results
    );
  }
}

module.exports = DatabaseLogger;
