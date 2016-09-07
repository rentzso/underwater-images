'use strict';

const angular = require('angular');
const app = angular.module('app');
require('../services/loadData.js');

app.component('uwiImageList', {
  templateUrl: '../../partials/imageList.html',
  controller: uwiImageListController,
  bindings: {
    filters: '='
  }
});

uwiImageListController.$inject = ['$interval', 'uwiStorage'];

function uwiImageListController($interval, uwiStorage) {
  /*jshint validthis: true */
  const ctrl = this;
  window._uwiImageListController = ctrl;
  ctrl.loaded = false;
  ctrl.filter = null;
  ctrl.addFilter = addFilter;
  ctrl.images = [];
  const p = $interval(() => {
    ctrl.images = uwiStorage.imageList(ctrl.filter);
    ctrl.imageCount = ctrl.images.length;
    if (uwiStorage.isLoaded()){
      $interval.cancel(p);
      ctrl.loaded = true;
    }
  }, 250);
  function addFilter(filter) {
    ctrl.filter = filter;
    ctrl.images = uwiStorage.imageList(ctrl.filter);
  }
  ctrl.page = 1;
  ctrl.paging = paging;
  function paging(pageNumber, sliceSize) {
    const start = (pageNumber - 1) * sliceSize;
    const end = start + sliceSize;
    return ctrl.images.slice(start, end);
  }
}
