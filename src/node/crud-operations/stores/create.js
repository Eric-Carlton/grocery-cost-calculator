'use strict';

const conf = require('../../conf/app.conf'),
  { body } = require('express-validator'),
  path = require('path'),
  AbstractCreate = require('../../abstract-crud-operations/abstract-create');

class Create extends AbstractCreate {
  get table() {
    return conf.dbTables.stores;
  }

  get validator() {
    return [
      body('name')
        .exists()
        .withMessage('missing a required parameter')
        .isLength({ min: 1, max: 256 })
        .withMessage('must be between 1 and 256 characters')
    ];
  }

  get allowedFields() {
    return ['name'];
  }

  constructor(router) {
    super(
      router,
      path.basename(__dirname),
      path.basename(__filename).replace(/\.js/, '')
    );
  }

  createDupEntryError(req) {
    return {
      errors: {
        name: {
          value: req.body.name,
          msg: 'unable to add duplicate entry',
          param: 'name',
          location: 'body'
        }
      }
    };
  }
}

module.exports = Create;
