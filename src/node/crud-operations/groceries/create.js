'use strict';

const conf = require('../../conf/app.conf'),
  { body } = require('express-validator'),
  path = require('path'),
  AbstractCreate = require('../../abstract-crud-operations/abstract-create');

class Create extends AbstractCreate {
  get table() {
    return conf.dbTables.groceries;
  }

  get validator() {
    return [
      body('name')
        .exists()
        .withMessage('missing a required parameter')
        .isLength({ min: 0, max: 256 })
        .withMessage('must be no more than 256 characters'),
      body('unit')
        .exists()
        .withMessage('missing a required parameter')
        .matches(/^EA|LB$/)
        .withMessage('must be one of: EA, LB'),
      body(['costPerUnit', 'storeId'])
        .exists()
        .withMessage('missing a required parameter')
        .isNumeric()
        .withMessage('must be numeric')
    ];
  }

  get allowedFields() {
    return ['name', 'unit', 'costPerUnit', 'storeId'];
  }

  constructor(router) {
    const collection = path.basename(__dirname),
      operation = path.basename(__filename).replace(/\.js/, '');

    super(collection, operation);

    this.log.debug(`/${collection}/${operation} has one operation: POST /`);

    router.post('/', this.validator, this.create.bind(this));
  }

  createDupEntryError(req) {
    return {
      errors: {
        name: {
          value: req.body.name,
          msg: 'unable to add duplicate entry',
          param: 'name',
          location: 'body'
        },
        storeId: {
          value: req.body.storeId,
          msg: 'unable to add duplicate entry',
          param: 'storeId',
          location: 'body'
        }
      }
    };
  }
}

module.exports = Create;
