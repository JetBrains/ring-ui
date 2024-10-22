import Auth from '../auth/auth__core';

import PermissionCache, {Permission} from './permissions__cache';

export interface PermissionsConfig {
  prefix?: string | null | undefined;
  namesConverter?: ((name: string) => string) | null | undefined;
  services?: readonly string[] | null | undefined;
  datasource?: ((query: string | undefined) => Promise<readonly Permission[] | null | undefined>) | null | undefined;
}

interface PermissionsCacheControl {
  NO_CACHE?: boolean | null | undefined;
  NO_STORE?: boolean | null | undefined;
}

export interface PermissionsLoadOptions {
  cacheControl?: PermissionsCacheControl | null | undefined;
}

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

  query: string | undefined;
  namesConverter: ((name: string) => string) | null | undefined;
  private _auth: Auth;
  private _datasource: (query: string | undefined) => Promise<readonly Permission[] | null | undefined>;

  _promise: Promise<PermissionCache> | null;
  private _subscribed: boolean;
  private _permissionCache: PermissionCache;
  constructor(auth: Auth, config: PermissionsConfig = {}) {
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

  private _defaultDatasource = (query: string | undefined) =>
    this._auth.http.get<Permission[]>(Permissions.API_PERMISSION_CACHE_PATH, {
      query: {
        fields: 'permission/key,global,projects(id)',
        query,
      },
    });

  /**
   * Returns function, which cuts off prefix from server-side permission name
   *
   * @param {string} prefix
   * @returns {Function}
   */
  static getDefaultNamesConverter(prefix: string) {
    return (storedName: string) => {
      if (storedName.indexOf(prefix) !== 0) {
        return storedName;
      } else {
        return storedName.substr(prefix.length);
      }
    };
  }

  static getPermissionQuery(services?: readonly string[] | null | undefined) {
    if (!services || !services.length) {
      return undefined;
    }
    return services.map(service => `service:{${service}}`).join(' or ');
  }

  set(cachedPermissions?: readonly Permission[] | null | undefined) {
    this._permissionCache.set(cachedPermissions);
    this._setCache(Promise.resolve(this._permissionCache));
    return this._permissionCache;
  }

  get() {
    return this._permissionCache.get();
  }

  private _setCache(value: Promise<PermissionCache> | null) {
    this._promise = value;
  }

  private _getCache() {
    return this._promise;
  }

  private _resetCache() {
    this._setCache(null);
  }

  /**
   * Loads logged-in user permissions.
   * @param {object?} options
   * @return {Promise.<Permissions>} promise that is resolved when the permissions are loaded
   */
  load(options?: PermissionsLoadOptions | null | undefined): Promise<PermissionCache> {
    if (this._subscribed === false) {
      this._auth.addListener('userChange', () => {
        this.reload();
      });
      this._subscribed = true;
    }

    const cache = this._getCache();
    if (!hasCacheControl('NO_CACHE', options) && cache) {
      return cache;
    }

    if (hasCacheControl('NO_STORE', options)) {
      return this._loadPermissions().then(
        cachedPermissions => new PermissionCache(cachedPermissions, this.namesConverter),
      );
    }

    const permissions = this._loadPermissions().then(cachedPermissions => this.set(cachedPermissions));
    this._setCache(permissions);
    return permissions;

    function hasCacheControl(
      value: keyof PermissionsCacheControl,
      _options: PermissionsLoadOptions | null | undefined,
    ) {
      if (_options && _options.cacheControl) {
        return _options.cacheControl[value];
      }
      return false;
    }
  }

  _loadPermissions() {
    return this._datasource(this.query);
  }

  /**
   * Reloads permission cache from server
   * @returns {Promise.<Permissions>} promise that is resolved when the permissions are reloaded
   */
  reload() {
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
  check(permissions?: string | null | undefined, projectId?: string | null | undefined) {
    return this.load().then(permissionCache => permissionCache.has(permissions, projectId));
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
  bindVariable<K extends string>(
    object: {[key in K]?: boolean},
    propertyName: K,
    permissions?: string | null | undefined,
    projectId?: string | null | undefined,
  ) {
    object[propertyName] = false;

    return this.check(permissions, projectId).then(permitted => {
      object[propertyName] = permitted;
      return permitted;
    });
  }
}
