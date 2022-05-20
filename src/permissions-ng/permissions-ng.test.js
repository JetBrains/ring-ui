/* global inject */
import 'angular';
import 'angular-mocks';

import PermissionsNg from './permissions-ng';

describe('Permissions Ng', () => {

  const fakeUserPermissions = {
    check: () => null
  };

  beforeEach(window.module(PermissionsNg, $provide => {
    $provide.value('userPermissions', fakeUserPermissions);
  }));

  describe('rg-permission', () => {
    let q;
    let scope;
    let $compile;
    let renderDirective;
    let element;
    let ctrl;
    beforeEach(inject(($q, $rootScope, _$compile_) => {
      q = $q;
      scope = $rootScope.$new();
      $compile = _$compile_;
      sandbox.stub(fakeUserPermissions, 'check').returns($q.resolve(true));

      renderDirective = (permissionsString = 'hub-test-perm', inProject) => {
        element = $compile(`<div rg-permission="${permissionsString}" in-project="${inProject}"></div>`)(scope);
        ctrl = element.controller('rgPermission');
        scope.$digest();
      };

      renderDirective();
    }));

    it('should init', () => {
      ctrl.should.exist;
    });

    it('Should not hide element if permission is granted', () => {
      element[0].should.not.has.class('ring-permission-hide');
    });

    it('Should hide element if has no permission', () => {
      fakeUserPermissions.check.returns(q.resolve(false));
      renderDirective();

      element[0].should.has.class('ring-permission-hide');
    });

    it('Should pass permission as string to userPermission', () => {
      renderDirective('some-permission');

      fakeUserPermissions.check.should.have.been.calledWith('some-permission');
    });

    it('Should pass complex permission as string to userPermission', () => {
      const complexPermission = 'foo | bar & test';
      renderDirective(complexPermission);

      fakeUserPermissions.check.should.have.been.calledWith(complexPermission);
    });

    it('Should pass permission variable to userPermission', () => {
      scope.permissionValue = 'some-permission';

      renderDirective('{{permissionValue}}');

      fakeUserPermissions.check.should.have.been.calledWith('some-permission');
    });

    it('Should pass project id as scope value to userPermission', () => {
      scope.projectId = 'some-project';
      renderDirective('some-permission', 'projectId');

      fakeUserPermissions.check.should.have.been.calledWith('some-permission', 'some-project');
    });
  });
});
