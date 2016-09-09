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
  const places = [];
  const _images = [];
  let lenJpegs = -1;
  const extremes = {
    maxLatitude: -Infinity,
    minLatitude:  Infinity,
    maxLongitude: -Infinity,
    minLongitude: Infinity
  };
  return {
    imageList: imageList,
    locations: locations,
    isLoaded: isLoaded,
    extremes: extremes,
    places: places
  };

  function loadContent(content){
    const jpegs = content.split('\n');
    lenJpegs = jpegs.length;
    jpegs.forEach(function(f){
      if (f) {
        getOrCreateLocation(f).then(function(location){
          const latitude = convertLatitude(location.latitude);
          const longitude = convertLongitude(location.longitude);
          location.coordinates = [longitude, latitude];
          if (longitude > extremes.maxLongitude) {
            extremes.maxLongitude = longitude;
          } else if (longitude < extremes.minLongitude) {
            extremes.minLongitude = longitude;
          }
          if (latitude > extremes.maxLatitude) {
            extremes.maxLatitude = latitude;
          } else if (latitude < extremes.minLongitude) {
            extremes.minLatitude = latitude;
          }
          const image = {
            location: location,
            path: [uwiConfig.baseURL, uwiConfig.dataURL, f].join('/'),
            thumbnail: [uwiConfig.baseURL,
                        uwiConfig.thumbnailsURL,
                        f.replace(/\/([^/]*\.(jpg|jpeg|JPG|JPEG))/, '/thumbnail.$1')
                       ].join('/'),
          };
          if (!places[location.name]){
              places[location.name] = [];
          }
          places[location.name].push(image);
          _images.push(image);
        });
      } else {
        lenJpegs -= 1;
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
    if (!locations[_id]) {
      return new Promise(function (resolve, reject){
        ajaxQueues.append({
          method: 'GET',
          url: [uwiConfig.baseURL, uwiConfig.dataURL, _id, uwiConfig.locationFile].join('/')
        }).then(function(response){
          const parser = new DOMParser();
          const xmldoc = parser.parseFromString(response.data, 'text/xml');
          locations[_id] = _parseLocation(xmldoc);
          resolve(locations[_id]);
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
        resolve(locations[_id]);
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
  function convertLatitude(latitude){
    const rx = /(.*)(N|S)(.*)/g;
    const m = rx.exec(latitude);
    const result = Number(m[1]) + Number(m[3])/60;
    return m[2]==='N'?result:-result;
  }
  function convertLongitude(longitude){
    const rx = /(.*)(W|E)(.*)/g;
    const m = rx.exec(longitude);
    const result = Number(m[1]) + Number(m[3])/60;
    return m[2]==='E'?result:-result;
  }
  function isLoaded(){
    console.log([lenJpegs, _images.length]);
    return lenJpegs !== -1 && _images.length === lenJpegs;
  }
}
