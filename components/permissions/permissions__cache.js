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
export default class PermissionCache {
  static GLOBAL_SPACE_ID = 'global';

  /**
   * Convert an array of projects to a set of space ids.
   *
   * @param {object[]=} projects
   * @return {object} a set of space ids
   * @private
   */
  static _toProjectIdSet(projects) {
    let spaceIdSet = null;

    if (projects) {
      spaceIdSet = {};
      for (let i = 0; i < projects.length; i++) {
        spaceIdSet[projects[i].id] = true;
      }
    }

    return spaceIdSet;
  }

  constructor(permissions, namesConverter) {
    const permissionCache = {};

    permissions.forEach(permission => {
      let key = permission.permission.key;

      if (namesConverter) {
        key = namesConverter(key);
      }

      if (key) {
        permissionCache[key] = {
          global: permission.global,
          spaceIdSet: this.constructor._toProjectIdSet(permission.projects)
        };
      }
    });

    this.namesConverter = namesConverter || function () {};
    this.permissionCache = permissionCache;
  }

  /**
   * Checks if the current user has the given permissions in the space with the given id.
   *
   * @param {string} permissions  space separated list of permissions
   * @param {string=} spaceId     optional spaceId. If absent the method checks
   *  if the given permission is granted in any space.
   *
   * @return {boolean}
   */
  has(permissions, spaceId) {
    const lexems = this.lex(permissions);
    if (lexems.length === 0) {
      return true;
    }

    try {
      return this.or(lexems, spaceId);
    } catch (e) {
      return false;
    }
  }

  /**
   * Lexes permission query string to an array of lexems.
   *
   * @param {string} query
   * @return {string[]}
   */
  lex(query) {
    const lexems = [];

    if (query) {
      let currentIdentifier = '';

      for (let i = 0; i < query.length; i++) {
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
  }

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
  or(lexems, spaceId) {
    let result = this.and(lexems, spaceId);

    while (lexems.length > 0 && lexems[0] !== ')') {
      if (lexems.shift() !== '|') {
        throw new Error('Operator \'|\' was expected');
      }

      result = this.and(lexems, spaceId) || result;
    }

    return result;
  }

  /**
   * @param {string[]} lexems
   * @param {string=} spaceId
   * @return {boolean}
   */
  and(lexems, spaceId) {
    let result = this.not(lexems, spaceId);

    while (lexems.length > 0 && lexems[0] !== ')' && lexems[0] !== '|') {
      // Expect optional '&'
      if (lexems[0] === '&') {
        lexems.shift();
      }

      result = this.not(lexems, spaceId) && result;
    }

    return result;
  }

  /**
   * @param {string[]} lexems
   * @param {string=} spaceId
   * @return {boolean}
   */
  not(lexems, spaceId) {
    let notCounter = 0;

    while (lexems.length > 0 && lexems[0] === '!') {
      ++notCounter;
      lexems.shift();
    }

    const result = this.term(lexems, spaceId);

    return (notCounter % 2 === 0) ? result : !result;
  }

  /**
   * @param {string[]} lexems
   * @param {string=} spaceId
   * @return {boolean}
   */
  term(lexems, spaceId) {
    if (lexems.length === 0) {
      throw new Error('Operand was expected');
    }

    const t = lexems.shift();
    let result;

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
  }

  /**
   * @param {string} permissionName
   * @param {string=} spaceId
   * @return {boolean}
   */
  testPermission(permissionName, spaceId) {
    const permissionCache = this.permissionCache;
    const cachedPermission = permissionCache[permissionName] || permissionCache[this.namesConverter(permissionName)];

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
  }
}
