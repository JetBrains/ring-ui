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
      expect(permissionCache.has('role-update')).to.equal(false);
      expect(permissionCache.has('role-update', '123')).to.equal(false);
    });

    it('should permit global permission', function () {
      expect(permissionCache.has('space-read')).to.equal(true);
      expect(permissionCache.has('space-read', '123')).to.equal(true);
      expect(permissionCache.has('space-read', '456')).to.equal(true);
    });

    it('should permit if user has permission in space', function () {
      expect(permissionCache.has('space-update')).to.equal(true);
      expect(permissionCache.has('space-update', '123')).to.equal(true);
    });

    it('should not permit if user has no permission in space', function () {
      expect(permissionCache.has('space-update', '456')).to.equal(false);
    });

    it('should match full permission key if it doesn\'t start with the provided prefix', function () {
      expect(permissionCache.has('jetbrains.upsource.permission.project.admin', '456')).to.equal(true);
    });

    it('should permit if user has all permissions', function () {
      expect(permissionCache.has('space-read space-update', '123')).to.equal(true);
    });

    it('should not permit if user doesn\'t have some permissions', function () {
      expect(permissionCache.has('space-read space-update', '456')).to.equal(false);
      expect(permissionCache.has('space-read role-update')).to.equal(false);
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
      q(permissions.check('space-read')).should.eventually.equal(true);
    });

    it('should resolve to false for absent permission', function () {
      q(permissions.check('role-read')).should.eventually.equal(false);
    });
  });
});