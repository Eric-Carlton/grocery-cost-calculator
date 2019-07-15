'use strict';

const cookieParser = require('cookie-parser');

module.exports = {
  priority: 0,
  use: cookieParser()
};
