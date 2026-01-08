'use strict';

/**
 * Extract proxy path from API Gateway proxy event
 * Proxy path does not contain any url paths before proxy path variable.
 *
 * E.g. for resource "/api/v1/{proxy+}" only the path matched with {proxy+} is returned
 *
 * @param {{ resource: string, path: string, pathParameters?: { [key: string]: string } }} event
 * @returns {string}
 * @throws {Error} If resource does not contain proxy path
 */
function extractProxyPath(event) {
  const proxyNameMatch = event.resource.match(/\{(\w+)\+\}$/);

  if (!proxyNameMatch) {
    throw new Error('Resource does not contain proxy path');
  }

  const proxyName = proxyNameMatch[1];
  const proxyPath =
    (event.pathParameters && event.pathParameters[proxyName]) || '';
  const startsWithSlash = proxyPath.length > 0 && proxyPath[0] === '/';

  if (startsWithSlash) {
    return proxyPath;
  } else {
    return '/' + proxyPath;
  }
}

module.exports = {
  extractProxyPath,
};
