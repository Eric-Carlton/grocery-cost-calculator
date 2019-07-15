'use strict';

const conf = require('../conf/app.conf');

module.exports = {
  priority: 4,
  use: (req, res, next) => {
    if (!conf.disableCsurf) {
      res.cookie('XSRF-TOKEN', req.csrfToken());
    }
    next();
  }
};
