'use strict';

const helmet = require('helmet');

module.exports = {
  priority: 0,
  use: helmet()
};
