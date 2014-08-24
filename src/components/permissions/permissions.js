'use strict';

var Auth = require('../auth/auth');
var PermissionCache = require('./permissions__cache');

/**
 * <code>
 *   var permissions = new Permissions(auth, {prefix: 'jetbrains.jetpass.', serviceId: auth.serviceId})
 *   permissions.load().then(function (p) {
 *     var canReadUser = p.has('read-user');
 *     ...
 *   });
 *
 *   permissions.check('read-user').then(function(canReadUser) {
 *     ...
 *   });
 * </code>
 *
 * @param {Auth} auth instance of well configured Auth object
 * @param {{
 *  prefix: string?,
 *  serviceId: string?
 * }?} config permissions loaded configuration. <code>prefix</code> if provided then this prefix is removed
 * from the permissions names. <code>serviceId</code> if provided then permissions only for the service are loaded.
 * @constructor
 */
var Permissions = function (auth, config) {
  config = config || {};
  this.query = config.serviceId && ('service: {' + config.serviceId + '}');
  this.prefix = config.prefix;

  this._auth = auth;
  this._promise = null;
};

var API_PERMISSION_CACHE_PATH = Auth.API_PATH + '/permissions/cache';

/**
 * Loads logged in user permissions.
 * @return {Promise.<Permissions>} promise that is resolved when the permissions are loaded
 */
Permissions.prototype.load = function () {
  if (this._promise) {
    return this._promise;
  }

  var self = this;
  this._promise = this._auth.requestToken().then(function (accessToken) {
    var params = {
      fields: 'permission/key,global,spaces(id)',
      query: self.query
    };
    return self.getSecure(API_PERMISSION_CACHE_PATH, accessToken, params).
      then(function (cachedPermissions) {
        return new PermissionCache(cachedPermissions, self.prefix);
      });
  });

  return this._promise;
};

/**
 * Waits till the permission cache is loaded then checks if the current user has the
 * given permissions in the space with the given id.
 *
 * @param {string} permissions  space separated list of permissions
 * @param {string?} spaceId     optional spaceId. If absent the method checks
 *  if the given permission is granted in any space.
 *
 * @return {Promise.<boolean>}
 */
Permissions.prototype.check = function (permissions, spaceId) {
  this.load().
    then(function (permissionCache) {
      return permissionCache.has(permissions, spaceId);
    });
};

module.exports = Permissions;