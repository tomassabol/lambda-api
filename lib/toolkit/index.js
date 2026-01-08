'use strict';

const { createApiHandler } = require('./api-handler');
const { createDefaultApiStack } = require('./default-api-stack');
const { createApiErrorHandler } = require('./error-handler');
const { addCorsHeaders } = require('./add-cors-headers');
const { sendErrorResponse } = require('./send-error-response');
const { extractProxyPath } = require('./extract-proxy-path');
const { prettyPrintResponse } = require('./pretty-print-response');
const { logger, noLogger } = require('./logger');

module.exports = {
  createApiHandler,
  createDefaultApiStack,
  createApiErrorHandler,
  addCorsHeaders,
  sendErrorResponse,
  extractProxyPath,
  prettyPrintResponse,
  logger,
  noLogger,
};

