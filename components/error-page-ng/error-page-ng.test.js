/* eslint-disable angular/deferred */

import 'dom4';
import 'angular';
import 'angular-mocks';
import 'angular-route';

import AuthProviderMock from '../auth-ng/auth-ng.mock';

import ErrorPage from './error-page-ng';

const fakeUserPermissions = {
  load: () => Promise.resolve({has: () => false})
};

const MESSAGE_SELECTOR = '[data-test~=ring-error-message]';
const TITLE_SELECTOR = '[data-test~=ring-error-message-title]';

describe('Error Page Ng', () => {
  beforeEach(
    window.module('Ring.error-page',
      $provide => {
        $provide.provider('auth', AuthProviderMock);
        $provide.value('userPermissions', fakeUserPermissions);
      })
  );

  /* global inject */
  it('should define module', inject(() => {
    window.angular.module(ErrorPage).should.exist;
  }));

  it('should define factory errorPageConfiguration', inject(errorPageConfiguration => {
    errorPageConfiguration.should.exist;
  }));

  it('should compile directive to content if no errors', inject(($rootScope, $compile) => {
    let elem = window.angular.element('<div rg-error-page><div class="content">Hello!</div></div>');
    elem = $compile(elem)($rootScope);
    $rootScope.$digest();

    elem[0].query('.content').should.have.text('Hello!');
    elem[0].should.not.contain(MESSAGE_SELECTOR);
  }));

  it('should compile directive to default error if has empty error',
    inject(($rootScope, $compile, RingMessageBundle) => {
      let elem = window.angular.
        element(`
<div rg-error-page="{error: {}}"><div class="content">Hello!</div></div>
      `);
      elem = $compile(elem)($rootScope);
      $rootScope.$digest();

      elem[0].should.contain(MESSAGE_SELECTOR);
      elem[0].query(TITLE_SELECTOR).should.
        contain.text(RingMessageBundle.errorpage_seriouslywrong());
    })
  );

  it('should show error message for 404',
    inject(($rootScope, $compile, RingMessageBundle) => {
      let elem = window.angular.element(`
<div rg-error-page="{error: {status: 404}}"><div class="content">Hello!</div></div>
      `);
      elem = $compile(elem)($rootScope);
      $rootScope.$digest();

      elem[0].should.contain(MESSAGE_SELECTOR);
      elem[0].query(TITLE_SELECTOR).should.contain.text(`404: ${RingMessageBundle.errorpage_404()}`);
    })
  );

  it('should not show error message for resolved promise',
    inject(($rootScope, $compile, $q) => {
      $rootScope.errorSource = $q.defer();

      let elem = window.angular.element(`
<div rg-error-page="errorSource"><div class="content">Hello!</div></div>
      `);
      elem = $compile(elem)($rootScope);
      $rootScope.errorSource.resolve();
      $rootScope.$digest();

      elem[0].query('.content').should.contain.text('Hello!');
      elem[0].should.not.contain(MESSAGE_SELECTOR);
    })
  );

  it('should show error message for empty rejected promise',
    inject(($rootScope, $compile, RingMessageBundle, $q) => {
      $rootScope.errorSource = $q.defer();
      let elem = window.angular.element(`
<div rg-error-page="errorSource"><div class="content">Hello!</div></div>
      `);
      elem = $compile(elem)($rootScope);
      $rootScope.errorSource.reject();
      $rootScope.$digest();

      elem[0].should.contain(MESSAGE_SELECTOR);
      elem[0].query(TITLE_SELECTOR).should.
        contain.text(RingMessageBundle.errorpage_seriouslywrong());
    })
  );

  it('should show error message for rejected promise with code 403',
    inject(($rootScope, $compile, RingMessageBundle, $q) => {
      $rootScope.errorSource = $q.defer();
      let elem = window.angular.element(`
<div rg-error-page="errorSource"><div class="content">Hello!</div></div>
      `);
      elem = $compile(elem)($rootScope);
      $rootScope.errorSource.reject({status: 403});
      $rootScope.$digest();

      elem[0].should.contain(MESSAGE_SELECTOR);
      elem[0].query(TITLE_SELECTOR).should.
        contain.text(`403: ${RingMessageBundle.errorpage_403()}`);
    })
  );

  it('should show error message for rejected resource',
    inject(($rootScope, $compile, RingMessageBundle, $q) => {
      const df = $q.defer();
      $rootScope.errorSource = {$promise: df.promise};

      let elem = window.angular.element(`
<div rg-error-page="errorSource"><div class="content">Hello!</div></div>
      `);
      elem = $compile(elem)($rootScope);
      df.reject({status: 403});
      $rootScope.$digest();

      elem[0].should.contain(MESSAGE_SELECTOR);
      elem[0].query(TITLE_SELECTOR).should.
        contain.text(`403: ${RingMessageBundle.errorpage_403()}`);
    })
  );

  it.skip('should show 403 page on no routing permissions',
    inject(($rootScope, $compile, RingMessageBundle, $q, $route) => {
      $route.current = {
        $$route: { // eslint-disable-line angular/no-private-call
          permission: 'hub.low-level'
        }
      };

      const df = $q.defer();
      $rootScope.errorSource = {$promise: df.promise};

      let elem = window.angular.element(`
<div rg-error-page="errorSource"><div class="content">Hello!</div></div>
      `);
      elem = $compile(elem)($rootScope);
      df.resolve();
      $rootScope.$digest();

      elem[0].should.contain(MESSAGE_SELECTOR);
      elem[0].query(TITLE_SELECTOR).should.
        contain.text(`403: ${RingMessageBundle.errorpage_403()}`);
    })
  );

  it.skip('should show 403 page on no routing permissions if argument\'s promise is also rejected',
    inject(($rootScope, $compile, RingMessageBundle, $q, $route) => {
      $route.current = {
        $$route: { // eslint-disable-line angular/no-private-call
          permission: 'hub.low-level'
        }
      };

      const df = $q.defer();
      df.promise.catch(() => {});
      $rootScope.errorSource = {$promise: df.promise};

      let elem = window.angular.element(`
<div rg-error-page="errorSource"><div class="content">Hello!</div></div>
      `);
      elem = $compile(elem)($rootScope);
      df.reject({status: 500});
      $rootScope.$digest();

      elem[0].should.contain(MESSAGE_SELECTOR);
      elem[0].query(TITLE_SELECTOR).should.
        contain.text(`403: ${RingMessageBundle.errorpage_403()}`);
    })
  );
});
