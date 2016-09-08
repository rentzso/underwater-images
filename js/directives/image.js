'use strict';

const angular = require('angular');
const app = angular.module('app');

app.component('uwiImage',{
  templateUrl: '../../partials/image.html',
  controller: uwiImageController,
  bindings: {
    image: '='
  }
});

function uwiImageController() {
  /*jshint validthis: true */
  const ctrl = this;
  ctrl.loaded = false;
}
