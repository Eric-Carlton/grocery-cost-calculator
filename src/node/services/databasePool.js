'use strict';

const conf = require('../conf/app.conf'),
  mysql = require('mysql'),
  pool = mysql.createPool(conf.mysql);

module.exports = pool;
