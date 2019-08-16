'use strict';

const bunyan = require('bunyan'),
  path = require('path'),
  log = bunyan.createLogger({
    name: `${path.basename(__dirname)}/${path
      .basename(__filename)
      .replace(/\.js/, '')}`,
    level: 'info'
  });

let privateConf = {};

try {
  privateConf = require('./private.conf');
  log.info('Using private conf');
} catch (e) {
  log.info('No private conf found');
}

const conf = {
  express: {
    port: process.env.PORT || 3000,
    middlewarePath: 'middleware',
    routesPath: 'routes',
    crudOperationsPath: 'crud-operations',
    apiRoutesPrefix: '/api',
    static: {
      folder: '../../dist',
      index: 'index.html'
    }
  },
  cors: {
    allowedOrigins: ['http://localhost:4200'],
    exposedHeaders: ['reqid'],
    allowedHeaders: ['content-type'],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false
  },
  csurf: { cookie: true },
  log: {
    level: process.env.LOG_LEVEL || 'trace'
  },
  mysql: {
    connectionLimit: process.env.DB_CONNECTION_LIMIT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
  },
  dbTables: {
    stores: 'stores',
    groceries: 'groceries'
  }
};

module.exports = Object.assign(conf, privateConf);
