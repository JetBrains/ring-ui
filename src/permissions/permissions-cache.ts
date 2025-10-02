export interface PermissionType {
  key: string;
}

export interface Project {
  id: string;
}

export interface Permission {
  permission: PermissionType;
  global?: boolean | null | undefined;
  projects?: readonly Project[] | null | undefined;
}

interface PermissionCacheItem {
  global: boolean | null | undefined;
  projectIdSet: Record<string, boolean> | null;
}

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
  private static _toProjectIdSet(projects: readonly Project[] | null | undefined) {
    let projectIdSet: Record<string, boolean> | null = null;

    if (projects) {
      projectIdSet = {};
      for (let i = 0; i < projects.length; i++) {
        projectIdSet[projects[i].id] = true;
      }
    }

    return projectIdSet;
  }

  namesConverter: (name: string) => string | null | undefined;
  constructor(
    permissions?: readonly Permission[] | null | undefined,
    namesConverter?: ((name: string) => string | null | undefined) | null | undefined,
  ) {
    this.namesConverter = namesConverter || (key => key);
    this.set(permissions);
  }

  private _permissions?: readonly Permission[] | null;
  permissionCache?: Record<string, PermissionCacheItem>;
  set(permissions?: readonly Permission[] | null | undefined) {
    const permissionCache = (permissions || []).reduce(
      (_permissionCache: Record<string, PermissionCacheItem>, permission) => {
        const key = this.namesConverter(permission.permission.key);

        if (key) {
          _permissionCache[key] = {
            global: permission.global,
            // eslint-disable-next-line no-underscore-dangle
            projectIdSet: (this.constructor as typeof PermissionCache)._toProjectIdSet(permission.projects),
          };
        }

        return _permissionCache;
      },
      {},
    );

    this._permissions = permissions;
    this.permissionCache = permissionCache;

    return this;
  }

  get() {
    return this._permissions;
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
  has(permissions?: string | null | undefined, projectId?: string | null | undefined) {
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
  lex(query?: string | null | undefined) {
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
  or(lexems: string[], projectId?: string | null | undefined) {
    let result = this.and(lexems, projectId);

    while (lexems.length > 0 && lexems[0] !== ')') {
      if (lexems.shift() !== '|') {
        throw new Error("Operator '|' was expected");
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
  and(lexems: string[], projectId?: string | null | undefined) {
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
  not(lexems: string[], projectId?: string | null | undefined) {
    let notCounter = 0;

    while (lexems.length > 0 && lexems[0] === '!') {
      ++notCounter;
      lexems.shift();
    }

    const result = this.term(lexems, projectId);

    return notCounter % 2 === 0 ? result : !result;
  }

  /**
   * @param {string[]} lexems
   * @param {string=} projectId
   * @return {boolean}
   */
  term(lexems: string[], projectId?: string | null | undefined): boolean {
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
        throw new Error("Operator ')' was expected");
      }
    } else {
      result = t !== undefined && this.testPermission(t, projectId);
    }

    return result;
  }

  /**
   * @param {string} permissionName
   * @param {string=} projectId
   * @return {boolean}
   */
  testPermission(permissionName: string, projectId?: string | null | undefined) {
    const permissionCache = this.permissionCache;
    const convertedName = this.namesConverter(permissionName);
    const cachedPermission = permissionCache?.[permissionName] || (convertedName && permissionCache?.[convertedName]);

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
      return !!cachedPermission.projectIdSet && projectId in cachedPermission.projectIdSet;
    }
    return true;
  }
}
