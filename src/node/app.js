'use strict';

const bunyan = require('bunyan'),
  log = bunyan.createLogger({ name: 'app.js' }),
  conf = require('./conf/app.conf'),
  app = require('./resources/createServer');

app.listen(conf.express.port, () => {
  log.info(`Express listening at port ${conf.express.port}`);
});
