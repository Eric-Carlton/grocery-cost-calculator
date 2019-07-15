'use strict';

const cors = require('cors'),
  conf = require('../conf/app.conf');

module.exports = {
  priority: 2,
  use: cors({
    origin: conf.cors.allowedOrigins,
    exposedHeaders: conf.cors.exposedHeaders,
    allowedHeaders: conf.cors.allowedHeaders,
    methods: conf.cors.allowedMethods,
    credentials: conf.cors.credentials
  })
};
