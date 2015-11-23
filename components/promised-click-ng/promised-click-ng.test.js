/* global inject */
import 'dom4';
import PromisedClick from './promised-click-ng';

describe('PromisedClickNg', function () {
  const click = new CustomEvent('click');
  let $rootScope;
  let $compile;
  let $q;
  function noop() {}

  beforeEach(window.module(PromisedClick));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$q_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $q = _$q_;
  }));

  afterEach(function () {
    $rootScope.$destroy();
  });

  function buildPromisedClick(auto) {
    const template = auto ? '<button rg-promised-click="onClick()"/>' : '<button rg-promised-click/>';
    const scope = $rootScope.$new();
    const $element = $compile(template)(scope);
    const element = $element[0];
    const ctrl = $element.controller('rgPromisedClick');
    const promise = {};

    scope.onClick = function () {
      return $q((resolve, reject) => {
        promise.resolve = resolve;
        promise.reject = reject;
      });
    };

    scope.$digest();

    return {element, scope, ctrl, promise};
  }

  describe('automatic mode', function () {
    it('should not have the "ring-btn_active" class by default', function () {
      const {element} = buildPromisedClick(true);

      element.should.not.have.class('ring-btn_active');
    });

    it('should add the "ring-btn_active" class by clicking', function () {
      const {element} = buildPromisedClick(true);
      element.dispatchEvent(click);

      element.should.have.class('ring-btn_active');
    });

    it('should remove the "ring-btn_active" class by resolving Promise', function () {
      const {element, promise, scope} = buildPromisedClick(true);
      element.dispatchEvent(click);
      promise.resolve();
      scope.$digest();

      element.should.not.have.class('ring-btn_active');
    });

    it('should remove the "ring-btn_active" class by rejecting Promise', function () {
      const {element, promise, scope} = buildPromisedClick(true);
      element.dispatchEvent(click);
      promise.reject();
      scope.$digest();

      element.should.not.have.class('ring-btn_active');
    });
  });

  describe('semi-automatic mode', function () {
    it('should not have the "ring-btn_active" class by default', function () {
      const {element} = buildPromisedClick();

      element.should.not.have.class('ring-btn_active');
    });

    it('should call the given callback by clicking', function () {
      const {element, ctrl} = buildPromisedClick();
      const callback = this.sinon.stub();
      ctrl.onClick(callback);
      element.dispatchEvent(click);

      callback.should.have.been.called;
    });

    it('should add the "ring-btn_active" class by clicking', function () {
      const {element, ctrl} = buildPromisedClick();
      ctrl.onClick(() => $q(noop));
      element.dispatchEvent(click);

      element.should.have.class('ring-btn_active');
    });

    it('should remove the "ring-btn_active" class by resolving Promise', function () {
      const {element, ctrl} = buildPromisedClick();
      ctrl.onClick(() => $q(resolve => {
        resolve();
      }));
      element.dispatchEvent(click);

      element.should.not.have.class('ring-btn_active');
    });

    it('should remove the "ring-btn_active" class by rejecting Promise', function () {
      const {element, ctrl} = buildPromisedClick();
      ctrl.onClick(() => $q((resolve, reject) => {
        reject();
      }));
      element.dispatchEvent(click);

      element.should.not.have.class('ring-btn_active');
    });
  });

  describe('manual mode', function () {
    it('should not have the "ring-btn_active" class by default', function () {
      const {element} = buildPromisedClick();

      element.should.not.have.class('ring-btn_active');
    });

    it('should call the given callback', function () {
      const {ctrl} = buildPromisedClick();
      const callback = this.sinon.stub();
      ctrl.process(callback);

      callback.should.have.been.called;
    });

    it('should add the "ring-btn_active" class', function () {
      const {element, ctrl} = buildPromisedClick();
      ctrl.process(() => $q(noop));

      element.should.have.class('ring-btn_active');
    });

    it('should remove the "ring-btn_active" class by resolving Promise', function () {
      const {element, ctrl} = buildPromisedClick();
      ctrl.process(() => $q(resolve => {
        resolve();
      }));

      element.should.not.have.class('ring-btn_active');
    });

    it('should remove the "ring-btn_active" class by rejecting Promise', function () {
      const {element, ctrl} = buildPromisedClick();
      ctrl.process(() => $q((resolve, reject) => {
        reject();
      }));

      element.should.not.have.class('ring-btn_active');
    });
  });
});
