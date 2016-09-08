/* global __dirname */
'use strict';

module.exports = {
  entry: './js/app.js',
  output: {
    path: __dirname + '/build',
    filename: 'app.bundle.js',
    publicPath: 'http://localhost:8080/build'
  },
  module:{
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.html$/, loader: 'raw-loader'}
    ],
  }
};
