'use strict';

const angular = require('angular');
const app = angular.module('app');

app.factory('uwiConfig', uwiConfig);
uwiConfig.$inject = [];

function uwiConfig() {
  return {
    baseURL: 'http://underwater.scitran.io',
    thumbnailsURL: 'thumbnails',
    dataURL: 'Dataset',
    locationFile: 'params.xml',
    useThumbnails: false
  };
}
