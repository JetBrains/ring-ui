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

    compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem"></rg-select>');
  }));

  describe('DOM', function () {
    it('Should place container for select inside directive', function () {
      element.should.have.descendants('span');
    });

    it('Should render select inside container', function () {
      element.should.have.descendants('.ring-select');
    });

    it('Should not render select if type=dropdown', function () {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem" type="dropdown"></rg-select>');

      element.should.not.have.descendants('.ring-select');
    });
  });

  describe('Interface', function () {
    it('Should receive ngModel controller', function () {
      ctrl.ngModelCtrl.should.to.be.defined;
    });

    it('Should extend passed config', function () {
      scope.config = {someField: 'test'};
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem" config="config"></rg-select>');

      ctrl.config.someField.should.equal('test');
    });

    it('Should work without ng-model', function () {
      var initDirective = function () {
        compileTemplate('<rg-select options="item.name for item in items track by item.id"></rg-select>');
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
      ctrl.config.onBeforeOpen();
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

    it('Should support description customization', function () {
      scope.selectedItem.testField = 'test';
      compileTemplate('<rg-select options="item.name describe as item.testField for item in items track by item.id" ng-model="selectedItem"></rg-select>');

      ctrl.config.selected.description.should.equal('test');
    });

    it('Should support description and selected label customization together', function () {
      scope.selectedItem.selectText = 'test';
      scope.selectedItem.descriptionText = 'description';
      compileTemplate('<rg-select options="item.name select as item.selectText describe as item.descriptionText for item in items track by item.id" ng-model="selectedItem"></rg-select>');

      ctrl.config.selected.selectedLabel.should.equal(scope.selectedItem.selectText);
      ctrl.config.selected.description.should.equal(scope.selectedItem.descriptionText);
    });

    it('Should not call get optoin by value for description customization', function () {
      scope.selectedItem.descriptionText = 'description';

      element = $compile('<rg-select options="item.name describe as item.descriptionText for item in items track by item.id" ng-model="selectedItem"></rg-select>')(scope);
      ctrl = element.controller('rgSelect');
      this.sinon.spy(ctrl.optionsParser, 'getOptions');
      scope.$digest();

      ctrl.optionsParser.getOptions.should.not.called;
    });

    it('Should not call get optoin by value for select label customization', function () {
      scope.selectedItem.selectText = 'Test';

      element = $compile('<rg-select options="item.name select as item.descriptionText for item in items track by item.id" ng-model="selectedItem"></rg-select>')(scope);
      ctrl = element.controller('rgSelect');
      this.sinon.spy(ctrl.optionsParser, 'getOptions');
      scope.$digest();

      ctrl.optionsParser.getOptions.should.not.called;
    });

    it('Should not call get option by value for description and selected label customization together', function () {
      scope.selectedItem.selectText = 'test';
      scope.selectedItem.descriptionText = 'description';

      element = $compile('<rg-select options="item.name select as item.selectText describe as item.descriptionText for item in items track by item.id" ng-model="selectedItem"></rg-select>')(scope);
      ctrl = element.controller('rgSelect');
      this.sinon.spy(ctrl.optionsParser, 'getOptions');
      scope.$digest();

      ctrl.optionsParser.getOptions.should.not.called;
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

    it('Should clear ng-model on clearing select', function () {
      ctrl.config.onChange(null);
      scope.$digest();
      should.not.exist(scope.selectedItem);
    });

    it('Should call datasource on opening', function () {
      scope.dataSource = this.sinon.stub().returns(fakeItems);

      compileTemplate('<rg-select options="item.name for item in dataSource(query) track by item.id" external-filter="true" ng-model="selectedItem"></rg-select>');

      ctrl.config.onBeforeOpen();
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

      compileTemplate('<rg-select options="item.name for item in items track by item.id" external-filter="true" ng-model="selectedItem"></rg-select>');

      ctrl.filter.fn().should.be.true;
    });

    it('Should be disabled if disabled', function () {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem" disabled="true"></rg-select>');

      $(element[0]).should.have.descendants('.ring-select_disabled');
    });

    it('Should hide on route changes ($locationChangeSuccess)', function () {
      ctrl.selectInstance._hidePopup = this.sinon.stub();

      scope.$broadcast('$locationChangeSuccess');
      ctrl.selectInstance._hidePopup.should.been.called;
    });

    it('Should extend select model with properties from ng model', function () {
      var selectModel = ctrl.convertNgModelToSelect({ext: 'test'});
      selectModel.ext.should.equal('test');
    });

    it('Should not try to extend select model with string', function () {
      this.sinon.spy(angular, 'extend');
      var stringValue = 'str-value';
      ctrl.convertNgModelToSelect(stringValue);
      angular.extend.should.been.calledWith(this.sinon.match({}), null);
    });
  });

  describe('Options parser', function () {
    it('Should support syntax "item in items"', function () {
      scope.items = [{key: 1, label: 'test1'}];
      compileTemplate('<rg-select options="item in items" ng-model="selectedItem"></rg-select>');
      ctrl.config.onBeforeOpen();
      scope.$digest();
      ctrl.selectInstance.props.data.length.should.equal(1);
    });

    it('Should support "item for item in items"', function () {
      scope.items = [{key: 1, label: 'test1'}];
      compileTemplate('<rg-select options="item for item in items" ng-model="selectedItem"></rg-select>');
      ctrl.config.onBeforeOpen();
      scope.$digest();
      ctrl.selectInstance.props.data[0].key.should.equal(scope.items[0].key);
    });

    it('Should support labeling item', function () {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem"></rg-select>');
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

    it('Should support custom property for ng-model', function () {
      var optionMock = {value: 1, label: 'label'};
      scope.options = [optionMock];
      scope.selectedOption = null;

      compileTemplate('<rg-select ng-model="selectedOption" options="item.value as item.label for item in options"></rg-select>');
      ctrl.config.onChange({originalModel: optionMock});

      scope.selectedOption.should.equal(optionMock.value);
    });

    it('Should update select if we pass custom ng-model', function () {
      var optionMock = {value: 1, label: 'label'};
      scope.options = [optionMock];
      scope.selectedOption = optionMock.value;

      compileTemplate('<rg-select ng-model="selectedOption" options="item.value as item.label for item in options" lazy="false"></rg-select>');

      ctrl.selectInstance.props.selected.label.should.equal(optionMock.label);
    });

    it('Should call only once data source function for primitive ng-model', function () {
      var createOptionMock = function (value) {
        return {
          value: value,
          label: 'label ' + value
        };
      };

      scope.options = [
        createOptionMock(1),
        createOptionMock(2),
        createOptionMock(3),
        createOptionMock(4)
      ];

      scope.selectedOption = scope.options[0];
      scope.getOptions = this.sinon.stub().returns(scope.options);

      compileTemplate('<rg-select ng-model="selectedOption" options="item.value as item.label for item in getOptions()"></rg-select>');
      ctrl.loadOptionsToSelect('');
      scope.$digest();

      scope.getOptions.should.been.calledOnce;
    });

    it('Should correct update select if options have  "track by" with "for" expressions without "as"', function () {
      compileTemplate('<rg-select ng-model="selectedItem" options="item.name for item in items track by item.id"></rg-select>');
      ctrl.config.onChange({originalModel: fakeItems[0]});
      scope.$digest();

      scope.selectedItem.should.equal(fakeItems[0]);
    });

    it('Should update select if list of options load after ng-model', function () {

      /**
       * In case `lazy=false` rg-select behave like angular select
       * It will watch options collection on every digest that may slowdown performance
       */
      scope.items = null;
      scope.selectedItem = fakeItems[0].id;
      compileTemplate('<rg-select ng-model="selectedItem" lazy="false" options="item.id as item.name for item in items track by item.id"></rg-select>');
      scope.$digest();

      scope.items = angular.copy(fakeItems);
      scope.$digest();

      ctrl.selectInstance.props.selected.label.should.equal(fakeItems[0].name);
    });

    it('Should update select if list of options load after ng-model and update existing array not changing reference', function () {
      scope.items = [];
      scope.selectedItem = fakeItems[0].id;
      compileTemplate('<rg-select ng-model="selectedItem" lazy="false" options="item.id as item.name for item in items track by item.id"></rg-select>');
      scope.$digest();

      scope.items = angular.extend(scope.items, fakeItems);
      scope.$digest();

      ctrl.selectInstance.props.selected.label.should.equal(fakeItems[0].name);
    });

    it('Should throw exception if we have two options with same ng-model value', function () {
      var optionMock = {value: 1, label: 'label'};
      scope.options = [optionMock, optionMock];
      scope.selectedOption = optionMock.value;

      var compile = function () {
        compileTemplate('<rg-select ng-model="selectedOption" options="item.value as item.label for item in options" lazy="false"></rg-select>');
      };

      compile.should.throw(Error);
    });

    it('Should parse option variable name', function () {
      compileTemplate('<rg-select options="itemvar in items track by itemvar.id"></rg-select>');

      ctrl.optionsParser.optionVariableName.should.be.equal('itemvar');
    });

    it('Should use select-type if defined', function () {
      compileTemplate('<button rg-select="" options="itemvar in items track by itemvar.id" select-type="dropdown" type="submit"></button>');

      ctrl.selectInstance.props.type.should.equal(Select.Type.CUSTOM);
    });

    it('Should return deselected item', function () {
      scope.selectedItem = scope.items[1];
      ctrl.config.onDeselect({originalModel: fakeItems[1]});
      scope.$digest();

      ctrl.selectInstance.props.selected.label.should.equal(fakeItems[1].name);
    });
  });
});
