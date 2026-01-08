'use strict';

/**
 * Add API middleware for CORS support
 *
 * `addOptionsMethod` should be set to true only if CORS is not configured on Api Gateway
 *
 * @param {object} api - Lambda API instance
 * @param {{ addOptionsMethod?: boolean }} options - CORS options
 */
function addCorsHeaders(api, options = {}) {
  /*
   * Middleware to add CORS headers for success responses
   */
  api.use((req, res, next) => {
    res.cors({});
    next();
  });

  /*
   * Middleware to add CORS headers for error responses
   */
  api.use((err, req, res, next) => {
    res.cors({});
    next();
  });

  /**
   * Optional route for handling OPTIONS methods
   * Not needed if API gateway is setup to manage CORS.
   */
  if (options.addOptionsMethod) {
    api.options('/*', (req, res) => {
      res.status(200).send({});
    });
  }
}

module.exports = {
  addCorsHeaders,
};

