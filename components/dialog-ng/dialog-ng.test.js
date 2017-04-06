/* global inject, angular */
/* eslint-disable func-names */

import 'angular';
import 'angular-mocks';
import 'dom4';
import simulateCombo from 'simulate-combo';
import {getRect} from '../global/dom';

import Dialog from './dialog-ng';
import styles from './dialog-ng.css';
import dialogStyles from '../dialog/dialog.css';

describe('Dialog Ng', () => {
  let dialogInSidebar;
  let $compile;
  let $q;
  let $templateCache;
  let $rootScope;
  let sandbox;
  let text;

  beforeEach(window.module(
    Dialog,
    $controllerProvider => {
      $controllerProvider.register('testCtrl', function () {
        this.text = text;
      });
    }
  ));

  let $compileProvider;
  beforeEach(window.module(_$compileProvider_ => {
    $compileProvider = _$compileProvider_;
  }));

  beforeEach(inject((_$q_, _$rootScope_, _$compile_, _$templateCache_, _dialogInSidebar_) => {
    $q = _$q_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    dialogInSidebar = _dialogInSidebar_;
  }));

  beforeEach(() => {
    sandbox = document.createElement('div');
    document.body.append(sandbox);
  });

  afterEach(() => {
    $rootScope.$destroy();
    $templateCache.removeAll();
    sandbox.remove();
  });

  function showDialog(placeholderTemplate, contentTemplate, buttons = [], data = {}, options = {}) {
    const scope = $rootScope.$new();
    const $element = $compile(placeholderTemplate)(scope);
    const element = $element[0];
    const ctrl = $element.controller('rgDialog');

    sandbox.append(element);

    $templateCache.put('/test.html', contentTemplate);
    const promise = dialogInSidebar.show(Object.assign({
      content: '/test.html',
      buttons,
      data
    }, options));

    scope.$digest();

    return {scope, element, ctrl, promise};
  }

  const click = new CustomEvent('click');

  describe('dialog', () => {

    let renderDialog;
    beforeEach(() => {
      renderDialog = config => {
        config.content = undefined;

        const element = showDialog('<rg-dialog></rg-dialog>', null, null, null, config).element;
        $rootScope.$apply();
        return element;
      };
    });

    it('should allow pass custom scope to the template', () => {
      const $scope = $rootScope.$new();
      $scope.text = 'Hello';

      const element = renderDialog({
        scope: $scope,
        template: '<div class="content">{{text}}</div>'
      });

      element.query('form .content').should.have.html($scope.text);
    });

    it('should allow pass custom controller', () => {
      text = 'Hello';

      const element = renderDialog({
        template: '<div class="content">{{text}}</div>',
        controller: ['$scope', $scope => {
          $scope.text = text;
        }]
      });

      element.query('form .content').should.have.html(text);
    });

    it('should trigger $destroy event on the scope when user close dialog', function () {
      const onDestroy = this.sinon.stub();

      renderDialog({
        template: '<div/>',
        controller: ['$scope', $scope => {
          $scope.$on('$destroy', onDestroy);
        }]
      });

      dialogInSidebar.hide();

      onDestroy.should.have.been.called;
    });

    describe('element $destroy', () => {

      let testDirectiveOnDestroyElement;
      beforeEach(function () {
        testDirectiveOnDestroyElement = this.sinon.stub();
        $compileProvider.directive('foo', () => (
          {
            template: '<div/>',
            controller: $element => {
              $element.on('$destroy', testDirectiveOnDestroyElement);
            }
          }
        ));
      });

      it('should trigger $destroy on directive', () => {
        renderDialog({
          template: '<foo></foo>',
          controller: angular.noop
        });

        dialogInSidebar.hide();

        testDirectiveOnDestroyElement.should.have.been.called;
      });


      it('should trigger $destroy event on nested directives', () => {
        renderDialog({
          template: '<div><div ng-if="true"><foo></foo></div></div>',
          controller: angular.noop
        });

        dialogInSidebar.hide();

        testDirectiveOnDestroyElement.should.have.been.called;
      });
    });

    it('should allow use controllerAs notation', () => {
      text = 'Hello';

      const element = renderDialog({
        template: '<div class="content">{{testCtrl.text}}</div>',
        controllerAs: 'testCtrl',
        controller() {
          this.text = text;
        }
      });

      element.query('form .content').should.have.html(text);
    });

    it('should allow pass controller name', () => {
      text = 'Hello';

      const element = renderDialog({
        template: '<div class="content">{{testCtrl.text}}</div>',
        controllerAs: 'testCtrl',
        controller: 'testCtrl'
      });

      element.query('form .content').should.have.html(text);
    });

    it('should allow custom locals dependencies to the controller', function () {
      text = 'Hello';
      const greetingService = this.sinon.stub().returns(text);

      const element = renderDialog({
        template: '<div class="content">{{text}}</div>',
        locals: {
          greeting: greetingService
        },
        controller: ['$scope', 'greeting', ($scope, greeting) => {
          $scope.text = greeting();
        }]
      });

      element.query('form .content').should.have.html(text);
    });

    it('should allow pass resolve object', function () {
      text = 'Hello';
      const greetingResolver = this.sinon.stub().returns(text);

      const element = renderDialog({
        template: '<div class="content">{{text}}</div>',
        resolve: {
          greeting: greetingResolver
        },
        controller: ['$scope', 'greeting', ($scope, greeting) => {
          $scope.text = greeting;
        }]
      });

      element.query('form .content').should.have.html(text);
    });

    it('should reject dialog promise on unsatisfied resolve', function () {
      const errorDefer = $q.defer(); //eslint-disable-line
      const serviceWhichThrowError = this.sinon.stub().
        returns(errorDefer.promise);
      const onError = this.sinon.stub();

      const config = {
        content: undefined,
        template: '<div/>',
        resolve: {
          foo: serviceWhichThrowError
        }
      };

      showDialog('<rg-dialog></rg-dialog>', null, null, null, config).
        promise.
        catch(onError);
      $rootScope.$apply();

      errorDefer.reject({});
      $rootScope.$apply();

      onError.should.have.been.called;
    });


    it('should allow pass promise to the resolve', function () {
      text = 'Hello';
      const defer = $q.defer(); //eslint-disable-line
      const greetingResolver = this.sinon.stub().returns(defer.promise);

      defer.resolve(text);

      const element = renderDialog({
        template: '<div class="content">{{text}}</div>',
        resolve: {
          greeting: greetingResolver
        },
        controller: ['$scope', 'greeting', ($scope, greeting) => {
          $scope.text = greeting;
        }]
      });

      element.query('form .content').should.have.html(text);
    });

    it('should render template with more than one root node', () => {
      const $scope = $rootScope.$new();
      $scope.text = 'Hello';

      const element = renderDialog({
        scope: $scope,
        template: '<div class="content">{{text}}</div><div class="content-2">{{text}}</div>'
      });

      element.query('form .content-2').should.have.html($scope.text);
    });

    it('should allow use old data api in template', () => {
      const dialogConfig = {
        data: {
          text: 'Hello World!'
        },
        content: undefined,
        template: '<div class="content">{{data.text}}</div>'
      };

      const {element} = showDialog('<rg-dialog></rg-dialog>', null, null, null, dialogConfig);
      $rootScope.$apply();

      element.query('form .content').should.have.html(dialogConfig.data.text);
    });

    it('should transclude custom footer', () => {
      const element = renderDialog({
        template: '<div><rg-dialog-footer><span data-test="customElementFooter">Hello</span></rg-dialog-footer></div>',
        controllerAs: 'testCtrl',
        controller() {}
      });

      element.should.contain(`.${styles.footer}`);
      element.should.contain('*[data-test="customElementFooter"]');
    });

    it('should transclude custom footer with ng-if', () => {
      const element = renderDialog({
        template: '<div><rg-dialog-footer><span ng-if="true" data-test="customElementFooter">Hello</span></rg-dialog-footer></div>',
        controllerAs: 'testCtrl',
        controller() {}
      });

      element.should.contain(`.${styles.footer}`);
      element.should.contain('*[data-test="customElementFooter"]');
    });

    describe('dialogForm', () => {
      function getDialogFormObject(element) {
        return angular.element(element).isolateScope().dialogForm;
      }


      it('should clear form state after close dialog', () => {
        const element = renderDialog({
          scope: $rootScope.$new(),
          template: '<div/>'
        });

        let dialogForm = getDialogFormObject(element);
        dialogForm.$setValidity('foo', false);
        dialogForm.$valid.should.be.equal(false);


        dialogInSidebar.hide();


        dialogInSidebar.show({
          scope: $rootScope.$new(),
          template: '<div/>'
        });

        dialogForm = getDialogFormObject(element);
        dialogForm.$valid.should.be.equal(true);
      });
    });
  });


  it('should be closed by pressing Esc', () => {
    const {element} = showDialog(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );
    simulateCombo('esc');

    element.should.not.have.class('active');
  });

  it('should merge ESC handler and still been closed by pressing Esc', function () {
    const {element} = showDialog(
      '<rg-dialog></rg-dialog>',
      '<div></div>',
      [],
      {},
      {
        shortcuts: {
          esc: this.sinon.spy()
        }
      }
    );
    simulateCombo('esc');

    element.should.not.have.class('active');
  });

  it('should call custom handler after pressing ESC', function () {
    const callback = this.sinon.spy();
    showDialog(
      '<rg-dialog></rg-dialog>',
      '<div></div>',
      [],
      {},
      {
        shortcuts: {
          esc: callback
        }
      }
    );
    simulateCombo('esc');

    callback.should.have.been.called;
  });

  it('should be closed via the controller', () => {
    const {element, ctrl, scope} = showDialog(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );
    ctrl.hide();
    scope.$digest();

    element.should.not.have.class('active');
  });

  it('should be closed via the dialog', () => {
    const {element, scope} = showDialog(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );
    dialogInSidebar.hide();
    scope.$digest();

    element.should.not.have.class('active');
  });

  it('should be updated via the controller', () => {
    const {element, scope, ctrl} = showDialog(
      '<rg-dialog></rg-dialog>',
      '<div class="content">{{dialog.data.prop}}</div>',
      [],
      {prop: 'asd'}
    );
    ctrl.update({data: {prop: 'qwe'}});
    scope.$digest();

    element.query('.content').should.have.text('qwe');
  });

  it('should be updated via the dialog', () => {
    const {element, scope} = showDialog(
      '<rg-dialog></rg-dialog>',
      '<div class="content">{{dialog.data.prop}}</div>',
      [],
      {prop: 'asd'}
    );
    dialogInSidebar.update({data: {prop: 'qwe'}});
    scope.$digest();

    element.query('.content').should.have.text('qwe');
  });

  it('should broadcast the event after opening', function () {
    const {scope} = showDialog(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );
    const callback = this.sinon.stub();
    scope.$$childHead.$on('dialog.show', callback); // eslint-disable-line angular/no-private-call
    dialogInSidebar.show();

    callback.should.have.been.called;
  });

  it('should return Promise', () => {
    const {promise} = showDialog(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );

    promise.should.have.property('then');
    promise.should.have.property('catch');
  });

  it('should resolve Promise on "done"', function () {
    const {promise, scope} = showDialog(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );
    const callback = this.sinon.stub();

    promise.then(callback);
    dialogInSidebar.done();
    scope.$digest();

    callback.should.have.been.called;
  });

  it('should resolve Promise on "reset" because reset/close is not exception', function () {
    const callback = this.sinon.stub();

    const {scope, promise} = showDialog(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );

    promise.then(callback);
    dialogInSidebar.reset();
    scope.$digest();

    callback.should.have.been.called;
  });

  it('should have a layer in the "popup" mode', () => {
    const {element} = showDialog(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );

    element.should.match(`.${dialogStyles.container}`);
  });

  it('should not have a layer in the "sidebar" mode', () => {
    const {element} = showDialog(
      '<rg-dialog in-sidebar="true"></rg-dialog>',
      '<div></div>'
    );

    element.should.not.match(`.${dialogStyles.container}`);
  });

  it('should not be "wide" by default', () => {
    const {element} = showDialog(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );

    element.should.not.contain(`.${styles.wide}`);
  });

  it('should be "wide" with a corresponding param', () => {
    const {element} = showDialog(
      '<rg-dialog></rg-dialog>',
      '<div></div>',
      [],
      {},
      {wideDialog: true}
    );

    element.should.contain(`.${styles.wide}`);
  });

  describe('header', () => {
    it('should have a given title', () => {
      const {element} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div rg-dialog-title="{{dialog.data.title}}"></div>',
        [],
        {title: 'Dialog Title'}
      );

      element.query('*[data-anchor=dialog-header]').should.contain.text('Dialog Title');
    });

    it('should change title via the controller', () => {
      const {element, ctrl, scope} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div rg-dialog-title="{{dialog.data.title}}"></div>',
        [],
        {title: 'Dialog Title'}
      );

      ctrl.setTitle('New Dialog Title');
      scope.$digest();

      element.query('*[data-anchor=dialog-header]').should.contain.text('New Dialog Title');
    });

    it('should be draggable', () => {
      const {element} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div></div>'
      );

      const container = element.query('*[data-anchor=dialog-container]');
      const header = element.query('*[data-anchor=dialog-header]');

      const mousedown = new CustomEvent('mousedown');
      const mousemove = new CustomEvent('mousemove');
      const mouseup = new CustomEvent('mouseup');

      header.dispatchEvent(mousedown);

      mousemove.movementX = 140;
      mousemove.movementY = 150;
      document.dispatchEvent(mousemove);

      document.dispatchEvent(mouseup);

      mousemove.clientX = 200;
      mousemove.clientY = 200;
      document.dispatchEvent(mousemove);

      parseFloat(container.style.left).should.be.closeTo(140, 0.1);
      parseFloat(container.style.top).should.be.closeTo(150, 0.1);
    });

    it('should be draggable only inside the draggable zone', () => {
      const {element} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div></div>'
      );

      const container = element.query('*[data-anchor=dialog-container]');
      const header = element.query('*[data-anchor=dialog-header]');

      const mousedown = new CustomEvent('mousedown');
      const mousemove = new CustomEvent('mousemove');
      const mouseup = new CustomEvent('mouseup');
      const initialRect = getRect(container);

      header.dispatchEvent(mousedown);

      mousemove.movementX = -10000;
      mousemove.movementY = -10000;
      document.dispatchEvent(mousemove);

      getRect(container).should.contain({left: initialRect.left, top: initialRect.top});

      mousemove.clientX = 30000;
      mousemove.clientY = 40000;
      document.dispatchEvent(mousemove);

      document.dispatchEvent(mouseup);

      getRect(container).should.contain({
        bottom: initialRect.bottom,
        right: initialRect.right
      });
    });
  });

  describe('form', () => {
    it('should contain a given content', () => {
      const {element} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div class="content"></div>'
      );

      element.query('form').should.contain('.content');
    });

    it('should allow pass custom template as html', () => {
      const dialogConfig = {
        data: {},
        content: undefined,
        template: '<div class="content"></div>'
      };

      const {element} = showDialog('<rg-dialog></rg-dialog>', null, null, null, dialogConfig);

      element.query('form').should.contain('.content');
    });
  });

  describe('footer', () => {
    it('should have given buttons', () => {
      const {element} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{label: 'Ok', default: true}, {label: 'Cancel'}]
      );
      const buttons = element.queryAll('button');

      buttons.should.have.length(2);
      buttons[0].should.include.text('Ok');
      buttons[1].should.include.text('Cancel');
    });

    it('should have a given "default" button', () => {
      const {element} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{label: 'Ok', default: true}]
      );

      element.query('button').should.have.class('ring-button_blue');
    });

    it('should be closed by clicking a button', () => {
      const {element} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{label: 'Button'}]
      );
      element.query('button').dispatchEvent(click);

      $rootScope.$digest();
      element.should.not.have.class('active');
    });

    it('should be closed by outside dialog if closeOnClick===true', () => {
      const {element, ctrl} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{label: 'Button'}],
        {},
        {closeOnClick: true}
      );
      element.dispatchEvent(click);

      $rootScope.$digest();
      ctrl.active.should.not.be.true;
    });

    it('should not be closed by outside dialog if closeOnClick is not set', () => {
      const {element, ctrl} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{label: 'Button'}]
      );
      element.dispatchEvent(click);

      $rootScope.$digest();
      ctrl.active.should.be.true;
    });

    it('should be closed if action returns promise and when it resolves', () => {
      const defer = $q.defer(); //eslint-disable-line

      const {element, ctrl} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{
          label: 'Button',
          action: () => defer.promise
        }]
      );
      element.query('button').dispatchEvent(click);

      $rootScope.$digest();
      ctrl.active.should.be.true;

      defer.resolve();
      $rootScope.$digest();
      ctrl.active.should.be.false;
    });

    it('should not be closed if action returns promise and when it resolves with "false"', () => {
      const defer = $q.defer(); //eslint-disable-line

      const {element, ctrl} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{
          label: 'Button',
          action: () => defer.promise
        }]
      );
      element.query('button').dispatchEvent(click);

      $rootScope.$digest();
      ctrl.active.should.be.true;

      defer.resolve(false);
      $rootScope.$digest();
      ctrl.active.should.be.true;
    });

    it('should not be closed by clicking a button that return "false"', () => {
      const {element, ctrl} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{
          label: 'Button',
          action: () => false
        }]
      );
      element.query('button').dispatchEvent(click);

      $rootScope.$digest();

      ctrl.active.should.be.true;
    });

    it('should invoke an "action" callback attached to a button', function () {
      const action = this.sinon.stub();
      const {element} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{action}]
      );
      element.query('button').dispatchEvent(click);

      element.should.not.have.class('active');
      action.should.have.been.called;
    });

    it('should not have a description by default', () => {
      const {element} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div></div>'
      );

      element.should.not.contain(`.${styles.footerDescription}`);
    });

    it('should have a given description', () => {
      const {element} = showDialog(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [],
        {},
        {description: 'Multiline\ndescription'}
      );

      element.should.contain(`.${styles.footerDescription}`);

      const lines = element.query(`.${styles.footerDescription}`).queryAll('div');

      lines.should.have.length(2);
      lines[0].should.have.text('Multiline');
      lines[1].should.have.text('description');
    });
  });
});
