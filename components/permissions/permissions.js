var Auth = require('../auth/auth');
var PermissionCache = require('./permissions__cache');

/**
 * @example
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
 *   prefix: string?,
 *   namesConverter: function?
 *   serviceId: string?
 * }=} config permissions loaded configuration.
 * <code>prefix</code> if provided then this prefix is removed from the permissions names.
 * <code>namesConverter</code> if provided it maps permission names used on server-side to client-side permission names. It is used only if prefix is undefined.
 * <code>serviceId</code> if provided then permissions only for the service are loaded.
 * @constructor
 */
var Permissions = function (auth, config) {
  config = config || {};
  this.query = config.serviceId && ('service: {' + config.serviceId + '}');
  this.namesConverter = config.prefix ? Permissions.getDefaultNamesConverter(config.prefix) : config.namesConverter;

  if (auth == null) {
    throw new Error('Parameter auth is required');
  }

  this._auth = auth;
  this._promise = null;
};

/**
 * Returns function, which cuts off prefix from server-side permission name
 *
 * @param {string} prefix
 * @returns {Function}
 */
Permissions.getDefaultNamesConverter = function(prefix) {
  return function (storedName) {
    return storedName.indexOf(prefix) !== 0 ? storedName : storedName.substr(prefix.length);
  };
};

/**
 * @const {string}
 */
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
    return self._auth.getSecure(API_PERMISSION_CACHE_PATH, accessToken, params).
      then(function (cachedPermissions) {
        return new PermissionCache(cachedPermissions, self.namesConverter);
      });
  });

  return this._promise;
};

/**
 * Waits till the permission cache is loaded then checks if the current user has the
 * given permissions in the space with the given id.
 *
 * @param {string} permissions  space separated list of permissions
 * @param {string=} spaceId     optional spaceId. If absent the method checks
 *  if the given permission is granted in any space.
 *
 * @return {Promise.<boolean>}
 */
Permissions.prototype.check = function (permissions, spaceId) {
  return this.load().
    then(function (permissionCache) {
      return permissionCache.has(permissions, spaceId);
    });
};

/**
 * Binds a property with the name <code>propertyName</code> of the <code>object</code>
 * to a boolean value that is true if user has the permissions and false if she doesn't.
 *
 * @expample
 * <code>
 *   userPermissions.bindVariable($scope, 'canReadRole', 'role-read')
 * </code>
 *
 * @param {object} object       an object which property should be bound
 * @param {string} propertyName a name of a property to bind
 * @param {string} permissions  space separated list of permissions
 * @param {string=} spaceId     optional spaceId. If absent the method checks
 *  if the given permissions are granted in any space.
 *
 * @return {Promise.<boolean>}
 */
Permissions.prototype.bindVariable = function (object, propertyName, permissions, spaceId) {
  object[propertyName] = false;
  return this.check(permissions, spaceId).
    then(function (permitted) {
      object[propertyName] = permitted;
      return permitted;
    });
};

module.exports = Permissions;
