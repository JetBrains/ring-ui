require('angular/angular');
require('angular-mocks/angular-mocks');
require('./select-ng');
var Select = require('select/select');

/* global inject, angular */

describe.only('SelectNg', function () {

  var scope;
  var element;
  var ctrl;
  var $compile;
  var $q;
  var fakeItems = [
    {id: 1, name: '11'},
    {id: 2, name: '22'},
    {id: 3, name: '33'}
  ];

  beforeEach(window.module('Ring.select'));

  var compileTemplate = function (template) {
    element = $compile(template)(scope);
    ctrl = element.controller('rgSelect');
    scope.$digest();
  };

  beforeEach(inject(function ($rootScope, _$compile_, _$q_) {
    $q = _$q_;
    scope = $rootScope.$new();
    $compile = _$compile_;

    scope.items = angular.copy(fakeItems);
    scope.selectedItem = scope.items[2];

    compileTemplate('<rg-select options="items" ng-model="selectedItem" key-field="id" label-field="name"></rg-select>');
  }));

  describe('DOM', function () {
    it('Should place container for select inside directive', function () {
      expect(element).to.have.descendants('span');
    });

    it('Should render select inside container', function () {
      expect(element).to.have.descendants('.ring-select');
    });

    it('Should not render select if type=dropdown', function () {
      compileTemplate('<rg-select options="items" ng-model="selectedItem" type="dropdown"></rg-select>');

      expect(element).to.not.have.descendants('.ring-select');
    });
  });

  describe('Interface', function () {
    it('Should receive ngModel controller', function () {
      expect(ctrl.ngModelCtrl).to.be.defined;
    });

    it('Should extend passed config', function () {
      scope.config = {someField: 'test'};
      compileTemplate('<rg-select options="items" ng-model="selectedItem" config="config"></rg-select>');

      expect(ctrl.config.someField).to.equal('test');
    });

    it('Should work without ng-model', function () {
      var initDirective = function () {
        compileTemplate('<rg-select options="items"></rg-select>');
      };
      expect(initDirective).to.not.throw;
    });

    it('Should update selected item on ngModel updates', function () {
      var newLabel = 'Some new label';
      scope.selectedItem.name = newLabel;
      scope.$digest();
      expect(ctrl.selectInstance.props.selected.label).to.equal(newLabel);
    });

    it('Should not get options on on initialization', function () {
      expect(ctrl.selectInstance.props.data.length).to.equal(0);
    });

    it('Should get options on open', function () {
      ctrl.config.onOpen();
      scope.$digest();
      expect(ctrl.selectInstance.props.data.length).to.equal(fakeItems.length);
    });

    it('Should convert ngModel to select supported object', function () {
      expect(ctrl.config.selected.key).to.equal(scope.selectedItem.id);
      expect(ctrl.config.selected.label).to.equal(scope.selectedItem.name);
    });

    it('Should convert options to select supported objects', function () {
      ctrl.loadOptionsToSelect();
      scope.$digest();
      expect(ctrl.selectInstance.props.data[0].key).to.equal(fakeItems[0].id);
      expect(ctrl.selectInstance.props.data[0].label).to.equal(fakeItems[0].name);
    });

    it('Should use default type "Button" if type is not passed', function () {
      compileTemplate('<rg-select options="items" ng-model="selectedItem" key-field="id" label-field="name"></rg-select>');
      expect(ctrl.selectInstance.props.type).to.equal(Select.Type.BUTTON);
    });

    it('Should support type "input"', function () {
      compileTemplate('<rg-select options="items" ng-model="selectedItem" type="input" key-field="id" label-field="name"></rg-select>');
      expect(ctrl.selectInstance.props.type).to.equal(Select.Type.INPUT);
    });

    it('Should support type "dropdown', function () {
      compileTemplate('<rg-select options="items" ng-model="selectedItem" type="dropdown" key-field="id" label-field="name"></rg-select>');
      expect(ctrl.selectInstance.props.type).to.equal(Select.Type.CUSTOM);
    });

    it('Should support selectedLabelField customization', function () {
      scope.selectedItem.testField = 'test';
      compileTemplate('<rg-select options="items" ng-model="selectedItem" selected-label-field="testField"></rg-select>');
      expect(ctrl.config.selected.selectedLabel).to.equal('test');
    });

    it('Should support selected formater function', function () {
      scope.formatter = this.sinon.stub().returns('Formatted label');

      compileTemplate('<rg-select options="items" external-filter="true" ng-model="selectedItem" selected-formatter="formatter" key-field="id" label-field="name"></rg-select>');

      expect(ctrl.config.selected.selectedLabel).to.equal('Formatted label');
    });

    it('Should save original model in select items', function () {
      ctrl.loadOptionsToSelect();
      scope.$digest();
      expect(ctrl.selectInstance.props.data[0].originalModel).to.deep.equal(fakeItems[0]);
    });

    it('Should update ng-model on selecting', function () {
      ctrl.config.onChange({originalModel: fakeItems[0]});
      scope.$digest();
      expect(scope.selectedItem).to.equal(fakeItems[0]);
    });

    it('Should call datasource on opening', function () {
      scope.dataSource = this.sinon.stub().returns(fakeItems);

      compileTemplate('<rg-select options="dataSource" external-filter="true" ng-model="selectedItem" key-field="id" label-field="name"></rg-select>');

      ctrl.config.onOpen();
      scope.$digest();
      expect(scope.dataSource).to.have.been.called;
    });

    it('Should call datasource on filtering if external filter enabled', function () {
      scope.dataSource = this.sinon.stub().returns(fakeItems);

      compileTemplate('<rg-select options="dataSource" external-filter="true" ng-model="selectedItem" key-field="id" label-field="name"></rg-select>');

      ctrl.config.onFilter('test');
      scope.$digest();
      expect(scope.dataSource).to.have.been.calledWith('test');
    });

    it('If externalFilter enabled should provide custom filter.fn which should always return true', function () {
      scope.dataSource = this.sinon.stub().returns(fakeItems);

      compileTemplate('<rg-select options="dataSource" external-filter="true" ng-model="selectedItem"></rg-select>');

      expect(ctrl.filter.fn()).to.be.true;
    });
  });

});
