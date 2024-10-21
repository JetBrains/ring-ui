import Auth from '../auth/auth';

import Permissions from './permissions';
import PermissionCache, {Project} from './permissions__cache';

describe('Permissions', () => {
  /**
   * @param id
   * @returns {{id: *}}
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
   * @returns {{permission: {key: *}, projects: *, global: *}}
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
    return new Auth({serverUri: ''});
  }

  it('should create permissions', () => {
    const permissions = new Permissions(createAuthMock());

    permissions.should.be.ok;
  });

  it('should load permissions', async () => {
    const auth = createAuthMock();
    const permissionsData = [createPermission('A')];
    sandbox.stub(auth.http, 'get').returns(Promise.resolve(permissionsData));
    const permissions = new Permissions(auth);

    await new Promise<void>(resolve => {
      permissions.load().then(permissionsCache => {
        permissionsCache.has('A').should.be.true;
        resolve();
      });
    });
  });

  it('should allow set permissions manually and do not load from the server', () => {
    const auth = createAuthMock();
    const permissionsData = [createPermission('A')];
    const permissions = new Permissions(auth);

    permissions.set(permissionsData).has('A').should.be.true;
  });

  it('should allow get permissions data', () => {
    const auth = createAuthMock();
    const permissionsData = [createPermission('A')];
    const permissions = new Permissions(auth);

    permissions.set(permissionsData);

    permissions.get()!.should.equal(permissionsData);
  });

  describe('cacheControl', () => {
    let auth: Auth;
    let permissionsData;
    let permissions: Permissions;
    beforeEach(() => {
      auth = createAuthMock();
      permissionsData = [createPermission('A')];
      sandbox.stub(auth.http, 'get').returns(Promise.resolve(permissionsData));
      permissions = new Permissions(auth);
    });

    it('should cache loaded permissions', async () => {
      permissions.load();
      permissions.load();
      permissions.load();
      await new Promise<void>(resolve => {
        permissions.load().then(permissionsCache => {
          permissionsCache.has('A').should.be.true;
          resolve();
        });
      });

      auth.http.get.should.have.been.calledOnce;
    });

    it('should reload permissions', function _() {
      permissions.load();
      permissions.reload();

      auth.http.get.should.have.been.calledTwice;
    });

    it('should not cache response', function _() {
      permissions.load({
        cacheControl: {NO_STORE: true},
      });
      permissions.load();

      auth.http.get.should.have.been.calledTwice;
    });

    it('should ignore cache', function _() {
      permissions.load();

      permissions.load({
        cacheControl: {NO_CACHE: true},
      });
      permissions.load();
      permissions.load();

      auth.http.get.should.have.been.calledTwice;
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

      auth.http.get.should.have.been.calledTwice;
    });
  });

  describe('construction', () => {
    const auth = createAuthMock();

    it("shouldn't build query if no services ids provided", () => {
      should.not.exist(new Permissions(auth).query);
    });

    it('should build query if one service provided', () => {
      new Permissions(auth, {services: ['0-0-0-0-2']}).query!.should.equal('service:{0-0-0-0-2}');
    });

    it('should build query if several services provided', () => {
      new Permissions(auth, {services: ['0-0-0-0-0', '0-0-0-0-2']}).query!.should.equal(
        'service:{0-0-0-0-0} or service:{0-0-0-0-2}',
      );
    });

    it('should check no namesConverter if no config params', () => {
      should.not.exist(new Permissions(auth).namesConverter);
    });

    it('should create namesConverter for prefix', () => {
      const permissions = new Permissions(auth, {prefix: 'jetbrains.jetpass.'});
      permissions.namesConverter!.should.not.equal(undefined);
      permissions.namesConverter!('jetbrains.jetpass.project-read').should.equal('project-read');
    });

    it('should require auth', () => {
      // @ts-expect-error testing a wrong usage
      () => new Permissions().should.throw(Error, 'Parameter auth is required');
    });

    describe('construction with defined namesConverter', () => {
      function converter(input: string) {
        return input.toLowerCase();
      }

      it('should pass permission names converter', () => {
        new Permissions(auth, {namesConverter: converter}).namesConverter!.should.equal(converter);
      });

      it('should use default permission names converter if prefix defined', () => {
        const args = {
          namesConverter: converter,
          prefix: 'jetbrains.jetpass.',
        };
        const permissions = new Permissions(auth, args);
        permissions.namesConverter!.should.not.equal(undefined);
        permissions.namesConverter!('jetbrains.jetpass.project-read').should.equal('project-read');
      });
    });
  });

  describe('loading', () => {
    it('should reload permissions', () => {
      const auth = createAuthMock();
      const permissions = new Permissions(auth);
      sandbox.stub(permissions, 'load').returns(Promise.resolve({} as PermissionCache));
      permissions._promise = Promise.resolve({} as PermissionCache);

      permissions.reload();

      should.not.exist(permissions._promise);
      permissions.load.should.have.been.called;
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
      permissionCache.has('role-update').should.be.false;
      permissionCache.has('role-update', '123').should.be.false;
    });

    it('should permit global permission', () => {
      permissionCache.has('project-read').should.be.true;
      permissionCache.has('project-read', '123').should.be.true;
      permissionCache.has('project-read', '456').should.be.true;
    });

    it('should work for projectId "global"', () => {
      permissionCache.has('project-read', PermissionCache.GLOBAL_PROJECT_ID).should.be.true;
      permissionCache.has('project-update', PermissionCache.GLOBAL_PROJECT_ID).should.be.false;
    });

    it('should permit if user has permission in project', () => {
      permissionCache.has('project-update').should.be.true;
      permissionCache.has('project-update', '123').should.be.true;
    });

    it('should not permit if user has no permission in project', () => {
      permissionCache.has('project-update', '456').should.be.false;
    });

    it("should match full permission key if it doesn't start with the provided prefix", () => {
      permissionCache.has('jetbrains.upsource.permission.project.admin', '456').should.be.true;
    });

    it('should permit if user has all permissions', () => {
      permissionCache.has('project-read project-update', '123').should.be.true;
    });

    it("should not permit if user doesn't have some permissions", () => {
      permissionCache.has('project-read project-update', '456').should.be.false;
      permissionCache.has('project-read role-update').should.be.false;
    });

    describe('syntax', () => {
      it('should support disjunction', () => {
        permissionCache.has('a | project-read').should.be.true;
        permissionCache.has('a | b').should.be.false;
      });

      it('should support conjunction', () => {
        permissionCache.has('a & project-read').should.be.false;
        permissionCache.has('project-read & project-update').should.be.true;
      });

      it('should support negation', () => {
        permissionCache.has('!project-read').should.be.false;
        permissionCache.has('!a').should.be.true;
        permissionCache.has('!a & project-read').should.be.true;
        permissionCache.has('!a & !project-read').should.be.false;
        permissionCache.has('!a | !project-read').should.be.true;
      });

      it('should support negation with defined project-id', () => {
        permissionCache.has('!project-read', '123').should.be.false;
        permissionCache.has('!project-update', '123').should.be.false;
        permissionCache.has('!project-update', '456').should.be.true;
      });

      it('should support parens', () => {
        permissionCache.has('(((project-read | a))) & (project-update)').should.be.true;
      });

      it('should support parens with negations', () => {
        permissionCache.has('!(project-read)').should.be.false;
        permissionCache.has('!(a)').should.be.true;
        permissionCache.has('project-read & !(a)').should.be.true;
        permissionCache.has('!(a | project-read)').should.be.false;
        permissionCache.has('!(a | !project-read)').should.be.true;
      });

      it('should support multiple negations', () => {
        permissionCache.has('!!project-read').should.be.true;
        permissionCache.has('!!(a)').should.be.false;
        permissionCache.has('!!!a').should.be.true;
        permissionCache.has('!(!(a | !project-read))').should.be.false;
        permissionCache.has('!(!(!(a | !project-read)))').should.be.true;
      });

      it('should be true for blank', () => {
        permissionCache.has(null).should.be.true;
        permissionCache.has('').should.be.true;
        permissionCache.has('  \t \n ').should.be.true;
      });

      it('should fail gracefully', () => {
        permissionCache.has('|').should.be.false;
        permissionCache.has('a & ').should.be.false;
        permissionCache.has('(a').should.be.false;
        permissionCache.has('(').should.be.false;
        permissionCache.has('!').should.be.false;
        permissionCache.has('!!').should.be.false;
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
        permissionCacheWithConverter.has('work-item-update').should.be.false;
        permissionCacheWithConverter.has('JetBrains.YouTrack.UPDATE_WORK_ITEM').should.be.false;
      });

      it('should permit global permission', () => {
        permissionCacheWithConverter.has('project-read').should.be.true;
        permissionCacheWithConverter.has('project-read', '123').should.be.true;
        permissionCacheWithConverter.has('project-read', '456').should.be.true;
      });

      it('should check non-global permission', () => {
        permissionCacheWithConverter.has('update-not-own-work-item').should.be.true;
        permissionCacheWithConverter.has('update-not-own-work-item', '456').should.be.false;
        permissionCacheWithConverter.has('update-not-own-work-item', '123').should.be.true;
      });

      it('should allow use original key for test permission', () => {
        permissionCacheWithConverter.has('jetbrains.jetpass.project-read').should.be.true;
        permissionCacheWithConverter.has('JetBrains.YouTrack.UPDATE_NOT_OWN_WORK_ITEM').should.be.true;
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
    permissions._promise = Promise.resolve(permissionCache);

    it('should resolve to true for given permission', () =>
      permissions.check('project-read').should.eventually.be.true);

    it('should resolve to false for absent permission', () =>
      permissions.check('role-read').should.eventually.be.false);

    it('should bind variable to true for given permission', () => {
      const scope: {canReadProject?: boolean} = {};
      return permissions.bindVariable(scope, 'canReadProject', 'project-read').then(() => {
        scope.canReadProject!.should.be.true;
      });
    });

    it('should bind variable to true for given permission in project', () => {
      const scope: {canUpdateProject?: boolean} = {};
      return permissions.bindVariable(scope, 'canUpdateProject', 'project-update', '123').then(() => {
        scope.canUpdateProject!.should.be.true;
      });
    });

    it('should bind variable to false for absent permission', () => {
      const scope: {canReadRole?: boolean} = {};
      return permissions.bindVariable(scope, 'canReadRole', 'role-read').then(() => {
        scope.canReadRole!.should.be.false;
      });
    });

    it('should bind variable to false for absent permission in project', () => {
      const scope: {canUpdateProject?: boolean} = {};
      return permissions.bindVariable(scope, 'canUpdateProject', 'project-update', '456').then(() => {
        scope.canUpdateProject!.should.be.false;
      });
    });

    it('permission cache should not contain permissions with key undefined', () => {
      const scope: {canUpdateSomething?: boolean} = {};
      return permissions.bindVariable(scope, 'canUpdateSomething', 'undefined').then(() => {
        scope.canUpdateSomething!.should.be.false;
      });
    });
  });
});
