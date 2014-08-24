'use strict';

var Auth = require('../auth/auth');

/**
 * <code>
 *   var permissions = new Permissions(auth, {prefx: 'jetbrains.jetpass.', serviceId: auth.serviceId})
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
 *  prefx: string?,
 *  serviceId: string?
 * }?} config permissions loaded configuration. <code>prefx</code> if provided then this prefix is removed
 * from the permissions names. <code>serviceId</code> if provided then permissions only for the service are loaded.
 * @constructor
 */
var Permissions = function (auth, config) {
  config = config || {};
  this.query = config.serviceId && ('service: {' + config.serviceId + '}');
  this.prefix = config.prefx;

  this._auth = auth;
  this._permissionCache = {};
  this._promise = null;
};

var API_PERMISSION_CACHE_PATH = Auth.API_PATH + '/permissions/cache';

/**
 * Loads logged in user permissions.
 * @return {Promise.<Permissions>} promise that is resolved when the permissions are loaded
 */
Permissions.prototype.load = function () {
  if (this._promise) {
    return this._promise.promise();
  }

  var self = this;
  this._promise = this._auth.requestToken().then(function (accessToken) {
    var params = {
      fields: 'permission/key,global,spaces(id)',
      query: self.query
    };
    return self.getSecure(API_PERMISSION_CACHE_PATH, accessToken, params).
      then(function (cachedPermissions) {
        self._permissionCache = Permissions._initPermissionCache(cachedPermissions, self.prefix);
        return self;
      });
  });

  return this._promise;
};

/**
 * Checks if the current user has the given permissions in the space with the given id.
 * If this method is called before <code>load()</code> then it always returns false.
 *
 * @param {string} permissions  space separated list of permissions
 * @param {string?} spaceId     optional spaceId. If absent the method checks
 *  if the given permission is granted in any space.
 *
 * @return {boolean}
 */
Permissions.prototype.has = function (permissions, spaceId) {
  if (!permissions) {
    return true;
  }
  var permissionList = permissions.split(/\s+/);

  for (var i = permissionList.length - 1, cachedPermission; i >= 0; i--) {
    cachedPermission = this._permissionCache[permissionList[i]];
    // Has no the permission in any space
    if (!cachedPermission) {
      return false;
    }
    // The permission is global or is given in the global space
    if (cachedPermission.global) {
      return true;
    }
    // spaceId is specified but the permission isn't given in the space
    if (spaceId && !(cachedPermission.spaceIdSet && cachedPermission.spaceIdSet[spaceId])) {
      return false;
    }
  }

  return true;
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
    then(function (self) {
      return self.has(permissions, spaceId);
    });
};

/**
 * Convert an array of spaces to a set of space ids.
 *
 * @param {{id: string}?} spaces
 * @return {object} a set of space ids
 * @private
 */
Permissions._toSpaceIdSet = function (spaces) {
  var spaceIdSet = null;
  if (spaces) {
    spaceIdSet = {};
    for (var i = 0; i < spaces.length; i++) {
      spaceIdSet[spaces[i].id] = true;
    }
  }
  return spaceIdSet;
};

/**
 * Convert an array of cached permissions to a permissionCache that is a map of a permission key
 * to the respective cached permission.
 *
 * @param { {
 *  permission: {key: string},
 *  global: boolean?,
 *  spaces: {id: string}[]?
 * }[] } cachedPermissions
 * @param {string?} prefix a substring to chop off from the beginning of the permission key
 * @return {object} permission cache
 * @private
 */
Permissions._initPermissionCache = function (cachedPermissions, prefix) {
  var permissionCache = {};
  for (var i = 0; i < cachedPermissions.length; i++) {
    var cachedPermission = cachedPermissions[i];
    var key = cachedPermission.permission.key;
    if (prefix && key.indexOf(prefix) === 0) {
      key = key.substr(prefix);
    }
    cachedPermission.spaceIdSet = Permissions._toSpaceIdSet(cachedPermission.spaces);
    permissionCache[key] = cachedPermission;
  }

  return permissionCache;
};

module.exports = Permissions;