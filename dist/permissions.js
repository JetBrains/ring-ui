import { d as _defineProperty, c as _createClass, b as _classCallCheck } from './_rollupPluginBabelHelpers-ab14fb00.js';

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
var PermissionCache = /*#__PURE__*/function () {
  _createClass(PermissionCache, null, [{
    key: "_toProjectIdSet",

    /**
     * Convert an array of projects to a set of project ids.
     *
     * @param {object[]=} projects
     * @return {object} a set of project ids
     * @private
     */
    value: function _toProjectIdSet(projects) {
      var projectIdSet = null;

      if (projects) {
        projectIdSet = {};

        for (var i = 0; i < projects.length; i++) {
          projectIdSet[projects[i].id] = true;
        }
      }

      return projectIdSet;
    }
  }]);

  function PermissionCache(permissions, namesConverter) {
    _classCallCheck(this, PermissionCache);

    this.namesConverter = namesConverter || function (key) {
      return key;
    };

    this.set(permissions);
  }

  _createClass(PermissionCache, [{
    key: "set",
    value: function set(permissions) {
      var _this = this;

      var permissionCache = (permissions || []).reduce(function (_permissionCache, permission) {
        var key = _this.namesConverter(permission.permission.key);

        if (key) {
          _permissionCache[key] = {
            global: permission.global,
            projectIdSet: _this.constructor._toProjectIdSet(permission.projects)
          };
        }

        return _permissionCache;
      }, {});
      this._permissions = permissions;
      this.permissionCache = permissionCache;
      return this;
    }
  }, {
    key: "get",
    value: function get() {
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

  }, {
    key: "has",
    value: function has(permissions, projectId) {
      var lexems = this.lex(permissions);

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

  }, {
    key: "lex",
    value: function lex(query) {
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
              } // Skip space


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
              } // Append operator


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

  }, {
    key: "or",
    value: function or(lexems, projectId) {
      var result = this.and(lexems, projectId);

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

  }, {
    key: "and",
    value: function and(lexems, projectId) {
      var result = this.not(lexems, projectId);

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

  }, {
    key: "not",
    value: function not(lexems, projectId) {
      var notCounter = 0;

      while (lexems.length > 0 && lexems[0] === '!') {
        ++notCounter;
        lexems.shift();
      }

      var result = this.term(lexems, projectId);
      return notCounter % 2 === 0 ? result : !result;
    }
    /**
     * @param {string[]} lexems
     * @param {string=} projectId
     * @return {boolean}
     */

  }, {
    key: "term",
    value: function term(lexems, projectId) {
      if (lexems.length === 0) {
        throw new Error('Operand was expected');
      }

      var t = lexems.shift();
      var result; // Nested parenthesized expression

      if (t === '(') {
        result = this.or(lexems, projectId); // Expect ')'

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

  }, {
    key: "testPermission",
    value: function testPermission(permissionName, projectId) {
      var permissionCache = this.permissionCache;
      var cachedPermission = permissionCache[permissionName] || permissionCache[this.namesConverter(permissionName)]; // Hasn't the permission in any project

      if (!cachedPermission) {
        return false;
      } // The permission is global or is given in the global project


      if (cachedPermission.global) {
        return true;
      }

      if (projectId) {
        // if projectId is specified check that the permission is given in the project
        return cachedPermission.projectIdSet && projectId in cachedPermission.projectIdSet;
      } else {
        return true;
      }
    }
  }]);

  return PermissionCache;
}();

_defineProperty(PermissionCache, "GLOBAL_PROJECT_ID", 'global');

/**
 * <code>
 *   const permissions = new Permissions(auth, {prefix: 'jetbrains.jetpass.', services: [auth.serviceId]})
 *   permissions.load().then(function (p) {
 *     const canReadUser = p.has('read-user');
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

var Permissions = /*#__PURE__*/function () {
  /**
   * @const {string}
   */
  function Permissions(auth) {
    var _this = this;

    var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Permissions);

    _defineProperty(this, "_defaultDatasource", function (query) {
      return _this._auth.http.get(Permissions.API_PERMISSION_CACHE_PATH, {
        query: {
          fields: 'permission/key,global,projects(id)',
          query: query
        }
      });
    });

    this.query = Permissions.getPermissionQuery(config.services);
    this.namesConverter = config.prefix ? Permissions.getDefaultNamesConverter(config.prefix) : config.namesConverter;

    if (!auth) {
      throw new Error('Parameter auth is required');
    }

    this._auth = auth;
    this._datasource = config.datasource || this._defaultDatasource;
    this._promise = null;
    this._subscribed = false;
    this._permissionCache = new PermissionCache(null, this.namesConverter);
  }

  _createClass(Permissions, [{
    key: "set",
    value: function set(cachedPermissions) {
      this._permissionCache.set(cachedPermissions);

      this._setCache(Promise.resolve(this._permissionCache));

      return this._permissionCache;
    }
  }, {
    key: "get",
    value: function get() {
      return this._permissionCache.get();
    }
  }, {
    key: "_setCache",
    value: function _setCache(value) {
      this._promise = value;
      return value;
    }
  }, {
    key: "_getCache",
    value: function _getCache() {
      return this._promise;
    }
  }, {
    key: "_resetCache",
    value: function _resetCache() {
      this._setCache(null);
    }
    /**
     * Loads logged-in user permissions.
     * @param {object?} options
     * @return {Promise.<Permissions>} promise that is resolved when the permissions are loaded
     */

  }, {
    key: "load",
    value: function load(options) {
      var _this2 = this;

      if (this._subscribed === false) {
        this._auth.addListener('userChange', function () {
          _this2.reload();
        });

        this._subscribed = true;
      }

      if (!hasCacheControl('NO_CACHE', options) && this._getCache()) {
        return this._getCache();
      }

      if (hasCacheControl('NO_STORE', options)) {
        return this._loadPermissions().then(function (cachedPermissions) {
          return new PermissionCache(cachedPermissions, _this2.namesConverter);
        });
      }

      return this._setCache(this._loadPermissions().then(function (cachedPermissions) {
        return _this2.set(cachedPermissions);
      }));

      function hasCacheControl(value, _options) {
        if (_options && _options.cacheControl) {
          return _options.cacheControl[value];
        }

        return false;
      }
    }
  }, {
    key: "_loadPermissions",
    value: function _loadPermissions() {
      return this._datasource(this.query);
    }
    /**
     * Reloads permission cache from server
     * @returns {Promise.<Permissions>} promise that is resolved when the permissions are reloaded
     */

  }, {
    key: "reload",
    value: function reload() {
      this._resetCache();

      return this.load();
    }
    /**
     * Waits till the permission cache is loaded then checks if the current user has the
     * given permissions in the project with the given id.
     *
     * @param {string} permissions  space separated list of permissions
     * @param {string=} projectId     optional projectId. If absent the method checks
     *  if the given permission is granted in any project.
     *
     * @return {Promise.<boolean>}
     */

  }, {
    key: "check",
    value: function check(permissions, projectId) {
      return this.load().then(function (permissionCache) {
        return permissionCache.has(permissions, projectId);
      });
    }
    /**
     * Binds a property with the name <code>propertyName</code> of the <code>object</code>
     * to a boolean value that is true if user has the permissions and false if she doesn't.
     *
     * @example
     * <code>
     *   userPermissions.bindVariable($scope, 'canReadRole', 'role-read')
     * </code>
     *
     * @param {object} object       an object which property should be bound
     * @param {string} propertyName a name of a property to bind
     * @param {string} permissions  space separated list of permissions
     * @param {string=} projectId     optional projectId. If absent the method checks
     *  if the given permissions are granted in any project.
     *
     * @return {Promise.<boolean>}
     */

  }, {
    key: "bindVariable",
    value: function bindVariable(object, propertyName, permissions, projectId) {
      object[propertyName] = false;
      return this.check(permissions, projectId).then(function (permitted) {
        object[propertyName] = permitted;
        return permitted;
      });
    }
  }], [{
    key: "getDefaultNamesConverter",

    /**
     * Returns function, which cuts off prefix from server-side permission name
     *
     * @param {string} prefix
     * @returns {Function}
     */
    value: function getDefaultNamesConverter(prefix) {
      return function (storedName) {
        if (storedName.indexOf(prefix) !== 0) {
          return storedName;
        } else {
          return storedName.substr(prefix.length);
        }
      };
    }
  }, {
    key: "getPermissionQuery",
    value: function getPermissionQuery(services) {
      if (!services || !services.length) {
        return undefined;
      }

      return services.map(function (service) {
        return "service:{".concat(service, "}");
      }).join(' or ');
    }
  }]);

  return Permissions;
}();

_defineProperty(Permissions, "API_PERMISSION_CACHE_PATH", 'permissions/cache');

export default Permissions;
