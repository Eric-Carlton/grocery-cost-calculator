'use strict';

const conf = require('../../conf/app.conf'),
  { param } = require('express-validator'),
  path = require('path'),
  AbstractDelete = require('../../abstract-crud-operations/abstract-delete');

class Delete extends AbstractDelete {
  get table() {
    return conf.dbTables.stores;
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
    const collection = path.basename(__dirname),
      operation = path.basename(__filename).replace(/\.js/, '');

    super(collection, operation);

    this.log.debug(
      `/${collection}/${operation} has one operation: DELETE /:id`
    );

    router.delete('/:id', this.validator, this.delete.bind(this));
  }
}

module.exports = Delete;
