import PermissionCache from './permissions__cache';

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
export default class Permissions {
  /**
   * @const {string}
   */
  static API_PERMISSION_CACHE_PATH = 'permissions/cache';

  constructor(auth, config = {}) {
    this.query = Permissions.getPermissionQuery(config.services);
    this.namesConverter = config.prefix ? Permissions.getDefaultNamesConverter(config.prefix) : config.namesConverter;

    if (!auth) {
      throw new Error('Parameter auth is required');
    }

    this._auth = auth;
    this._http = auth.http;
    this._promise = null;
    this._subscribed = false;
  }

  /**
   * Returns function, which cuts off prefix from server-side permission name
   *
   * @param {string} prefix
   * @returns {Function}
   */
  static getDefaultNamesConverter(prefix) {
    return storedName => {
      if (storedName.indexOf(prefix) !== 0) {
        return storedName;
      } else {
        return storedName.substr(prefix.length);
      }
    };
  }

  static getPermissionQuery(services) {
    if (!services || !services.length) {
      return undefined;
    }
    return services.map(service => `service:{${service}}`).join(' or ');
  }

  /**
   * Loads logged-in user permissions.
   * @return {Promise.<Permissions>} promise that is resolved when the permissions are loaded
   */
  load() {
    if (this._subscribed === false) {
      this._auth.addListener('userChange', () => {
        this.reload();
      });
      this._subscribed = true;
    }

    if (this._promise) {
      return this._promise;
    }

    const params = {
      query: {
        fields: 'permission/key,global,projects(id)',
        query: this.query
      }
    };

    this._promise = this._http.get(Permissions.API_PERMISSION_CACHE_PATH, params).
      then(cachedPermissions => new PermissionCache(cachedPermissions, this.namesConverter));

    return this._promise;
  }

  /**
   * Reloads permission cache from server
   * @returns {Promise.<Permissions>} promise that is resolved when the permissions are reloaded
   */
  reload() {
    this._promise = null;
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
  check(permissions, projectId) {
    return this.load().then(permissionCache => permissionCache.has(permissions, projectId));
  }

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
   * @param {string=} projectId     optional projectId. If absent the method checks
   *  if the given permissions are granted in any project.
   *
   * @return {Promise.<boolean>}
   */
  bindVariable(object, propertyName, permissions, projectId) {
    object[propertyName] = false;

    return this.check(permissions, projectId).
      then(permitted => {
        object[propertyName] = permitted;
        return permitted;
      });
  }
}
