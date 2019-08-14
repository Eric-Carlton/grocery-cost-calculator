'use strict';

const express = require('express'),
  conf = require('../conf/app.conf'),
  requireDir = require('require-dir-all'),
  { readdirSync } = require('fs'),
  path = require('path'),
  bunyan = require('bunyan'),
  app = express(),
  log = bunyan.createLogger({
    name: 'createServer.js',
    level: conf.log.level
  }),
  middleware = requireDir(
    path.join(path.dirname(require.main.filename), conf.express.middlewarePath),
    {
      extensions: ['.js']
    }
  ),
  routes = requireDir(
    path.join(path.dirname(require.main.filename), conf.express.routesPath),
    { extensions: ['.js'] }
  ),
  crudOps = readdirSync(
    path.join(
      path.dirname(require.main.filename),
      conf.express.crudOperationsPath
    ),
    {
      withFileTypes: true
    }
  )
    .filter(dirent => dirent.isDirectory())
    .map(dir =>
      path.join(
        path.dirname(require.main.filename),
        conf.express.crudOperationsPath,
        dir.name
      )
    ),
  apiRoutesPrefix = conf.express.apiRoutesPrefix || '';

// load middleware and add to app
Object.keys(middleware)
  .map(key => {
    middleware[key].name = key;
    return middleware[key];
  })
  .sort((a, b) => a.priority - b.priority)
  .forEach(middleware => {
    log.debug(`adding ${middleware.name} middleware`);
    app.use(middleware.use);
  });

// load route handlers
Object.keys(routes).map(key => {
  const router = express.Router(),
    Route = routes[key];

  log.debug(`Adding route ${key} at path ${apiRoutesPrefix}/${key}`);

  new Route(router);

  app.use(`${apiRoutesPrefix}/${key}`, router);
});

// load CRUD operations
crudOps.forEach(dir => {
  const router = express.Router(),
    Operations = requireDir(dir, { extensions: ['.js'] }),
    routeName = path.basename(dir),
    route = `${apiRoutesPrefix}/${routeName}`;

  log.debug(`Adding CRUD route ${routeName} at path ${route}`);

  Object.keys(Operations).map(key => {
    log.debug(`Adding ${routeName} operation: ${key}`);
    const Operation = Operations[key];
    new Operation(router);
  });

  app.use(route, router);
});

if (conf.express.static) {
  // Point static path to dist
  app.use(
    express.static(
      path.join(path.dirname(require.main.filename), conf.express.static.folder)
    )
  );

  // Catch all other routes and return the index file
  app.get('*', (req, res) => {
    res.sendFile(
      path.join(
        path.dirname(require.main.filename),
        path.join(conf.express.static.folder, conf.express.static.index)
      )
    );
  });
}

module.exports = app;
