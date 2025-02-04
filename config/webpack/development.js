const { devServer, inliningCss } = require('shakapacker');
const webpackConfig = require('./webpackConfig');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

const developmentEnvOnly = (clientWebpackConfig, serverWebpackConfig) => {
  if (inliningCss) {
    const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
    clientWebpackConfig.plugins.push(
      new ReactRefreshWebpackPlugin({
        overlay: {
          sockPort: devServer.port,
        },
      })
    );
  }

  clientWebpackConfig.plugins.push(new NodePolyfillPlugin());

  clientWebpackConfig.resolve = {
    ...clientWebpackConfig.resolve,
    fallback: {
      ...clientWebpackConfig.resolve?.fallback,
      process: require.resolve('process/browser.js'), // Explicitly add `.js` extension
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/'),
      fs: false,
      net: false,
      tls: false,
    },
    extensions: ['.js', '.jsx', '.mjs', '.json'],
  };

  clientWebpackConfig.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser.js', // Add explicit file extension
      Buffer: ['buffer', 'Buffer'],
    })
  );

  serverWebpackConfig.resolve = {
    ...serverWebpackConfig.resolve,
    fallback: {
      stream: false,
      fs: false,
      net: false,
      tls: false,
    },
  };
};

module.exports = webpackConfig((clientWebpackConfig, serverWebpackConfig) => {
  developmentEnvOnly(clientWebpackConfig, serverWebpackConfig);
  return [clientWebpackConfig, serverWebpackConfig];
});