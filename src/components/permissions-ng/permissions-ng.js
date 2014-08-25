'use strict';

var Permissions = require('../permissions/permissions');

/* global angular: false */
var permissionsModule = angular.module('Ring.permissions', ['Ring.auth']);

/**
 * Configure:
 * @example
 * <pre>
 * angular.config(['userPermissionsProvider', function (userPermissionsProvider) {
 *   userPermissionsProvider.config({
 *     serviceId: '0-0-0-0-0',
 *     prefix: 'jetbrains.jetpass.'
 *   });
 * }]);
 * </pre>
 */
permissionsModule.provider('userPermissions', [function () {
  /**
   * @type {{
   *   serviceId: string?,
   *   prefix: string?
   * }}
   */
  var _config = {};

  /**
   * @param {{
   *   serviceId: string?,
   *   prefix: string?
   * }} config
   */
  this.config = function (config) {
    _config = config;
  };

  this.$get = ['auth', function (auth) {
    return new Permissions(auth.auth, _config);
  }];
}]);

module.exports = permissionsModule;