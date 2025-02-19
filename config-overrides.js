const { override, addWebpackAlias, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');
const path = require('path');

module.exports = override(
  // Add polyfills for Node.js core modules
  (config) => {
    config.resolve.fallback = {
      http: false,
      https: false,
      // Add other modules as needed
    };
    return config;
  }
); 