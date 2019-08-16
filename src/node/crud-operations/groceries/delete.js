'use strict';

const conf = require('../../conf/app.conf'),
  { param } = require('express-validator'),
  path = require('path'),
  AbstractDelete = require('../../abstract-crud-operations/abstract-delete');

class Delete extends AbstractDelete {
  get table() {
    return conf.dbTables.groceries;
  }

  get validator() {
    return [
      param('id')
        .exists()
        .withMessage('missing a required parameter')
        .isNumeric()
        .withMessage('must be numeric')
    ];
  }

  constructor(router) {
    super(
      router,
      path.basename(__dirname),
      path.basename(__filename).replace(/\.js/, '')
    );
  }
}

module.exports = Delete;
