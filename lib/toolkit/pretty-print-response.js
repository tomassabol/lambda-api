'use strict';

/**
 * Pretty print API response.
 * Shorten API response body if exceeds specific length.
 *
 * @param {object} response - Lambda API response
 * @param {{ httpMethod: string, path: string, body?: string|null }} event - API Gateway event
 * @param {{ maxBodyLength?: number, showHeaders?: boolean }} options - Options
 * @returns {object}
 */
function prettyPrintResponse(response, event, options = {}) {
  const { maxBodyLength = 2500, showHeaders = false } = options;

  if (
    response &&
    typeof response === 'object' &&
    typeof response.body === 'string'
  ) {
    const {
      statusCode,
      isBase64Encoded,
      body: responseBody,
      multiValueHeaders,
    } = response;

    const { httpMethod, path, body: requestBody } = event;

    return {
      statusCode,
      httpMethod,
      path,
      responseBody: formatBody(responseBody, maxBodyLength),
      isBase64Encoded,
      ...(showHeaders && { multiValueHeaders }),
      requestBody: formatBody(requestBody, maxBodyLength),
    };
  }
  return response;
}

function formatBody(body, maxLength) {
  if (typeof body === 'string' && body.length > maxLength) {
    body =
      body.substring(0, maxLength) +
      ` ... ${body.length - maxLength} more characters`;
  }

  return safeJSONParse(body) || body;
}

function safeJSONParse(str) {
  if (typeof str === 'string') {
    try {
      return JSON.parse(str);
    } catch (error) {
      // Ignore error
    }
  }
  return undefined;
}

module.exports = {
  prettyPrintResponse,
};
