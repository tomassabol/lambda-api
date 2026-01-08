'use strict';

const { sendErrorResponse } = require('./send-error-response');
const { ApiError, ErrorWithDetails } = require('../errors');
const { logger: defaultLogger } = require('./logger');

const STANDARD_ERRORS = [
  'RouteError',
  'MethodError',
  'ResponseError',
  'FileError',
];

/**
 * Handle errors with support for default lambda-api errors, ApiError and ErrorWithDetails.
 *
 * @param {object} logger - Logger instance (defaults to console)
 * @returns {function} Error handling middleware
 */
function createApiErrorHandler(logger = defaultLogger) {
  const apiErrorHandler = (err, req, res, next) => {
    logger.error('Error in route handler', { error: err });

    if (STANDARD_ERRORS.includes(err.name)) {
      // Let lambda-api handle standard errors
      next();
      return;
    }

    if (err instanceof ApiError) {
      sendErrorResponse({
        req,
        res,
        message: err.message,
        statusCode: err.statusCode,
        details: err.details,
      });
    } else if (err instanceof ErrorWithDetails) {
      sendErrorResponse({
        req,
        res,
        message: err.message,
        details: err.details,
      });
    } else {
      sendErrorResponse({
        req,
        res,
        message: err.message,
      });
    }

    next();
  };

  return apiErrorHandler;
}

module.exports = {
  createApiErrorHandler,
};

