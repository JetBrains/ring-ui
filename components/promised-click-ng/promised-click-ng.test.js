/* global inject */
import 'angular';
import 'angular-mocks';

import buttonStyles from '../button/button.css';

import PromisedClick from './promised-click-ng';

describe('Promised Click Ng', () => {
  const click = new CustomEvent('click');
  let $rootScope;
  let $compile;
  let $q;
  function noop() {}

  beforeEach(window.module(PromisedClick));

  beforeEach(inject((_$rootScope_, _$compile_, _$q_) => {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $q = _$q_;
  }));

  afterEach(() => {
    $rootScope.$destroy();
  });

  function buildPromisedClick(auto) {
    const template = auto
      ? '<button rg-promised-click="onClick()"/>'
      : '<button rg-promised-click/>';
    const scope = $rootScope.$new();
    const $element = $compile(template)(scope);
    const element = $element[0];
    const ctrl = $element.controller('rgPromisedClick');
    const promise = {};

    scope.onClick = () => $q((resolve, reject) => {
      promise.resolve = resolve;
      promise.reject = reject;
    });

    scope.$digest();

    return {element, scope, ctrl, promise};
  }

  describe('automatic mode', () => {
    it('should not have the active class by default', () => {
      const {element} = buildPromisedClick(true);

      element.should.not.have.class(buttonStyles.active);
    });

    it('should add the active class by clicking', () => {
      const {element} = buildPromisedClick(true);
      element.dispatchEvent(click);

      element.should.have.class(buttonStyles.active.split(' ')[0]);
    });

    it('should remove the active class by resolving Promise', () => {
      const {element, promise, scope} = buildPromisedClick(true);
      element.dispatchEvent(click);
      promise.resolve();
      scope.$digest();

      element.should.not.have.class(buttonStyles.active);
    });

    it('should remove the active class by rejecting Promise', () => {
      const {element, promise, scope} = buildPromisedClick(true);
      element.dispatchEvent(click);
      promise.reject();
      scope.$digest();

      element.should.not.have.class(buttonStyles.active);
    });
  });

  describe('semi-automatic mode', () => {
    it('should not have the "active" class by default', () => {
      const {element} = buildPromisedClick();

      element.should.not.have.class(buttonStyles.active);
    });

    it('should call the given callback by clicking', () => {
      const {element, ctrl} = buildPromisedClick();
      const callback = sandbox.stub();
      ctrl.onClick(callback);
      element.dispatchEvent(click);

      callback.should.have.been.called;
    });

    it('should add the active class by clicking', () => {
      const {element, ctrl} = buildPromisedClick();
      ctrl.onClick(() => $q(noop));
      element.dispatchEvent(click);

      element.should.have.class(buttonStyles.active.split(' ')[0]);
    });

    it('should remove the active class by resolving Promise', () => {
      const {element, ctrl} = buildPromisedClick();
      ctrl.onClick(() => $q(resolve => {
        resolve();
      }));
      element.dispatchEvent(click);

      element.should.not.have.class(buttonStyles.active);
    });

    it('should remove the active class by rejecting Promise', () => {
      const {element, ctrl} = buildPromisedClick();
      ctrl.onClick(() => $q((resolve, reject) => {
        reject();
      }));
      element.dispatchEvent(click);

      element.should.not.have.class(buttonStyles.active);
    });
  });

  describe('manual mode', () => {
    it('should not have the active class by default', () => {
      const {element} = buildPromisedClick();

      element.should.not.have.class(buttonStyles.active);
    });

    it('should call the given callback', () => {
      const {ctrl} = buildPromisedClick();
      const callback = sandbox.stub();
      ctrl.process(callback);

      callback.should.have.been.called;
    });

    it('should add the active class', () => {
      const {element, ctrl} = buildPromisedClick();
      ctrl.process(() => $q(noop));

      element.should.have.class(buttonStyles.active.split(' ')[0]);
    });

    it('should remove the active class by resolving Promise', () => {
      const {element, ctrl} = buildPromisedClick();
      ctrl.process(() => $q(resolve => {
        resolve();
      }));

      element.should.not.have.class(buttonStyles.active);
    });

    it('should remove the active class by rejecting Promise', () => {
      const {element, ctrl} = buildPromisedClick();
      ctrl.process(() => $q((resolve, reject) => {
        reject();
      }));

      element.should.not.have.class(buttonStyles.active);
    });
  });
});
