'use strict';

const bodyParser = require('body-parser');

module.exports = {
  priority: 0,
  use: bodyParser.urlencoded({ extended: true })
};
