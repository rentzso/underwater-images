'use strict';
const angular = require('angular');
const app = angular.module('app');
const Rx = require('rx');

app.factory('ajaxQueues', queues);

queues.$inject = ['$http'];

function queues($http) {
  let q = new Rx.Subject();
  let o = q.controlled();
  o.request(6);
  o.subscribe(
    function(message) {
      $http(message.options).then(function(response){
        message.resolve(response);
        o.request(1);
      }, function(error){
        message.reject(error);
        o.request(1);
      });
    },
    function(error) {
      console.log(error);
    },
    function() {
      console.log('queue has been closed');
    }
  );
  let service = {
    append: append
  };
  return service;

  function append(options) {
    const message = {
      options: options
    };
    return new Promise(function(resolve, reject){
      q.onNext(
        Object.assign({}, message, {resolve: resolve, reject: reject})
      );
    });
  }
}
