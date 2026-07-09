const {join} = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Use PUPPETEER_CACHE_DIR env var if set (e.g., on Render.com),
  // otherwise fall back to a local cache directory.
  cacheDirectory: process.env.PUPPETEER_CACHE_DIR
    ? process.env.PUPPETEER_CACHE_DIR
    : join(__dirname, '.puppeteer', 'cache'),
};
