import Auth from '../auth/auth';
import Permissions from './permissions';
import PermissionCache from './permissions__cache';

describe('Permissions', function () {
  /**
   * @param id
   * @returns {{id: *}}
   */
  function createProject(id) {
    return {
      id: id
    };
  }

  /**
   * @param {string} key
   * @param {Array} projects
   * @param {boolean=} isGlobal
   * @returns {{permission: {key: *}, projects: *, global: *}}
   */
  function createPermission(key, projects, isGlobal) {
    return {
      permission: {key: key}, projects: projects, global: isGlobal
    };
  }

  describe('construction', function () {
    const auth = new Auth({serverUri: ''});

    it('shouldn\'t build query if no projectId provided', function () {
      expect(new Permissions(auth).query).to.equal(undefined);
    });

    it('should build query if projectId provided', function () {
      expect(new Permissions(auth, {serviceId: '123'}).query).to.equal('service: {123}');
    });

    it('should check no namesConverter if no config params', function () {
      expect(new Permissions(auth).namesConverter).to.equal(undefined);
    });

    it('should create namesConverter for prefix', function () {
      const permissions = new Permissions(auth, {prefix: 'jetbrains.jetpass.'});
      expect(permissions.namesConverter).not.to.equal(undefined);
      expect(permissions.namesConverter('jetbrains.jetpass.project-read')).to.equal('project-read');
    });

    it('should require auth', function () {
      expect(function () {
        return new Permissions();
      }).to.throw(Error, 'Parameter auth is required');
    });

    describe('construction with defined namesConverter', function () {
      function converter(input) {
        return input.toLowerCase();
      }

      it('should pass permission names converter', function () {
        expect(new Permissions(auth, {namesConverter: converter}).namesConverter).to.equal(converter);
      });

      it('should use default permission names converter if prefix defined', function () {
        const args = {
          namesConverter: converter,
          prefix: 'jetbrains.jetpass.'
        };
        const permissions = new Permissions(auth, args);
        expect(permissions.namesConverter).not.to.equal(undefined);
        expect(permissions.namesConverter('jetbrains.jetpass.project-read')).to.equal('project-read');
      });
    });
  });

  describe('cache', function () {
    const permissionCache = new PermissionCache([
      createPermission('jetbrains.jetpass.project-read', null, true),
      createPermission('jetbrains.jetpass.project-update', [
        createProject('123')
      ]),
      createPermission('jetbrains.upsource.permission.project.admin', null, true)
    ], Permissions.getDefaultNamesConverter('jetbrains.jetpass.'));

    it('should not permit unlisted permission', function () {
      permissionCache.has('role-update').should.be.false;
      permissionCache.has('role-update', '123').should.be.false;
    });

    it('should permit global permission', function () {
      permissionCache.has('project-read').should.be.true;
      permissionCache.has('project-read', '123').should.be.true;
      permissionCache.has('project-read', '456').should.be.true;
    });

    it('should work for projectId "global"', function () {
      permissionCache.has('project-read', PermissionCache.GLOBAL_PROJECT_ID).should.be.true;
      permissionCache.has('project-update', PermissionCache.GLOBAL_PROJECT_ID).should.be.false;
    });

    it('should permit if user has permission in project', function () {
      permissionCache.has('project-update').should.be.true;
      permissionCache.has('project-update', '123').should.be.true;
    });

    it('should not permit if user has no permission in project', function () {
      permissionCache.has('project-update', '456').should.be.false;
    });

    it('should match full permission key if it doesn\'t start with the provided prefix', function () {
      permissionCache.has('jetbrains.upsource.permission.project.admin', '456').should.be.true;
    });

    it('should permit if user has all permissions', function () {
      permissionCache.has('project-read project-update', '123').should.be.true;
    });

    it('should not permit if user doesn\'t have some permissions', function () {
      permissionCache.has('project-read project-update', '456').should.be.false;
      permissionCache.has('project-read role-update').should.be.false;
    });

    describe('syntax', function () {
      it('should support disjunction', function () {
        permissionCache.has('a | project-read').should.be.true;
        permissionCache.has('a | b').should.be.false;
      });

      it('should support conjunction', function () {
        permissionCache.has('a & project-read').should.be.false;
        permissionCache.has('project-read & project-update').should.be.true;
      });

      it('should support negation', function () {
        permissionCache.has('!project-read').should.be.false;
        permissionCache.has('!a').should.be.true;
        permissionCache.has('!a & project-read').should.be.true;
        permissionCache.has('!a & !project-read').should.be.false;
        permissionCache.has('!a | !project-read').should.be.true;
      });

      it('should support negation with defined project-id', function () {
        permissionCache.has('!project-read', '123').should.be.false;
        permissionCache.has('!project-update', '123').should.be.false;
        permissionCache.has('!project-update', '456').should.be.true;
      });

      it('should support parens', function () {
        permissionCache.has('(((project-read | a))) & (project-update)').should.be.true;
      });

      it('should support parens with negations', function () {
        permissionCache.has('!(project-read)').should.be.false;
        permissionCache.has('!(a)').should.be.true;
        permissionCache.has('project-read & !(a)').should.be.true;
        permissionCache.has('!(a | project-read)').should.be.false;
        permissionCache.has('!(a | !project-read)').should.be.true;
      });

      it('should support multiple negations', function () {
        permissionCache.has('!!project-read').should.be.true;
        permissionCache.has('!!(a)').should.be.false;
        permissionCache.has('!!!a').should.be.true;
        permissionCache.has('!(!(a | !project-read))').should.be.false;
        permissionCache.has('!(!(!(a | !project-read)))').should.be.true;
      });

      it('should be true for blank', function () {
        permissionCache.has(null).should.be.true;
        permissionCache.has('').should.be.true;
        permissionCache.has('  \t \n ').should.be.true;
      });

      it('should fail gracefully', function () {
        permissionCache.has('|').should.be.false;
        permissionCache.has('a & ').should.be.false;
        permissionCache.has('(a').should.be.false;
        permissionCache.has('(').should.be.false;
        permissionCache.has('!').should.be.false;
        permissionCache.has('!!').should.be.false;
      });
    });

    describe('cache with defined permissions converter', function () {
      function namesConverter(key) {
        const splittedKey = key.split('.');
        return splittedKey[splittedKey.length - 1].toLowerCase().replace(/\_/g, '-');
      }

      const permissionCacheWithConverter = new PermissionCache([
        createPermission('jetbrains.jetpass.project-read', null, true),
        createPermission('JetBrains.YouTrack.UPDATE_NOT_OWN_WORK_ITEM', [
          createProject('123')
        ]),
        createPermission('jetbrains.upsource.permission.project.admin', null, true)
      ], namesConverter);

      it('should not permit unexisting permission', function () {
        permissionCacheWithConverter.has('work-item-update').should.be.false;
        permissionCacheWithConverter.has('JetBrains.YouTrack.UPDATE_WORK_ITEM').should.be.false;
      });

      it('should permit global permission', function () {
        permissionCacheWithConverter.has('project-read').should.be.true;
        permissionCacheWithConverter.has('project-read', '123').should.be.true;
        permissionCacheWithConverter.has('project-read', '456').should.be.true;
      });

      it('should check non-global permission', function () {
        permissionCacheWithConverter.has('update-not-own-work-item').should.be.true;
        permissionCacheWithConverter.has('update-not-own-work-item', '456').should.be.false;
        permissionCacheWithConverter.has('update-not-own-work-item', '123').should.be.true;
      });

      it('should allow use original key for test permission', function () {
        permissionCacheWithConverter.has('jetbrains.jetpass.project-read').should.be.true;
        permissionCacheWithConverter.has('JetBrains.YouTrack.UPDATE_NOT_OWN_WORK_ITEM').should.be.true;
      });
    });
  });

  describe('check and bind variable', function () {
    const permissions = new Permissions(new Auth({serverUri: ''}));
    const permissionKeysDefaultConverter = Permissions.getDefaultNamesConverter('jetbrains.jetpass.');

    function permissionKeysTestConverter(key) {
      if (key === 'not-defined-key') {
        return undefined;
      }
      return permissionKeysDefaultConverter(key);
    }

    const permissionCache = new PermissionCache([
      createPermission('jetbrains.jetpass.project-read', null, true),
      createPermission('jetbrains.jetpass.project-update', [
        createProject('123')
      ]),
      createPermission('jetbrains.upsource.permission.project.admin', null, true),
      createPermission('not-defined-key', null, true)
    ], permissionKeysTestConverter);
    permissions._promise = Promise.resolve(permissionCache);

    it('should resolve to true for given permission', function () {
      return permissions.check('project-read').should.eventually.be.true;
    });

    it('should resolve to false for absent permission', function () {
      return permissions.check('role-read').should.eventually.be.false;
    });

    it('should bind variable to true for given permission', function () {
      const scope = {};
      return permissions.bindVariable(scope, 'canReadProject', 'project-read').
        then(function () {
          scope.canReadProject.should.be.true;
        });
    });

    it('should bind variable to true for given permission in project', function () {
      const scope = {};
      return permissions.bindVariable(scope, 'canUpdateProject', 'project-update', '123').
        then(function () {
          scope.canUpdateProject.should.be.true;
        });
    });

    it('should bind variable to false for absent permission', function () {
      const scope = {};
      return permissions.bindVariable(scope, 'canReadRole', 'role-read').
        then(function () {
          scope.canReadRole.should.be.false;
        });
    });

    it('should bind variable to false for absent permission in project', function () {
      const scope = {};
      return permissions.bindVariable(scope, 'canUpdateProject', 'project-update', '456').
        then(function () {
          scope.canUpdateProject.should.be.false;
        });
    });

    it('permission cache should not contain permissions with key undefined', function () {
      const scope = {};
      return permissions.bindVariable(scope, 'canUpdateSomething', 'undefined').
        then(function () {
          scope.canUpdateSomething.should.be.false;
        });
    });
  });
});
