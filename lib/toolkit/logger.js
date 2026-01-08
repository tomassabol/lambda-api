'use strict';

/**
 * Empty logger used to disable logging for unit tests.
 */
const noLogger = {
  log: () => undefined,
  debug: () => undefined,
  info: () => undefined,
  error: () => undefined,
  warn: () => undefined,
};

/**
 * CloudWatch logger.
 * Uses console by default, falls back to noLogger during tests.
 */
const logger =
  process.env.JEST_WORKER_ID === undefined || process.env.TEST_LOGGER
    ? console
    : noLogger;

module.exports = {
  logger,
  noLogger,
};

