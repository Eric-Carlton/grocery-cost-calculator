'use strict';

const crypto = require('crypto');

module.exports = {
  priority: 0,
  use: (req, res, next) => {
    // just a simple hash of remote address and time
    req.headers.reqid = `REQ${crypto
      .createHash('md5')
      .update(new Date().getTime().toString())
      .update(req.connection.remoteAddress)
      .digest('hex')}`;

    res.header('reqid', req.header('reqid'));

    next();
  }
};
