/* eslint-disable angular/deferred */

import 'angular';
import 'angular-mocks';
import 'angular-route';
import ErrorPage from './error-page-ng';

describe('ErrorPageNg', function () {
  beforeEach(
    window.module('Ring.error-page',
    function ($provide) {
      $provide.provider('auth', require('../auth-ng/auth-ng.mock'));
    })
  );

  /* global inject */
  it('should define module', inject(function () {
    expect(window.angular.module(ErrorPage)).should.exist;
  }));

  it('should define factory errorPageConfiguration', inject(function (errorPageConfiguration) {
    expect(errorPageConfiguration).should.exist;
  }));

  it('should compile directive to content if no errors', inject(function ($rootScope, $compile) {
    let elem = window.angular.element('<div rg-error-page><div class="content">Hello!</div></div>');
    elem = $compile(elem)($rootScope);
    $rootScope.$digest();

    elem[0].query('.content').should.have.text('Hello!');
    elem[0].should.not.contain('.error-message');
  }));

  it('should compile directive to default error if has empty error',
    inject(function ($rootScope, $compile, RingMessageBundle) {
      let elem = window.angular.element('<div rg-error-page="{error: {}}"><div class="content">Hello!</div></div>');
      elem = $compile(elem)($rootScope);
      $rootScope.$digest();

      elem[0].should.not.contain('.content');
      elem[0].should.contain('.error-message');
      elem[0].query('.error-message__title').should.have.text(RingMessageBundle.errorpage_seriouslywrong());
    })
  );

  it('should show error message for 404',
    inject(function ($rootScope, $compile, RingMessageBundle) {
      let elem = window.angular.element('<div rg-error-page="{error: {status: 404}}"><div class="content">Hello!</div></div>');
      elem = $compile(elem)($rootScope);
      $rootScope.$digest();

      elem[0].should.not.contain('.content');
      elem[0].should.contain('.error-message');
      elem[0].query('.error-message__title').should.have.text('404: ' + RingMessageBundle.errorpage_404());
    })
  );

  it('should not show error message for resolved promise',
    inject(function ($rootScope, $compile, $q) {
      $rootScope.errorSource = $q.defer();

      let elem = window.angular.element('<div rg-error-page="errorSource"><div class="content">Hello!</div></div>');
      elem = $compile(elem)($rootScope);
      $rootScope.errorSource.resolve();
      $rootScope.$digest();

      elem[0].query('.content').should.have.text('Hello!');
      elem[0].should.not.contain('.error-message');
    })
  );

  it('should show error message for empty rejected promise',
    inject(function ($rootScope, $compile, RingMessageBundle, $q) {
      $rootScope.errorSource = $q.defer();
      let elem = window.angular.element('<div rg-error-page="errorSource"><div class="content">Hello!</div></div>');
      elem = $compile(elem)($rootScope);
      $rootScope.errorSource.reject();
      $rootScope.$digest();

      elem[0].should.not.contain('.content');
      elem[0].should.contain('.error-message');
      elem[0].query('.error-message__title').should.have.text(RingMessageBundle.errorpage_seriouslywrong());
    })
  );

  it('should show error message for rejected promise with code 403',
    inject(function ($rootScope, $compile, RingMessageBundle, $q) {
      $rootScope.errorSource = $q.defer();
      let elem = window.angular.element('<div rg-error-page="errorSource"><div class="content">Hello!</div></div>');
      elem = $compile(elem)($rootScope);
      $rootScope.errorSource.reject({status: 403});
      $rootScope.$digest();

      elem[0].should.not.contain('.content');
      elem[0].should.contain('.error-message');
      elem[0].query('.error-message__title').should.have.text('403: ' + RingMessageBundle.errorpage_403());
    })
  );

  it('should show error message for rejected resource',
    inject(function ($rootScope, $compile, RingMessageBundle, $q) {
      const df = $q.defer();
      $rootScope.errorSource = {$promise: df.promise};

      let elem = window.angular.element('<div rg-error-page="errorSource"><div class="content">Hello!</div></div>');
      elem = $compile(elem)($rootScope);
      df.reject({status: 403});
      $rootScope.$digest();

      elem[0].should.not.contain('.content');
      elem[0].should.contain('.error-message');
      elem[0].query('.error-message__title').should.have.text('403: ' + RingMessageBundle.errorpage_403());
    })
  );

  it('should show 403 page on no routing permissions',
    inject(function ($rootScope, $compile, RingMessageBundle, $q, $route) {
      $route.current = {
        $$route: { // eslint-disable-line angular/no-private-call
          permission: 'hub.low-level'
        }
      };

      const df = $q.defer();
      $rootScope.errorSource = {$promise: df.promise};

      let elem = window.angular.element('<div rg-error-page="errorSource"><div class="content">Hello!</div></div>');
      elem = $compile(elem)($rootScope);
      df.resolve();
      $rootScope.$digest();

      elem[0].should.not.contain('.content');
      elem[0].should.contain('.error-message');
      elem[0].query('.error-message__title').should.have.text('403: ' + RingMessageBundle.errorpage_403());
    })
  );

  it('should show 403 page on no routing permissions if argument\'s promise is also rejected',
    inject(function ($rootScope, $compile, RingMessageBundle, $q, $route) {
      $route.current = {
        $$route: { // eslint-disable-line angular/no-private-call
          permission: 'hub.low-level'
        }
      };

      const df = $q.defer();
      $rootScope.errorSource = {$promise: df.promise};

      let elem = window.angular.element('<div rg-error-page="errorSource"><div class="content">Hello!</div></div>');
      elem = $compile(elem)($rootScope);
      df.reject({status: 500});
      $rootScope.$digest();

      elem[0].should.not.contain('.content');
      elem[0].should.contain('.error-message');
      elem[0].query('.error-message__title').should.have.text('403: ' + RingMessageBundle.errorpage_403());
    })
  );
});
