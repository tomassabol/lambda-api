'use strict';

/**
 * Send http error response using lambda-api response object.
 *
 * @param {{ req: object, res: object, message: string, statusCode?: number, details?: unknown }} params
 */
function sendErrorResponse(params) {
  const { req, res, statusCode = 500, message, details } = params;
  const hasDetails = !!details;

  res.sendStatus(statusCode);
  res.send({
    error: message,
    ...(hasDetails && { details }),
    requestId: req.id,
  });
  res.header('Content-Type', 'application/json');
}

module.exports = {
  sendErrorResponse,
};

