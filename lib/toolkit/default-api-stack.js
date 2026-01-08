'use strict';

const { addCorsHeaders } = require('./add-cors-headers');
const { createApiErrorHandler } = require('./error-handler');
const { logger: defaultLogger } = require('./logger');

/**
 * Default API middleware stack.
 * Enables adding CORS headers and handling of errors.
 *
 * @param {object} logger - Logger instance (defaults to console)
 * @returns {function} Routes function to register with API
 */
function createDefaultApiStack(logger = defaultLogger) {
  const defaultApiStack = (api) => {
    addCorsHeaders(api);
    api.use(createApiErrorHandler(logger));
  };

  return defaultApiStack;
}

module.exports = {
  createDefaultApiStack,
};
