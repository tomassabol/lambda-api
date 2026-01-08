'use strict';

const { createDefaultApiStack } = require('./default-api-stack');
const { extractProxyPath } = require('./extract-proxy-path');
const { logger: defaultLogger } = require('./logger');
const { prettyPrintResponse } = require('./pretty-print-response');

// Lazy require to avoid circular dependency
let _createAPI;
const getCreateAPI = () => {
  if (!_createAPI) {
    _createAPI = require('../../index');
  }
  return _createAPI;
};

/**
 * Create handler for Lambda API proxy integration
 *
 * @param {function|function[]} routes - List of routes to register for API
 * @param {object} options - Options
 * @param {function|null} options.apiStack - Optional routes to define the stack (error handling, cors, etc.)
 * @param {object} options.logger - Optional logger
 * @param {object} options.loggerOptions - Options for createAPI function
 * @param {object} options.apiOptions - Additional options for createAPI function
 * @returns {function} Lambda handler function
 *
 * @example
 * ```javascript
 * const { createApiHandler } = require('@tomassabol/lambda-api');
 *
 * exports.handler = createApiHandler([routes1, routes2]);
 *
 * const routes1 = (api) => {
 *   api.get('/api/first', (req, res) => { ... });
 * };
 * ```
 */
function createApiHandler(routes, options = {}) {
  const {
    logger = defaultLogger,
    apiStack = createDefaultApiStack(logger),
    loggerOptions = {},
    apiOptions = {},
  } = options;

  const api = getCreateAPI()({
    logger: {
      errorLogging: false,
      access: false,
      detail: false,
      log: logger.info.bind(logger),
      ...loggerOptions,
    },
    ...apiOptions,
  });

  if (apiStack) {
    api.register(apiStack);
  }

  const routesArray = Array.isArray(routes) ? Array.from(routes) : [routes];
  routesArray.forEach((route) => api.register(route));

  /**
   * Lambda handler function
   * @param {object} event - API Gateway event
   * @param {object} context - Lambda context
   * @returns {Promise<object>} API Gateway response
   */
  const handler = async (event, context) => {
    logger.debug('Incoming event', { event, context });

    // Support lambda-warmer if installed
    try {
      const warmer = require('lambda-warmer');
      if (await warmer(event)) return 'warmed';
    } catch (e) {
      // lambda-warmer not installed, skip warming check
    }

    /*
     * When API GW is attached to a domain the path can be prefixed by mapping path.
     * Extracting proxy path will eliminate the need to remove this prefix.
     */
    try {
      event.path = extractProxyPath(event);
    } catch (e) {
      // Resource doesn't contain proxy path, use original path
    }

    const response = await api.run(event, context);

    logger.debug('API response', prettyPrintResponse(response, event));

    return response;
  };

  return handler;
}

module.exports = {
  createApiHandler,
};
