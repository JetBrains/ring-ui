/**
 * Converts an array of cached permissions to a a map of a permission key
 * to the respective cached permission.
 *
 * @param { {
 *   permission: {key: string},
 *   global: boolean?,
 *   projects: {id: string}[]?
 * }[] } permissions
 * @param {function} namesConverter a function, which maps a server-side permission name to client-side permission name
 * @return {object} permission cache
 * @private
 */
var PermissionCache = function (permissions, namesConverter) {
  var permissionCache = {};

  permissions.forEach(function(permission) {
    var key = permission.permission.key;

    if (namesConverter) {
      key = namesConverter(key);
    }

    if (key) {
      permissionCache[key] = {
        global: permission.global,
        spaceIdSet: PermissionCache._toProjectIdSet(permission.projects)
      };
    }
  });

  this.namesConverter = namesConverter || function(){};
  this.permissionCache = permissionCache;
};

PermissionCache.GLOBAL_SPACE_ID = 'global';

/**
 * Convert an array of projects to a set of space ids.
 *
 * @param {{id: string}[]=} projects
 * @return {object} a set of space ids
 * @private
 */
PermissionCache._toProjectIdSet = function (projects) {
  var spaceIdSet = null;
  if (projects) {
    spaceIdSet = {};
    for (var i = 0; i < projects.length; i++) {
      spaceIdSet[projects[i].id] = true;
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
  var lexems = this.lex(permissions);
  if (lexems.length === 0) {
    return true;
  }

  try {
    return this.or(lexems, spaceId);
  } catch (e) {
    /* eslint-disable no-console*/
    console.error(e);
    /* eslint-enable no-console*/
    return false;
  }
};

/**
 * Lexes permission query string to an array of lexems.
 *
 * @param {string} query
 * @return {string[]}
 */
PermissionCache.prototype.lex = function (query) {
  var lexems = [];
  if (query) {
    var currentIdentifier = '';
    for (var i = 0; i < query.length; i++) {
      switch (query.charAt(i)) {
        case ' ':
        case '\t':
        case '\n':
        case '\r':
          // Finish current token
          if (currentIdentifier) {
            lexems.push(currentIdentifier);
            currentIdentifier = '';
          }
          // Skip space
          break;
        case '(':
        case ')':
        case '&':
        case '|':
        case '!':
          // Finish current token
          if (currentIdentifier) {
            lexems.push(currentIdentifier);
            currentIdentifier = '';
          }
          // Append operator
          lexems.push(query.charAt(i));
          break;
        default:
          currentIdentifier += query.charAt(i);
          break;
      }
    }
    if (currentIdentifier) {
      lexems.push(currentIdentifier);
    }
  }
  return lexems;
};

/*
 or -> and ( '|' and )*
 and -> not ( '&'?  not )*
 not -> '!'* term
 term -> '(' or ')' | permission
 permission -> [^()&|!\s]+
 */

/**
 * @param {string[]} lexems
 * @param {string=} spaceId
 * @return {boolean}
 */
PermissionCache.prototype.or = function (lexems, spaceId) {
  var result = this.and(lexems, spaceId);

  while (lexems.length > 0 && lexems[0] !== ')') {
    // Expect '|'
    if (lexems.shift() !== '|') {
      throw new Error('Operator \'|\' was expected');
    }

    result = this.and(lexems, spaceId) || result;
  }

  return result;
};

/**
 * @param {string[]} lexems
 * @param {string=} spaceId
 * @return {boolean}
 */
PermissionCache.prototype.and = function (lexems, spaceId) {
  var result = this.not(lexems, spaceId);

  while (lexems.length > 0 && lexems[0] !== ')' && lexems[0] !== '|') {
    // Expect optional '&'
    if (lexems[0] === '&') {
      lexems.shift();
    }

    result = this.not(lexems, spaceId) && result;
  }

  return result;
};

/**
 * @param {string[]} lexems
 * @param {string=} spaceId
 * @return {boolean}
 */
PermissionCache.prototype.not = function (lexems, spaceId) {
  var notCounter = 0;
  while (lexems.length > 0 && lexems[0] === '!') {
    ++notCounter;
    lexems.shift();
  }
  var result = this.term(lexems, spaceId);
  return (notCounter % 2 === 0) ? result : !result;
};

/**
 * @param {string[]} lexems
 * @param {string=} spaceId
 * @return {boolean}
 */
PermissionCache.prototype.term = function (lexems, spaceId) {
  if (lexems.length === 0) {
    throw new Error('Operand was expected');
  }
  var t = lexems.shift();
  var result;
  // Nested paranthesized expression
  if (t === '(') {
    result = this.or(lexems, spaceId);
    // Expect ')'
    if (lexems.shift() !== ')') {
      throw new Error('Operator \')\' was expected');
    }
  } else {
    result = this.testPermission(t, spaceId);
  }
  return result;
};

/**
 * @param {string} permissionName
 * @param {string=} spaceId
 * @return {boolean}
 */
PermissionCache.prototype.testPermission = function (permissionName, spaceId) {
  var permissionCache = this.permissionCache;

  var cachedPermission = permissionCache[permissionName] || permissionCache[this.namesConverter(permissionName)];

  // Hasn't the permission in any space
  if (!cachedPermission) {
    return false;
  }
  // The permission is global or is given in the global space
  if (cachedPermission.global) {
    return true;
  }

  if (spaceId) {
    // if spaceId is specified check that the permission is given in the space
    return cachedPermission.spaceIdSet && (spaceId in cachedPermission.spaceIdSet);
  } else {
    return true;
  }
};

module.exports = PermissionCache;
