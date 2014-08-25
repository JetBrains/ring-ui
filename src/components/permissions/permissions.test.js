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
  });

  describe('check', function () {
    var $ = require('jquery');
    var q = require('q');

    var permissions = new Permissions(new Auth({serverUri: ''}));
    var permissionCache = new PermissionCache([
      {permission: {key: 'jetbrains.jetpass.space-read'}, global: true},
      {permission: {key: 'jetbrains.jetpass.space-update'}, spaces: [
        {id: '123'}
      ]},
      {permission: {key: 'jetbrains.upsource.permission.project.admin'}, global: true}
    ], 'jetbrains.jetpass.');
    var deferred = $.Deferred();
    permissions._promise = deferred.promise();
    deferred.resolve(permissionCache);

    it('should resolve to true for given permission', function () {
      q(permissions.check('space-read')).should.eventually.be.true;
    });

    it('should resolve to false for absent permission', function () {
      q(permissions.check('role-read')).should.eventually.be.false;
    });
  });
});