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
  static GLOBAL_PROJECT_ID = 'global';

  /**
   * Convert an array of projects to a set of project ids.
   *
   * @param {object[]=} projects
   * @return {object} a set of project ids
   * @private
   */
  static _toProjectIdSet(projects) {
    let projectIdSet = null;

    if (projects) {
      projectIdSet = {};
      for (let i = 0; i < projects.length; i++) {
        projectIdSet[projects[i].id] = true;
      }
    }

    return projectIdSet;
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
          projectIdSet: this.constructor._toProjectIdSet(permission.projects)
        };
      }
    });

    this.namesConverter = namesConverter || function () {};
    this.permissionCache = permissionCache;
  }

  /**
   * Checks if the current user has the given permissions in the project with the given id.
   *
   * @param {string} permissions  space separated list of permissions
   * @param {string=} projectId     optional projectId. If absent the method checks
   *  if the given permission is granted in any project.
   *
   * @return {boolean}
   */
  has(permissions, projectId) {
    const lexems = this.lex(permissions);
    if (lexems.length === 0) {
      return true;
    }

    try {
      return this.or(lexems, projectId);
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
   * @param {string=} projectId
   * @return {boolean}
   */
  or(lexems, projectId) {
    let result = this.and(lexems, projectId);

    while (lexems.length > 0 && lexems[0] !== ')') {
      if (lexems.shift() !== '|') {
        throw new Error('Operator \'|\' was expected');
      }

      result = this.and(lexems, projectId) || result;
    }

    return result;
  }

  /**
   * @param {string[]} lexems
   * @param {string=} projectId
   * @return {boolean}
   */
  and(lexems, projectId) {
    let result = this.not(lexems, projectId);

    while (lexems.length > 0 && lexems[0] !== ')' && lexems[0] !== '|') {
      // Expect optional '&'
      if (lexems[0] === '&') {
        lexems.shift();
      }

      result = this.not(lexems, projectId) && result;
    }

    return result;
  }

  /**
   * @param {string[]} lexems
   * @param {string=} projectId
   * @return {boolean}
   */
  not(lexems, projectId) {
    let notCounter = 0;

    while (lexems.length > 0 && lexems[0] === '!') {
      ++notCounter;
      lexems.shift();
    }

    const result = this.term(lexems, projectId);

    return (notCounter % 2 === 0) ? result : !result;
  }

  /**
   * @param {string[]} lexems
   * @param {string=} projectId
   * @return {boolean}
   */
  term(lexems, projectId) {
    if (lexems.length === 0) {
      throw new Error('Operand was expected');
    }

    const t = lexems.shift();
    let result;

    // Nested parenthesized expression
    if (t === '(') {
      result = this.or(lexems, projectId);
      // Expect ')'
      if (lexems.shift() !== ')') {
        throw new Error('Operator \')\' was expected');
      }
    } else {
      result = this.testPermission(t, projectId);
    }

    return result;
  }

  /**
   * @param {string} permissionName
   * @param {string=} projectId
   * @return {boolean}
   */
  testPermission(permissionName, projectId) {
    const permissionCache = this.permissionCache;
    const cachedPermission = permissionCache[permissionName] ||
      permissionCache[this.namesConverter(permissionName)];

    // Hasn't the permission in any project
    if (!cachedPermission) {
      return false;
    }

    // The permission is global or is given in the global project
    if (cachedPermission.global) {
      return true;
    }

    if (projectId) {
      // if projectId is specified check that the permission is given in the project
      return cachedPermission.projectIdSet && (projectId in cachedPermission.projectIdSet);
    } else {
      return true;
    }
  }
}
