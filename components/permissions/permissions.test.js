describe('Permissions', function () {
  var Auth = require('../auth/auth');
  var Permissions = require('./permissions');
  var PermissionCache = require('./permissions__cache');


  describe('construction', function () {
    var auth = new Auth({serverUri: ''});

    it('shouldn\'t build query if no spaceId provided', function () {
      expect(new Permissions(auth).query).to.equal(undefined);
    });

    it('should build query if spaceId provided', function () {
      expect(new Permissions(auth, {serviceId: '123'}).query).to.equal('service: {123}');
    });

    it('should check no namesConverter if no config params', function () {
      expect(new Permissions(auth).namesConverter).to.equal(undefined);
    });

    it('should create namesConverter for prefix', function () {
      var permissions = new Permissions(auth, {prefix: 'jetbrains.jetpass.'});
      expect(permissions.namesConverter).not.to.equal(undefined);
      expect(permissions.namesConverter('jetbrains.jetpass.project-read')).to.equal('project-read');
    });

    it('should require auth', function () {
      expect(function () {
        return new Permissions();
      }).to.throw(Error, 'Parameter auth is required');
    });

    describe('construction with defined namesConverter', function() {
      var converter = function(input) {
        return input.toLowerCase();
      };

      it('should pass permission names converter', function () {
        expect(new Permissions(auth, {namesConverter: converter}).namesConverter).to.equal(converter);
      });

      it('should use default permission names converter if prefix defined', function () {
        var args = {
          namesConverter: converter,
          prefix: 'jetbrains.jetpass.'
        };
        var permissions = new Permissions(auth, args);
        expect(permissions.namesConverter).not.to.equal(undefined);
        expect(permissions.namesConverter('jetbrains.jetpass.project-read')).to.equal('project-read');
      });
    });
  });

  describe('cache', function () {
    var permissionCache = new PermissionCache([
      {permission: {key: 'jetbrains.jetpass.space-read'}, global: true},
      {permission: {key: 'jetbrains.jetpass.space-update'}, spaces: [
        {id: '123'}
      ]},
      {permission: {key: 'jetbrains.upsource.permission.project.admin'}, global: true}
    ], Permissions.getDefaultNamesConverter('jetbrains.jetpass.'));

    it('should not permit unlisted permission', function () {
      permissionCache.has('role-update').should.be.false;
      permissionCache.has('role-update', '123').should.be.false;
    });

    it('should permit global permission', function () {
      permissionCache.has('space-read').should.be.true;
      permissionCache.has('space-read', '123').should.be.true;
      permissionCache.has('space-read', '456').should.be.true;
    });

    it('should permit if user has permission in space', function () {
      permissionCache.has('space-update').should.be.true;
      permissionCache.has('space-update', '123').should.be.true;
    });

    it('should not permit if user has no permission in space', function () {
      permissionCache.has('space-update', '456').should.be.false;
    });

    it('should match full permission key if it doesn\'t start with the provided prefix', function () {
      permissionCache.has('jetbrains.upsource.permission.project.admin', '456').should.be.true;
    });

    it('should permit if user has all permissions', function () {
      permissionCache.has('space-read space-update', '123').should.be.true;
    });

    it('should not permit if user doesn\'t have some permissions', function () {
      permissionCache.has('space-read space-update', '456').should.be.false;
      permissionCache.has('space-read role-update').should.be.false;
    });

    describe('syntax', function () {
      it('should support disjunction', function () {
        permissionCache.has('a | space-read').should.be.true;
        permissionCache.has('a | b').should.be.false;
      });

      it('should support conjunction', function () {
        permissionCache.has('a & space-read').should.be.false;
        permissionCache.has('space-read & space-update').should.be.true;
      });

      it('should support negation', function () {
        permissionCache.has('!space-read').should.be.false;
        permissionCache.has('!a').should.be.true;
        permissionCache.has('!a & space-read').should.be.true;
        permissionCache.has('!a & !space-read').should.be.false;
        permissionCache.has('!a | !space-read').should.be.true;
      });

      it('should support negation with defined space-id', function() {
        permissionCache.has('!space-read', '123').should.be.false;
        permissionCache.has('!space-update', '123').should.be.false;
        permissionCache.has('!space-update', '456').should.be.true;
      });

      it('should support parens', function () {
        permissionCache.has('(((space-read | a))) & (space-update)').should.be.true;
      });

      it('should support parens with negations', function () {
        permissionCache.has('!(space-read)').should.be.false;
        permissionCache.has('!(a)').should.be.true;
        permissionCache.has('space-read & !(a)').should.be.true;
        permissionCache.has('!(a | space-read)').should.be.false;
        permissionCache.has('!(a | !space-read)').should.be.true;
      });

      it('should support multiple negations', function () {
        permissionCache.has('!!space-read').should.be.true;
        permissionCache.has('!!(a)').should.be.false;
        permissionCache.has('!!!a').should.be.true;
        permissionCache.has('!(!(a | !space-read))').should.be.false;
        permissionCache.has('!(!(!(a | !space-read)))').should.be.true;
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

    describe('cache with defined permissions converter', function() {
      var namesConverter = function (key) {
        var splittedKey = key.split('.');
        return splittedKey[splittedKey.length - 1].toLowerCase().replace(/\_/g, '-');
      };
      var permissionCacheWithConverter = new PermissionCache([
        {permission: {key: 'jetbrains.jetpass.project-read'}, global: true},
        {permission: {key: 'JetBrains.YouTrack.UPDATE_NOT_OWN_WORK_ITEM'}, spaces: [
          {id: '123'}
        ]},
        {permission: {key: 'jetbrains.upsource.permission.project.admin'}, global: true}
      ], namesConverter);

      it('should not permit permission via serve name', function () {
        permissionCacheWithConverter.has('jetbrains.jetpass.project-read').should.be.false;
        permissionCacheWithConverter.has('JetBrains.YouTrack.UPDATE_NOT_OWN_WORK_ITEM').should.be.false;
      });

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
    });
  });

  describe('check and bind variable', function () {
    var when = require('when');

    var permissions = new Permissions(new Auth({serverUri: ''}));
    var permissionCache = new PermissionCache([
      {permission: {key: 'jetbrains.jetpass.space-read'}, global: true},
      {permission: {key: 'jetbrains.jetpass.space-update'}, spaces: [
        {id: '123'}
      ]},
      {permission: {key: 'jetbrains.upsource.permission.project.admin'}, global: true}
    ], Permissions.getDefaultNamesConverter('jetbrains.jetpass.'));
    permissions._promise = when.resolve(permissionCache);

    it('should resolve to true for given permission', function () {
      return permissions.check('space-read').should.eventually.be.true;
    });

    it('should resolve to false for absent permission', function () {
      return permissions.check('role-read').should.eventually.be.false;
    });

    it('should bind variable to true for given permission', function () {
      var scope = {};
      return permissions.bindVariable(scope, 'canReadSpace', 'space-read').
        then(function () {
          scope.canReadSpace.should.be.true;
        });
    });

    it('should bind variable to true for given permission in space', function () {
      var scope = {};
      return permissions.bindVariable(scope, 'canUpdateSpace', 'space-update', '123').
        then(function () {
          scope.canUpdateSpace.should.be.true;
        });
    });

    it('should bind variable to false for absent permission', function () {
      var scope = {};
      return permissions.bindVariable(scope, 'canReadRole', 'role-read').
        then(function () {
          scope.canReadRole.should.be.false;
        });
    });

    it('should bind variable to false for absent permission in space', function () {
      var scope = {};
      return permissions.bindVariable(scope, 'canUpdateSpace', 'space-update', '456').
        then(function () {
          scope.canUpdateSpace.should.be.false;
        });
    });
  });
});
