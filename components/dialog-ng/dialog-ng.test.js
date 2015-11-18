/* global inject */
import 'angular';
import 'angular-mocks';
import 'dom4';
import simulateKeypress from 'simulate-keypress';

import './dialog-ng';

describe('DialogNg', function () {
  let service;
  let $compile;
  let $templateCache;
  let $rootScope;

  beforeEach(window.module('Ring.dialog'));

  beforeEach(inject(function (_$rootScope_, _$compile_, _$templateCache_, dialog) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    service = dialog;
  }));

  function showPopup(placeholderTemplate, contentTemplate, buttons = [], data = {}, options = {}) {
    const scope = $rootScope.$new();
    const $element = $compile(placeholderTemplate)(scope);
    const element = $element[0];
    const ctrl = $element.controller('rgDialog');

    $templateCache.put('/test.html', contentTemplate);
    const promise = service.show(Object.assign({content: '/test.html', buttons: buttons, data: data}, options));
    scope.$digest();

    return {scope, element, ctrl, promise};
  }

  const click = new CustomEvent('click');

  it('should be closed by pressing Esc', function () {
    const {element} = showPopup(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );
    simulateKeypress(null, 27); // Esc

    element.should.not.have.class('active');
  });

  it('should be closed via the controller', function () {
    const {element, ctrl, scope} = showPopup(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );
    ctrl.hide();
    scope.$digest();

    element.should.not.have.class('active');
  });

  it('should be closed via the service', function () {
    const {element, scope} = showPopup(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );
    service.hide();
    scope.$digest();

    element.should.not.have.class('active');
  });

  it('should be updated via the controller', function () {
    const {element, scope, ctrl} = showPopup(
      '<rg-dialog></rg-dialog>',
      '<div class="content">{{dialog.data.prop}}</div>',
      [],
      {prop: 'asd'}
    );
    ctrl.update({data: {prop: 'qwe'}});
    scope.$digest();

    element.query('.content').should.have.text('qwe');
  });

  it('should be updated via the service', function () {
    const {element, scope} = showPopup(
      '<rg-dialog></rg-dialog>',
      '<div class="content">{{dialog.data.prop}}</div>',
      [],
      {prop: 'asd'}
    );
    service.update({data: {prop: 'qwe'}});
    scope.$digest();

    element.query('.content').should.have.text('qwe');
  });

  it('should broadcast the event after opening', function () {
    const {scope} = showPopup(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );
    const callback = this.sinon.stub();
    scope.$$childHead.$on('dialog.show', callback); // eslint-disable-line angular/no-private-call
    service.show();

    callback.should.have.been.called;
  });

  it('should return Promise', function () {
    const {promise} = showPopup(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );

    promise.should.have.property('then');
    promise.should.have.property('catch');
  });

  it('should resolve Promise on "done"', function () {
    const {promise, scope} = showPopup(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );
    const callback = this.sinon.stub();

    promise.then(callback);
    service.done();
    scope.$digest();

    callback.should.have.been.called;
  });

  it('should reject Promise on "reset"', function () {
    const {promise, scope} = showPopup(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );
    const callback = this.sinon.stub();

    promise.catch(callback);
    service.reset();
    scope.$digest();

    callback.should.have.been.called;
  });

  it('should have a layer in the "popup" mode', function () {
    const {element} = showPopup(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );

    element.should.contain('.ring-dialog__layer');
  });

  it('should not have a layer in the "sidebar" mode', function () {
    const {element} = showPopup(
      '<rg-dialog in-sidebar="true"></rg-dialog>',
      '<div></div>'
    );

    element.should.not.contain('.ring-dialog__layer');
  });

  it('should not be "wide" by default', function () {
    const {element} = showPopup(
      '<rg-dialog></rg-dialog>',
      '<div></div>'
    );
    const container = element.query('.ring-dialog__container');

    container.should.not.have.class('ring-dialog__container_wide');
  });

  it('should be "wide" with a corresponding param', function () {
    const {element} = showPopup(
      '<rg-dialog></rg-dialog>',
      '<div></div>',
      [],
      {},
      {wideDialog: true}
    );
    const container = element.query('.ring-dialog__container');

    container.should.have.class('ring-dialog__container_wide');
  });

  describe('header', function () {
    it('should have a given title', function () {
      const {element} = showPopup(
        '<rg-dialog></rg-dialog>',
        '<div rg-dialog-title="{{dialog.data.title}}"></div>',
        [],
        {title: 'Dialog Title'}
      );

      element.query('.ring-dialog__header__title').should.have.text('Dialog Title');
    });

    it('should change title via the controller', function () {
      const {element, ctrl, scope} = showPopup(
        '<rg-dialog></rg-dialog>',
        '<div rg-dialog-title="{{dialog.data.title}}"></div>',
        [],
        {title: 'Dialog Title'}
      );

      ctrl.setTitle('New Dialog Title');
      scope.$digest();

      element.query('.ring-dialog__header__title').should.have.text('New Dialog Title');
    });

    it('should be draggable', function () {
      const {element} = showPopup(
        '<rg-dialog></rg-dialog>',
        '<div></div>'
      );

      const container = element.query('.ring-dialog__container');
      const header = element.query('.ring-dialog__header__title');

      const mousedown = new CustomEvent('mousedown');
      const mousemove = new CustomEvent('mousemove');
      const mouseup = new CustomEvent('mouseup');

      mousedown.clientX = 100;
      mousedown.clientY = 105;
      header.dispatchEvent(mousedown);

      mousemove.clientX = 140;
      mousemove.clientY = 150;
      document.dispatchEvent(mousemove);

      document.dispatchEvent(mouseup);

      mousemove.clientX = 200;
      mousemove.clientY = 200;
      document.dispatchEvent(mousemove);

      container.style.left.should.be.equal('40px');
      container.style.top.should.be.equal('45px');
    });

    it('should be draggable only inside the draggable zone', function () {
      const {element} = showPopup(
        '<rg-dialog></rg-dialog>',
        '<div></div>'
      );

      const container = element.query('.ring-dialog__container');
      const header = element.query('.ring-dialog__header__title');

      const mousedown = new CustomEvent('mousedown');
      const mousemove = new CustomEvent('mousemove');
      const mouseup = new CustomEvent('mouseup');

      mousedown.clientX = 100;
      mousedown.clientY = 105;
      header.dispatchEvent(mousedown);

      mousemove.clientX = 5;
      mousemove.clientY = 6;
      document.dispatchEvent(mousemove);

      document.dispatchEvent(mouseup);

      container.style.left.should.be.equal('10px');
      container.style.top.should.be.equal('10px');
    });
  });

  describe('form', function () {
    it('should contain a given content', function () {
      const {element} = showPopup(
        '<rg-dialog></rg-dialog>',
        '<div class="content"></div>'
      );

      element.query('form').should.contain('.content');
    });
  });

  describe('footer', function () {
    it('should have given buttons', function () {
      const {element} = showPopup(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{label: 'Ok', default: true}, {label: 'Cancel'}]
      );
      const buttons = element.queryAll('button');

      buttons.should.have.length(2);
      buttons[0].should.have.text('Ok');
      buttons[1].should.have.text('Cancel');
    });

    it('should have a given "default" button', function () {
      const {element} = showPopup(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{label: 'Ok', default: true}]
      );

      element.query('button').should.have.class('ring-btn_blue');
    });

    it('should be closed by clicking a button', function () {
      const {element} = showPopup(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{label: 'Button'}]
      );
      element.query('button').dispatchEvent(click);

      element.should.not.have.class('active');
    });

    it('should not be closed by clicking a button that return "false"', function () {
      const {element} = showPopup(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{
          label: 'Button',
          action: () => false
        }]
      );
      element.query('button').dispatchEvent(click);

      element.should.have.class('active');
    });

    it('should invoke an "action" callback attached to a button', function () {
      const action = this.sinon.stub();
      const {element} = showPopup(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [{action: action}]
      );
      element.query('button').dispatchEvent(click);

      element.should.not.have.class('active');
      action.should.have.been.called;
    });

    it('should not have a description by default', function () {
      const {element} = showPopup(
        '<rg-dialog></rg-dialog>',
        '<div></div>'
      );

      element.should.not.contain('.ring-dialog__footer__description');
    });

    it('should have a given description', function () {
      const {element} = showPopup(
        '<rg-dialog></rg-dialog>',
        '<div></div>',
        [],
        {},
        {description: 'Multiline\ndescription'}
      );

      element.should.contain('.ring-dialog__footer__description');

      const lines = element.query('.ring-dialog__footer__description').queryAll('div');

      lines.should.have.length(2);
      lines[0].should.have.text('Multiline');
      lines[1].should.have.text('description');
    });
  });
});
