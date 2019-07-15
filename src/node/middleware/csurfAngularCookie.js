'use strict';

module.exports = {
  priority: 4,
  use: (req, res, next) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    next();
  }
};
