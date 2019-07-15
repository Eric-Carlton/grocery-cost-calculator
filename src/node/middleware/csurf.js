'use strict';

const csurf = require('csurf'),
  conf = require('../conf/app.conf');

module.exports = {
  priority: 3,
  use: conf.disableCsurf ? (req, res, next) => next() : csurf(conf.csurf)
};
