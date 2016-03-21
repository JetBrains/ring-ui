/* global inject */

import 'angular';
import 'angular-mocks';

import PermissionsNg from './permissions-ng';

describe('PermissionsNg', function () {

  const fakeUserPermissions = {
    check: () => null
  };

  beforeEach(window.module(PermissionsNg, function ($provide) {
    $provide.value('userPermissions', fakeUserPermissions);
  }));

  describe('rg-permission', function () {
    beforeEach(inject(function ($q, $rootScope, _$compile_) {
      this.$q = $q;
      this.scope = $rootScope.$new();
      this.$compile = _$compile_;
      this.sinon.stub(fakeUserPermissions, 'check').returns($q.resolve(true));

      this.renderDirective = (permissionsString = 'hub-test-perm', inProject) => {
        this.element = this.$compile(`<div rg-permission="${permissionsString}" in-project="${inProject}"></div>`)(this.scope);
        this.ctrl = this.element.controller('rgPermission');
        this.scope.$digest();
      };

      this.renderDirective();
    }));

    it('should init', function () {
      this.ctrl.should.be.defined;
    });

    it('Should not hide element if permission is granted', function () {
      this.element[0].should.not.has.class('ring-permission-hide');
    });

    it('Should hide element if has no permission', function () {
      fakeUserPermissions.check.returns(this.$q.resolve(false));
      this.renderDirective();

      this.element[0].should.has.class('ring-permission-hide');
    });

    it('Should pass permission as string to userPermission', function () {
      this.renderDirective('some-permission');

      fakeUserPermissions.check.should.have.been.calledWith('some-permission');
    });

    it('Should pass complex permission as string to userPermission', function () {
      const complexPermission = 'foo | bar & test';
      this.renderDirective(complexPermission);

      fakeUserPermissions.check.should.have.been.calledWith(complexPermission);
    });

    it('Should pass permission variable to userPermission', function () {
      this.scope.permissionValue = 'some-permission';

      this.renderDirective('{{permissionValue}}');

      fakeUserPermissions.check.should.have.been.calledWith('some-permission');
    });

    it('Should pass project id as scope value to userPermission', function () {
      this.scope.projectId = 'some-project';
      this.renderDirective('some-permission', 'projectId');

      fakeUserPermissions.check.should.have.been.calledWith('some-permission', 'some-project');
    });
  });
});
