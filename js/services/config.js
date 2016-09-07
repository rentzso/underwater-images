'use strict';

const angular = require('angular');
const app = angular.module('app');

app.factory('uwiConfig', uwiConfig);
uwiConfig.$inject = [];

function uwiConfig() {
  return {
    baseURL: 'http://localhost:9201',
    thumbnailsURL: 'thumbnails',
    dataURL: 'data',
    locationFile: 'params.xml'
  };
}
