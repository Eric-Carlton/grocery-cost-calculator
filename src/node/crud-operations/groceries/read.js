'use strict';

const conf = require('../../conf/app.conf'),
  { param, query } = require('express-validator'),
  path = require('path'),
  AbstractRead = require('../../abstract-crud-operations/abstract-read');

class Read extends AbstractRead {
  get getAllValidator() {
    return [
      query('name')
        .optional()
        .isLength({ min: 0, max: 256 })
        .withMessage('must be no more than 256 characters'),
      query('unit')
        .optional()
        .matches(/^EA|LB$/)
        .withMessage('must be one of: EA, LB'),
      query(['costPerUnit', 'storeId'])
        .optional()
        .isNumeric()
        .withMessage('must be numeric')
    ];
  }

  get getByIdValidator() {
    return [
      param('id')
        .exists()
        .withMessage('missing a required parameter')
        .isNumeric()
        .withMessage('must be numeric')
    ];
  }

  get table() {
    return conf.dbTables.groceries;
  }

  get allowedFields() {
    return ['name', 'unit', 'costPerUnit', 'storeId', 'id', 'lastUpdateDate'];
  }

  constructor(router) {
    const collection = path.basename(__dirname),
      operation = path.basename(__filename).replace(/\.js/, '');

    super(collection, operation);

    router.get('/:id', this.getByIdValidator, this.getById.bind(this));
    router.get('/', this.getAllValidator, this.getAll.bind(this));

    this.log.debug(
      `/${collection}/${operation} has two operations: GET /, GET /:id`
    );
  }
}

module.exports = Read;
