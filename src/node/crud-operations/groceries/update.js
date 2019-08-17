'use strict';

const conf = require('../../conf/app.conf'),
  { param, body } = require('express-validator'),
  path = require('path'),
  AbstractUpdate = require('../../abstract-crud-operations/abstract-update');

class Update extends AbstractUpdate {
  get table() {
    return conf.dbTables.groceries;
  }

  get validator() {
    return [
      param('id')
        .exists()
        .withMessage('missing a required parameter')
        .isNumeric()
        .withMessage('must be numeric'),
      body('name')
        .optional()
        .isLength({ min: 1, max: 256 })
        .withMessage('must be between 1 and 256 characters'),
      body('unit')
        .optional()
        .matches(/^EA|LB$/)
        .withMessage('must be one of: EA, LB'),
      body(['costPerUnit', 'storeId'])
        .optional()
        .isNumeric()
        .withMessage('must be numeric')
    ];
  }

  get allowedFields() {
    return ['name', 'unit', 'cost_per_unit', 'store_id'];
  }

  constructor(router) {
    const collection = path.basename(__dirname),
      operation = path.basename(__filename).replace(/\.js/, '');

    super(collection, operation);

    router.put('/:id', this.validator, this.update.bind(this));

    this.log.debug(`/${collection}/${operation} has one operation: PUT /:id`);
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

module.exports = Update;
