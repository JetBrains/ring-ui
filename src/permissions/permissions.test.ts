import Auth from '../auth/auth';
import Permissions from './permissions';
import PermissionCache, {type Project} from './permissions-cache';

describe('Permissions', () => {
  /**
   * @param id
   * @mockReturnValue {{id: *}}
   */
  function createProject(id: string) {
    return {
      id,
    };
  }

  /**
   * @param {string} key
   * @param {Array} projects
   * @param {boolean=} isGlobal
   * @mockReturnValue {{permission: {key: *}, projects: *, global: *}}
   */
  function createPermission(
    key: string,
    projects?: readonly Project[] | null | undefined,
    isGlobal?: boolean | null | undefined,
  ) {
    return {
      permission: {key},
      projects,
      global: isGlobal,
    };
  }

  function createAuthMock() {
    return new Auth({serverUri: 'https://example.com'});
  }

  it('should create permissions', () => {
    const permissions = new Permissions(createAuthMock());

    expect(permissions).to.be.ok;
  });

  it('should load permissions', async () => {
    const auth = createAuthMock();
    const permissionsData = [createPermission('A')];
    vi.spyOn(auth.http, 'get').mockReturnValue(Promise.resolve(permissionsData));
    const permissions = new Permissions(auth);

    await new Promise<void>(resolve => {
      permissions.load().then(permissionsCache => {
        expect(permissionsCache.has('A')).to.be.true;
        resolve();
      });
    });
  });

  it('should allow set permissions manually and do not load from the server', () => {
    const auth = createAuthMock();
    const permissionsData = [createPermission('A')];
    const permissions = new Permissions(auth);

    expect(permissions.set(permissionsData).has('A')).to.be.true;
  });

  it('should allow get permissions data', () => {
    const auth = createAuthMock();
    const permissionsData = [createPermission('A')];
    const permissions = new Permissions(auth);

    permissions.set(permissionsData);

    expect(permissions.get()!).to.equal(permissionsData);
  });

  describe('cacheControl', () => {
    let auth: Auth;
    let permissionsData;
    let permissions: Permissions;
    beforeEach(() => {
      auth = createAuthMock();
      permissionsData = [createPermission('A')];
      vi.spyOn(auth.http, 'get').mockReturnValue(Promise.resolve(permissionsData));
      permissions = new Permissions(auth);
    });

    it('should cache loaded permissions', async () => {
      permissions.load();
      permissions.load();
      permissions.load();
      await new Promise<void>(resolve => {
        permissions.load().then(permissionsCache => {
          expect(permissionsCache.has('A')).to.be.true;
          resolve();
        });
      });

      expect(auth.http.get).toHaveBeenCalledOnce;
    });

    it('should reload permissions', function _() {
      permissions.load();
      permissions.reload();

      expect(auth.http.get).toHaveBeenCalledTimes(2);
    });

    it('should not cache response', function _() {
      permissions.load({
        cacheControl: {NO_STORE: true},
      });
      permissions.load();

      expect(auth.http.get).toHaveBeenCalledTimes(2);
    });

    it('should ignore cache', function _() {
      permissions.load();

      permissions.load({
        cacheControl: {NO_CACHE: true},
      });
      permissions.load();
      permissions.load();

      expect(auth.http.get).toHaveBeenCalledTimes(2);
    });

    it('should ignore cache and do not update cache', function _() {
      permissions.load();

      permissions.load({
        cacheControl: {
          NO_CACHE: true,
          NO_STORE: true,
        },
      });
      permissions.load();

      expect(auth.http.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('construction', () => {
    const auth = createAuthMock();

    it("shouldn't build query if no services ids provided", () => {
      expect(new Permissions(auth).query).to.not.exist;
    });

    it('should build query if one service provided', () => {
      expect(new Permissions(auth, {services: ['0-0-0-0-2']}).query!).to.equal('service:{0-0-0-0-2}');
    });

    it('should build query if several services provided', () => {
      expect(new Permissions(auth, {services: ['0-0-0-0-0', '0-0-0-0-2']}).query!).to.equal(
        'service:{0-0-0-0-0} or service:{0-0-0-0-2}',
      );
    });

    it('should check no namesConverter if no config params', () => {
      expect(new Permissions(auth).namesConverter).to.not.exist;
    });

    it('should create namesConverter for prefix', () => {
      const permissions = new Permissions(auth, {prefix: 'jetbrains.jetpass.'});
      expect(permissions.namesConverter!).to.not.equal(undefined);
      expect(permissions.namesConverter!('jetbrains.jetpass.project-read')).to.equal('project-read');
    });

    it('should require auth', () => {
      // @ts-expect-error testing a wrong usage
      expect(() => new Permissions()).to.throw(Error, 'Parameter auth is required');
    });

    describe('construction with defined namesConverter', () => {
      function converter(input: string) {
        return input.toLowerCase();
      }

      it('should pass permission names converter', () => {
        expect(new Permissions(auth, {namesConverter: converter}).namesConverter!).to.equal(converter);
      });

      it('should use default permission names converter if prefix defined', () => {
        const args = {
          namesConverter: converter,
          prefix: 'jetbrains.jetpass.',
        };
        const permissions = new Permissions(auth, args);
        expect(permissions.namesConverter!).to.not.equal(undefined);
        expect(permissions.namesConverter!('jetbrains.jetpass.project-read')).to.equal('project-read');
      });
    });
  });

  describe('loading', () => {
    it('should reload permissions', () => {
      const auth = createAuthMock();
      const permissions = new Permissions(auth);
      vi.spyOn(permissions, 'load').mockReturnValue(Promise.resolve({} as PermissionCache));
      // eslint-disable-next-line no-underscore-dangle
      permissions._promise = Promise.resolve({} as PermissionCache);

      permissions.reload();

      // eslint-disable-next-line no-underscore-dangle
      expect(permissions._promise).to.not.exist;
      expect(permissions.load).toHaveBeenCalled();
    });
  });

  describe('cache', () => {
    const permissionCache = new PermissionCache(
      [
        createPermission('jetbrains.jetpass.project-read', null, true),
        createPermission('jetbrains.jetpass.project-update', [createProject('123')]),
        createPermission('jetbrains.upsource.permission.project.admin', null, true),
      ],
      Permissions.getDefaultNamesConverter('jetbrains.jetpass.'),
    );

    it('should not permit unlisted permission', () => {
      expect(permissionCache.has('role-update')).to.be.false;
      expect(permissionCache.has('role-update', '123')).to.be.false;
    });

    it('should permit global permission', () => {
      expect(permissionCache.has('project-read')).to.be.true;
      expect(permissionCache.has('project-read', '123')).to.be.true;
      expect(permissionCache.has('project-read', '456')).to.be.true;
    });

    it('should work for projectId "global"', () => {
      expect(permissionCache.has('project-read', PermissionCache.GLOBAL_PROJECT_ID)).to.be.true;
      expect(permissionCache.has('project-update', PermissionCache.GLOBAL_PROJECT_ID)).to.be.false;
    });

    it('should permit if user has permission in project', () => {
      expect(permissionCache.has('project-update')).to.be.true;
      expect(permissionCache.has('project-update', '123')).to.be.true;
    });

    it('should not permit if user has no permission in project', () => {
      expect(permissionCache.has('project-update', '456')).to.be.false;
    });

    it("should match full permission key if it doesn't start with the provided prefix", () => {
      expect(permissionCache.has('jetbrains.upsource.permission.project.admin', '456')).to.be.true;
    });

    it('should permit if user has all permissions', () => {
      expect(permissionCache.has('project-read project-update', '123')).to.be.true;
    });

    it("should not permit if user doesn't have some permissions", () => {
      expect(permissionCache.has('project-read project-update', '456')).to.be.false;
      expect(permissionCache.has('project-read role-update')).to.be.false;
    });

    describe('syntax', () => {
      it('should support disjunction', () => {
        expect(permissionCache.has('a | project-read')).to.be.true;
        expect(permissionCache.has('a | b')).to.be.false;
      });

      it('should support conjunction', () => {
        expect(permissionCache.has('a & project-read')).to.be.false;
        expect(permissionCache.has('project-read & project-update')).to.be.true;
      });

      it('should support negation', () => {
        expect(permissionCache.has('!project-read')).to.be.false;
        expect(permissionCache.has('!a')).to.be.true;
        expect(permissionCache.has('!a & project-read')).to.be.true;
        expect(permissionCache.has('!a & !project-read')).to.be.false;
        expect(permissionCache.has('!a | !project-read')).to.be.true;
      });

      it('should support negation with defined project-id', () => {
        expect(permissionCache.has('!project-read', '123')).to.be.false;
        expect(permissionCache.has('!project-update', '123')).to.be.false;
        expect(permissionCache.has('!project-update', '456')).to.be.true;
      });

      it('should support parens', () => {
        expect(permissionCache.has('(((project-read | a))) & (project-update)')).to.be.true;
      });

      it('should support parens with negations', () => {
        expect(permissionCache.has('!(project-read)')).to.be.false;
        expect(permissionCache.has('!(a)')).to.be.true;
        expect(permissionCache.has('project-read & !(a)')).to.be.true;
        expect(permissionCache.has('!(a | project-read)')).to.be.false;
        expect(permissionCache.has('!(a | !project-read)')).to.be.true;
      });

      it('should support multiple negations', () => {
        expect(permissionCache.has('!!project-read')).to.be.true;
        expect(permissionCache.has('!!(a)')).to.be.false;
        expect(permissionCache.has('!!!a')).to.be.true;
        expect(permissionCache.has('!(!(a | !project-read))')).to.be.false;
        expect(permissionCache.has('!(!(!(a | !project-read)))')).to.be.true;
      });

      it('should be true for blank', () => {
        expect(permissionCache.has(null)).to.be.true;
        expect(permissionCache.has('')).to.be.true;
        expect(permissionCache.has('  \t \n ')).to.be.true;
      });

      it('should fail gracefully', () => {
        expect(permissionCache.has('|')).to.be.false;
        expect(permissionCache.has('a & ')).to.be.false;
        expect(permissionCache.has('(a')).to.be.false;
        expect(permissionCache.has('(')).to.be.false;
        expect(permissionCache.has('!')).to.be.false;
        expect(permissionCache.has('!!')).to.be.false;
      });
    });

    describe('cache with defined permissions converter', () => {
      function namesConverter(key: string) {
        const splitKey = key.split('.');
        return splitKey[splitKey.length - 1].toLowerCase().replace(/_/g, '-');
      }

      const permissionCacheWithConverter = new PermissionCache(
        [
          createPermission('jetbrains.jetpass.project-read', null, true),
          createPermission('JetBrains.YouTrack.UPDATE_NOT_OWN_WORK_ITEM', [createProject('123')]),
          createPermission('jetbrains.upsource.permission.project.admin', null, true),
        ],
        namesConverter,
      );

      it('should not permit nonexistent permission', () => {
        expect(permissionCacheWithConverter.has('work-item-update')).to.be.false;
        expect(permissionCacheWithConverter.has('JetBrains.YouTrack.UPDATE_WORK_ITEM')).to.be.false;
      });

      it('should permit global permission', () => {
        expect(permissionCacheWithConverter.has('project-read')).to.be.true;
        expect(permissionCacheWithConverter.has('project-read', '123')).to.be.true;
        expect(permissionCacheWithConverter.has('project-read', '456')).to.be.true;
      });

      it('should check non-global permission', () => {
        expect(permissionCacheWithConverter.has('update-not-own-work-item')).to.be.true;
        expect(permissionCacheWithConverter.has('update-not-own-work-item', '456')).to.be.false;
        expect(permissionCacheWithConverter.has('update-not-own-work-item', '123')).to.be.true;
      });

      it('should allow use original key for test permission', () => {
        expect(permissionCacheWithConverter.has('jetbrains.jetpass.project-read')).to.be.true;
        expect(permissionCacheWithConverter.has('JetBrains.YouTrack.UPDATE_NOT_OWN_WORK_ITEM')).to.be.true;
      });
    });
  });

  describe('check and bind variable', () => {
    const permissions = new Permissions(createAuthMock());
    const permissionKeysDefaultConverter = Permissions.getDefaultNamesConverter('jetbrains.jetpass.');

    function permissionKeysTestConverter(key: string) {
      if (key === 'not-defined-key') {
        return undefined;
      }
      return permissionKeysDefaultConverter(key);
    }

    const permissionCache = new PermissionCache(
      [
        createPermission('jetbrains.jetpass.project-read', null, true),
        createPermission('jetbrains.jetpass.project-update', [createProject('123')]),
        createPermission('jetbrains.upsource.permission.project.admin', null, true),
        createPermission('not-defined-key', null, true),
      ],
      permissionKeysTestConverter,
    );
    // eslint-disable-next-line no-underscore-dangle
    permissions._promise = Promise.resolve(permissionCache);

    it('should resolve to true for given permission', () =>
      expect(permissions.check('project-read')).to.eventually.be.true);

    it('should resolve to false for absent permission', () =>
      expect(permissions.check('role-read')).to.eventually.be.false);

    it('should bind variable to true for given permission', () => {
      const scope: {canReadProject?: boolean} = {};
      return permissions.bindVariable(scope, 'canReadProject', 'project-read').then(() => {
        expect(scope.canReadProject!).to.be.true;
      });
    });

    it('should bind variable to true for given permission in project', () => {
      const scope: {canUpdateProject?: boolean} = {};
      return permissions.bindVariable(scope, 'canUpdateProject', 'project-update', '123').then(() => {
        expect(scope.canUpdateProject!).to.be.true;
      });
    });

    it('should bind variable to false for absent permission', () => {
      const scope: {canReadRole?: boolean} = {};
      return permissions.bindVariable(scope, 'canReadRole', 'role-read').then(() => {
        expect(scope.canReadRole!).to.be.false;
      });
    });

    it('should bind variable to false for absent permission in project', () => {
      const scope: {canUpdateProject?: boolean} = {};
      return permissions.bindVariable(scope, 'canUpdateProject', 'project-update', '456').then(() => {
        expect(scope.canUpdateProject!).to.be.false;
      });
    });

    it('permission cache should not contain permissions with key undefined', () => {
      const scope: {canUpdateSomething?: boolean} = {};
      return permissions.bindVariable(scope, 'canUpdateSomething', 'undefined').then(() => {
        expect(scope.canUpdateSomething!).to.be.false;
      });
    });
  });
});
