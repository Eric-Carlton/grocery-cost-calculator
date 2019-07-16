'use strict';

const conf = require('../conf/app.conf'),
  bunyan = require('bunyan'),
  log = bunyan.createLogger({
    name: 'filteringService.js',
    level: conf.log.level
  });

class FilteringService {
  constructor(req) {
    this.req = req;
  }

  filterStores(stores, name) {
    if (name) {
      name = name.toUpperCase();

      log.debug(
        `Filtering stores for ${this.req.headers.reqid} on name '${name}'`
      );

      stores = stores.filter(store => store.name === name);
    }

    return stores;
  }

  filterGroceries(groceries, name, unit, costPerUnit, storeId) {
    if (name) {
      name = name.toUpperCase();

      log.debug(
        `Filtering groceries for ${this.req.headers.reqid} on name '${name}'`
      );

      groceries = groceries.filter(grocery => grocery.name === name);
    }

    if (unit) {
      log.debug(
        `Filtering groceries for ${this.req.headers.reqid} on unit '${unit}'`
      );

      groceries = groceries.filter(grocery => grocery.unit === unit);
    }

    if (costPerUnit) {
      log.debug(
        `Filtering groceries for ${this.req.headers.reqid} on cost per unit '${costPerUnit}'`
      );

      groceries = groceries.filter(
        grocery => grocery.cost_per_unit == costPerUnit
      );
    }

    if (storeId) {
      log.debug(
        `Filtering groceries for ${this.req.headers.reqid} on storeId '${storeId}'`
      );

      groceries = groceries.filter(grocery => grocery.store_id == storeId);
    }

    return groceries;
  }
}

module.exports = FilteringService;
