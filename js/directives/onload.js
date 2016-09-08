'use strict';

const angular = require('angular');
const app = angular.module('app');

app.directive('uwiOnload', ['$parse', function ($parse) {
  return {
    restrict: 'A',
    link: function (scope, elem, attrs) {
      var fn = $parse(attrs.uwiOnload);
      elem.on('load', function (event) {
        scope.$apply(function() {
          fn(scope, { $event: event });
        });
      });
    }
  };
}]);
