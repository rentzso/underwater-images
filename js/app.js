'use strict';

const angular = require('angular');
const app = angular.module('app', [require('angular-ui-router')]);
require('./directives/imageList.js');
require('./directives/image.js');
require('./directives/onload.js');

require('../css/global.css');

require('../partials/image.html');
require('../partials/imageList.html');
require('../partials/main.html');

document.addEventListener('DOMContentLoaded', boot);

function boot() {
  angular.bootstrap(document, ['app'], {
    strictDi: false
  });
}

app.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/main');
// Now set up the states
  const main = {
    url: '/main',
    templateUrl: 'partials/main.html'
  };
  $stateProvider
    .state('main', main);
});
