"use strict";

const bunyan = require("bunyan"),
  log = bunyan.createLogger({
    name: "app.conf.js",
    level: "info"
  });

let privateConf;

try {
  privateConf = require("./private.conf");
  log.info("Using private conf");
} catch (e) {
  log.info("No private conf found");
}

module.exports = {
  express: {
    port: process.env.PORT || 3000,
    middlewarePath: "middleware",
    routesPath: "routes",
    apiRoutesPrefix: "/api",
    static: {
      folder: "../../dist",
      index: "index.html"
    }
  },
  cors: {
    allowedOrigins: [""],
    exposedHeaders: ["reqid"],
    allowedHeaders: ["content-type"],
    allowedMethods: ["GET"],
    credentials: false
  },
  csurf: { cookie: true },
  log: {
    level: process.env.LOG_LEVEL || "trace"
  }
};
