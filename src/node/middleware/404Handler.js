'use strict';

module.exports = {
  // this MUST be the lowest priority middleware
  priority: 8675309,
  use: (req, res) => {
    res.status(404).send();
  }
};
