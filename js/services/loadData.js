'use strict';

const angular = require('angular');
const app = angular.module('app');
require('./config.js');
require('./ajaxQueues.js');

app.factory('uwiStorage', uwiStorage);
uwiStorage.$inject = ['ajaxQueues', 'uwiConfig'];

function uwiStorage(ajaxQueues, uwiConfig) {
  ajaxQueues.append({
    method: 'GET',
    url: 'static/jpeg_list.txt'
  }).then(function(res){
    loadContent(res.data);
  });
  const locations = {};
  const _images = [];
  let lenJpegs = -1;
  return {
    imageList: imageList,
    locations: locations,
    isLoaded: isLoaded
  };

  function loadContent(content){
    const jpegs = content.split('\n');
    lenJpegs = jpegs.length;
    jpegs.forEach(function(f){
      if (f) {
        getOrCreateLocation(f).then(function(location){
          const image = {
            location: location,
            path: [uwiConfig.baseURL, uwiConfig.dataURL, f].join('/'),
            thumbnail: [uwiConfig.baseURL,
                        uwiConfig.thumbnailsURL,
                        f.replace(/\/([^/]*\.(jpg|jpeg|JPG|JPEG))/, '/thumbnail.$1')
                       ].join('/'),
          };
          _images.push(image);
        });
      }
    });
  }
  function imageList(filter){
    if (filter) {
      return _images.filter(filter);
    } else {
      return _images;
    }
  }

  function getOrCreateLocation(f) {
    const _id = f.split('/')[0];
    if (!location[_id]) {
      return new Promise(function (resolve, reject){
        ajaxQueues.append({
          method: 'GET',
          url: [uwiConfig.baseURL, uwiConfig.dataURL, _id, uwiConfig.locationFile].join('/')
        }).then(function(response){
          const parser = new DOMParser();
          const xmldoc = parser.parseFromString(response.data, 'text/xml');
          location[_id] = _parseLocation(xmldoc);
          resolve(location[_id]);
        },
        function(error) {
          console.log(error);
          console.log(f);
          reject(error);
        }
      );
      });
    } else {
      return new Promise(function(resolve){
        resolve(location[_id]);
      });
    }
  }
  function _parseLocation(xmldoc) {
    return {
      name: _getTextForTag(xmldoc, 'location'),
      latitude: _getTextForTag(xmldoc, 'latitude'),
      longitude: _getTextForTag(xmldoc, 'longitude'),
      depth: _getTextForTag(xmldoc, 'depth'),
      date: _getTextForTag(xmldoc, 'date'),
      time: _getTextForTag(xmldoc, 'time')
    };
  }
  function _getTextForTag(xmldoc, tag) {
    return xmldoc.getElementsByTagName(tag)[0].childNodes[0].nodeValue;
  }
  function isLoaded(){
    return lenJpegs !== -1 && _images.length === lenJpegs;
  }
}
