require('angular/angular');
require('angular-mocks/angular-mocks');
require('./select-ng');
var $ = require('jquery');
var Select = require('select/select');

/* global inject, angular */

describe('SelectNg', function () {

  var scope;
  var element;
  var ctrl;
  var $compile;
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

  beforeEach(inject(function ($rootScope, _$compile_) {
    scope = $rootScope.$new();
    $compile = _$compile_;

    scope.items = angular.copy(fakeItems);
    scope.selectedItem = scope.items[2];

    compileTemplate('<rg-select options="item as item.name for item in items track by item.id" ng-model="selectedItem"></rg-select>');
  }));

  describe('DOM', function () {
    it('Should place container for select inside directive', function () {
      element.should.have.descendants('span');
    });

    it('Should render select inside container', function () {
      element.should.have.descendants('.ring-select');
    });

    it('Should not render select if type=dropdown', function () {
      compileTemplate('<rg-select options="item as item.name for item in items track by item.id" ng-model="selectedItem" type="dropdown"></rg-select>');

      element.should.not.have.descendants('.ring-select');
    });
  });

  describe('Interface', function () {
    it('Should receive ngModel controller', function () {
      ctrl.ngModelCtrl.should.to.be.defined;
    });

    it('Should extend passed config', function () {
      scope.config = {someField: 'test'};
      compileTemplate('<rg-select options="item as item.name for item in items track by item.id" ng-model="selectedItem" config="config"></rg-select>');

      ctrl.config.someField.should.equal('test');
    });

    it('Should work without ng-model', function () {
      var initDirective = function () {
        compileTemplate('<rg-select options="item as item.name for item in items track by item.id"></rg-select>');
      };
      initDirective.should.not.throw;
    });

    it('Should update selected item on ngModel updates', function () {
      var newLabel = 'Some new label';
      scope.selectedItem.name = newLabel;
      scope.$digest();
      ctrl.selectInstance.props.selected.label.should.equal(newLabel);
    });

    it('Should not get options on on initialization', function () {
      ctrl.selectInstance.props.data.length.should.equal(0);
    });

    it('Should get options on open', function () {
      ctrl.config.onOpen();
      scope.$digest();
      ctrl.selectInstance.props.data.length.should.equal(fakeItems.length);
    });

    it('Should convert ngModel to select supported object', function () {
      ctrl.config.selected.key.should.equal(scope.selectedItem.id);
      ctrl.config.selected.label.should.equal(scope.selectedItem.name);
    });

    it('Should convert options to select supported objects', function () {
      ctrl.loadOptionsToSelect();
      scope.$digest();
      ctrl.selectInstance.props.data[0].key.should.equal(fakeItems[0].id);
      ctrl.selectInstance.props.data[0].label.should.equal(fakeItems[0].name);
    });

    it('Should use default type "Button" if type is not passed', function () {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem"></rg-select>');
      ctrl.selectInstance.props.type.should.equal(Select.Type.BUTTON);
    });

    it('Should support type "input"', function () {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem" type="input"></rg-select>');
      ctrl.selectInstance.props.type.should.equal(Select.Type.INPUT);
    });

    it('Should support type "dropdown', function () {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem" type="dropdown"></rg-select>');
      ctrl.selectInstance.props.type.should.equal(Select.Type.CUSTOM);
    });

    it('Should support selectedLabelField customization', function () {
      scope.selectedItem.testField = 'test';
      compileTemplate('<rg-select options="item.name select as item.testField for item in items track by item.id" ng-model="selectedItem"></rg-select>');
      ctrl.config.selected.selectedLabel.should.equal('test');
    });

    it('Should support selected formater function', function () {
      scope.formatter = this.sinon.stub().returns('Formatted label');

      compileTemplate('<rg-select options="item.name select as formatter(item) for item in items track by item.id" external-filter="true" ng-model="selectedItem"></rg-select>');

      ctrl.config.selected.selectedLabel.should.equal('Formatted label');
    });

    it('Should save original model in select items', function () {
      ctrl.loadOptionsToSelect();
      scope.$digest();
      ctrl.selectInstance.props.data[0].originalModel.should.deep.equal(fakeItems[0]);
    });

    it('Should update ng-model on selecting', function () {
      ctrl.config.onChange({originalModel: fakeItems[0]});
      scope.$digest();
      scope.selectedItem.should.equal(fakeItems[0]);
    });

    it('Should call datasource on opening', function () {
      scope.dataSource = this.sinon.stub().returns(fakeItems);

      compileTemplate('<rg-select options="item.name for item in dataSource(query) track by item.id" external-filter="true" ng-model="selectedItem"></rg-select>');

      ctrl.config.onOpen();
      scope.$digest();
      scope.dataSource.should.have.been.called;
    });

    it('Should call datasource on filtering if external filter enabled', function () {
      scope.dataSource = this.sinon.stub().returns(fakeItems);

      compileTemplate('<rg-select options="item.name for item in dataSource(query) track by item.id" external-filter="true" ng-model="selectedItem"></rg-select>');

      ctrl.config.onFilter('test');
      scope.$digest();
      scope.dataSource.should.have.been.calledWith('test');
    });

    it('If externalFilter enabled should provide custom filter.fn which should always return true', function () {
      scope.dataSource = this.sinon.stub().returns(fakeItems);

      compileTemplate('<rg-select options="item as item.name for item in items track by item.id" external-filter="true" ng-model="selectedItem"></rg-select>');

      ctrl.filter.fn().should.be.true;
    });

    it('Should be disabled if disabled', function () {
      compileTemplate('<rg-select options="item as item.name for item in items track by item.id" ng-model="selectedItem" disabled="true"></rg-select>');

      $(element[0]).should.have.descendants('.ring-select_disabled');
    });
  });

  describe('Options parser', function () {
    it('Should support syntax "item in items"', function () {
      scope.items = [{key: 1, label: 'test1'}];
      compileTemplate('<rg-select options="item in items" ng-model="selectedItem"></rg-select>');
      ctrl.config.onOpen();
      scope.$digest();
      ctrl.selectInstance.props.data.length.should.equal(1);
    });

    it('Should support "item for item in items"', function () {
      scope.items = [{key: 1, label: 'test1'}];
      compileTemplate('<rg-select options="item for item in items" ng-model="selectedItem"></rg-select>');
      ctrl.config.onOpen();
      scope.$digest();
      ctrl.selectInstance.props.data[0].key.should.equal(scope.items[0].key);
    });

    it('Should support labeling item', function () {
      compileTemplate('<rg-select options="item as item.name for item in items track by item.id" ng-model="selectedItem"></rg-select>');
      ctrl.selectInstance.state.selected.label.should.equal(fakeItems[2].name);
    });

    it('Should support labeling item simple syntax', function () {
      scope.items = [{key: 1, name: 'test1'}];
      scope.selectedItem = scope.items[0];
      compileTemplate('<rg-select options="item.name for item in items" ng-model="selectedItem"></rg-select>');
      ctrl.selectInstance.state.selected.label.should.equal('test1');
    });

    it('Should support function as label', function () {
      scope.getLabel = this.sinon.stub().returns('test label');

      compileTemplate('<rg-select options="getLabel(item) for item in items track by item.id" ng-model="selectedItem"></rg-select>');

      ctrl.optionsParser.getLabel(fakeItems[0]).should.equal('test label');
      scope.getLabel.should.been.calledWith(fakeItems[0]);
    });

    it('Should support custom key field with "track by" expression', function () {
      compileTemplate('<rg-select options="item in items track by item.id" ng-model="selectedItem"></rg-select>');

      ctrl.optionsParser.getKey(scope.selectedItem).should.equal(scope.selectedItem.id);
    });

    it('Should support custom label field', function () {
      scope.options = [{key: 1, name: 'testname'}];

      compileTemplate('<rg-select options="item.name for item in options"></rg-select>');

      ctrl.optionsParser.getLabel(scope.options[0]).should.equal(scope.options[0].name);
    });

    it('Should support description', function () {
      scope.options = [{key: 1, fullText: 'testname'}];

      compileTemplate('<rg-select options="item.name select as item.fullText for item in options"></rg-select>');

      ctrl.optionsParser.getSelectedLabel(scope.options[0]).should.equal(scope.options[0].fullText);
    });

    it('Should support selected label customization', function () {
      scope.options = [{key: 1, fullText: 'testname'}];

      compileTemplate('<rg-select options="item.name select as item.fullText for item in options"></rg-select>');

      ctrl.optionsParser.getSelectedLabel(scope.options[0]).should.equal(scope.options[0].fullText);
    });

    it('Should parse option variable name', function () {
      compileTemplate('<rg-select options="itemvar in items track by itemvar.id"></rg-select>');

      ctrl.optionsParser.optionVariableName.should.be.equal('itemvar');
    });
  });
});
