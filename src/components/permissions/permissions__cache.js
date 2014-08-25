'use strict';

/**
 * Converts an array of cached permissions to a a map of a permission key
 * to the respective cached permission.
 *
 * @param { {
 *   permission: {key: string},
 *   global: boolean?,
 *   spaces: {id: string}[]?
 * }[] } cachedPermissions
 * @param {string=} prefix a substring to chop off from the beginning of the permission key
 * @return {object} permission cache
 * @private
 */
var PermissionCache = function (cachedPermissions, prefix) {
  this.permissionCache = {};
  for (var i = 0; i < cachedPermissions.length; i++) {
    var cachedPermission = cachedPermissions[i];
    var key = cachedPermission.permission.key;
    if (prefix && key.indexOf(prefix) === 0) {
      key = key.substr(prefix.length);
    }
    cachedPermission.spaceIdSet = PermissionCache._toSpaceIdSet(cachedPermission.spaces);
    this.permissionCache[key] = cachedPermission;
  }
};

/**
 * Convert an array of spaces to a set of space ids.
 *
 * @param {{id: string}=} spaces
 * @return {object} a set of space ids
 * @private
 */
PermissionCache._toSpaceIdSet = function (spaces) {
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
 * Checks if the current user has the given permissions in the space with the given id.
 *
 * @param {string} permissions  space separated list of permissions
 * @param {string=} spaceId     optional spaceId. If absent the method checks
 *  if the given permission is granted in any space.
 *
 * @return {boolean}
 */
PermissionCache.prototype.has = function (permissions, spaceId) {
  if (!permissions) {
    return true;
  }
  var permissionList = permissions.split(/\s+/);

  for (var i = permissionList.length - 1, cachedPermission; i >= 0; i--) {
    cachedPermission = this.permissionCache[permissionList[i]];
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

module.exports = PermissionCache;