describe('permissions', function () {
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

    it('should pass permission key prefix', function () {
      expect(new Permissions(auth, {prefix: 'jetbrains.jetpass.'}).prefix).to.equal('jetbrains.jetpass.');
    });

    it('should require auth', function () {
      expect(function () {
        return new Permissions();
      }).to.throw(Error, 'Parameter auth is required');
    });

  });

  describe('cache', function () {
    var permissionCache = new PermissionCache([
      {permission: {key: 'jetbrains.jetpass.space-read'}, global: true},
      {permission: {key: 'jetbrains.jetpass.space-update'}, spaces: [
        {id: '123'}
      ]},
      {permission: {key: 'jetbrains.upsource.permission.project.admin'}, global: true}
    ], 'jetbrains.jetpass.');

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

      it('should support parens', function () {
        permissionCache.has('(((space-read | a))) & (space-update)').should.be.true;
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
    ], 'jetbrains.jetpass.');
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