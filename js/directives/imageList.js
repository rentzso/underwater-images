/*global d3, topojson */

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

uwiImageListController.$inject = ['$scope', '$interval', 'uwiStorage'];

function uwiImageListController($scope, $interval, uwiStorage) {
  /*jshint validthis: true */
  const ctrl = this;
  window._uwiImageListController = ctrl;
  ctrl.locations = uwiStorage.locations;
  ctrl.extremes = uwiStorage.extremes;
  ctrl.loaded = false;
  ctrl.filter = null;
  ctrl.addFilter = addFilter;
  ctrl.images = [];
  const d3Obj = loadD3();
  const p = $interval(() => {
    ctrl.images = uwiStorage.imageList(ctrl.filter);
    ctrl.imageCount = ctrl.images.length;
    if (uwiStorage.isLoaded()){
      console.log('bppm');
      $interval.cancel(p);
      ctrl.loaded = true;
      loadLocations(d3Obj.svg, d3Obj.projection);
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
  ctrl.prevPageGroup = prevPageGroup;
  ctrl.firstPage = 1;
  function prevPageGroup(){
    ctrl.firstPage -= 5;
    ctrl.page = ctrl.firstPage + 4;
  }
  ctrl.nextPageGroup = nextPageGroup;
  function nextPageGroup(){
    ctrl.firstPage += 5;
    ctrl.page = ctrl.firstPage;
  }
  function selectLocation(location) {
    $scope.$apply(function(){
      ctrl.images = location.images;
      ctrl.imageCount = ctrl.images.length;
      ctrl.page = 1;
    });
  }

  function loadD3() {
    console.log('called');
    let width = 450,
        height = 865;

    let svg = d3.select('.d3-map').append('svg')
      .attr('viewBox', '0 0 ' + width + ' ' + height)
      .attr('preserveAspectRatio', 'none');
    let center = [-59.0, 15.0];
    let projection = d3.geo.albers()
      .center(center)
      .rotate([10, 18, 15])
      .scale(8000);
    //.translate([width / 2, height / 2]);
    let path = d3.geo.path()
      .projection(projection)
      .pointRadius(2);
    d3.json('coastline_obj.json', function(error, coast) {
      if (error) return console.error(error);
      console.log(coast);
      svg.append('path')
          .attr('class', 'boundary')
          .datum(topojson.feature(coast, coast.objects.coastline))
          .attr('d', path);
      svg.append('path')
          .datum(topojson.feature(coast, coast.objects.places))
          .attr('d', path)
          .attr('class', 'place');
      svg.selectAll('.place-label')
          .data(topojson.feature(coast, coast.objects.places).features)
        .enter().append('text')
          .attr('class', 'place-label')
          .attr('transform', function(d) { return 'translate(' + projection(d.geometry.coordinates) + ')'; })
          .attr('dy', '.35em')
          .text(function(d) { return d.properties.name; });

      svg.selectAll('.place-label')
          .attr('x', function(d) { return d.geometry.coordinates[0] > -1 ? 6 : -6; })
          .style('text-anchor', function(d) { return d.geometry.coordinates[0] > -1 ? 'start' : 'end'; });

    });
    return {
      svg: svg,
      projection: projection
    };
  }
  function loadLocations(svg, projection){
    const locations = Object.keys(uwiStorage.places).map((key) => {
      const placeImages = uwiStorage.places[key];
      return {
        coordinates: placeImages[0].location.coordinates,
        images: placeImages
      };
    });
    let selected = null;
    svg.selectAll('circle')
        .data(locations)
      .enter()
        .append('circle')
        .attr('cx', function (d) { console.log(d); return projection(d.coordinates)[0]; })
        .attr('cy', function (d) { return projection(d.coordinates)[1]; })
        .attr('r', '4px')
        .attr('class', 'd3-location')
        .on('click', function(d){
          if (selected){
            selected.setAttribute('class', 'd3-location');
          }
          selected = this;
          selected.setAttribute('class', 'd3-location-selected');
          selectLocation(d);
        });
  }
}
