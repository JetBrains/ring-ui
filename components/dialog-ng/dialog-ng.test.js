/* global inject, angular */

import 'angular';
import 'angular-mocks';
import 'dom4';

import './dialog-ng';

describe('DialogNg', function () {
  let scope;
  let element;
  let ctrl;
  let service;
  let $compile;
  let $templateCache;

  beforeEach(window.module('Ring.dialog'));

  function compileTemplate(template) {
    element = $compile(template)(scope);
    ctrl = element.controller('rgDialog');
    scope.$digest();
  }

  beforeEach(inject(function ($rootScope, _$compile_, _$templateCache_, dialog) {
    scope = $rootScope.$new();
    $compile = _$compile_;
    $templateCache = _$templateCache_;
    service = dialog;
  }));

  it('should has a specified title', function () {
    compileTemplate('<rg-dialog></rg-dialog>');
    $templateCache.put('/test.html', '<div rg-dialog-title="{{ dialog.data.title }}"></div>');

    service.show({
      content: '/test.html',
      data: {
        title: 'Dialog Title'
      }
    });

    scope.$digest();

    element[0].query('.ring-dialog__header__title').should.have.text('Dialog Title');
  });
});
