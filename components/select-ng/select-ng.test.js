/* global inject */
/* eslint-disable no-magic-numbers */

import angular from 'angular';
import 'angular-mocks';

import Select from '../select/select';
import styles from '../select/select.css';

import SelectNg from './select-ng';

describe('Select Ng', () => {
  let scope;
  let element;
  let ctrl;
  let $compile;

  const fakeItems = [
    {id: 1, name: '11'},
    {id: 2, name: '22'},
    {id: 3, name: '33'}
  ];

  beforeEach(window.module(SelectNg));

  function compileTemplate(template) {
    element = $compile(template)(scope);
    ctrl = element.controller('rgSelect');
    scope.$digest();
  }

  beforeEach(inject(($rootScope, _$compile_) => {
    scope = $rootScope.$new();
    $compile = _$compile_;

    scope.items = angular.copy(fakeItems);
    scope.selectedItem = scope.items[2];
    scope.selectedItems = scope.items.slice(1);

    compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem"></rg-select>');
  }));

  describe('DOM', () => {
    it('Should place container for select inside directive', () => {
      element[0].should.contain('span');
    });

    it('Should render select inside container', () => {
      element[0].should.contain('[data-test=ring-select]');
    });

    it('Should not render select if type=dropdown', () => {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem" type="dropdown"></rg-select>');

      element[0].should.not.contain('[data-test=ring-select]');
    });
  });

  describe('Interface', () => {
    function selected(_ctrl) {
      return _ctrl.selectInstance.props.selected;
    }

    it('Should unmount react component on destroy', () => {
      initializeReactSelect(element[0]);
      ctrl.$onDestroy();
      should.not.exist(ctrl.selectInstance.node);
    });

    it('Should receive ngModel controller', () => {
      ctrl.ngModelCtrl.should.exist;
    });

    it('Should extend passed config', () => {
      scope.config = {someField: 'test'};
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem" config="config"></rg-select>');

      ctrl.config.someField.should.equal('test');
    });

    it('Should work without ng-model', () => {
      function initDirective() {
        compileTemplate('<rg-select options="item.name for item in items track by item.id"></rg-select>');
      }

      initDirective.should.not.throw;
    });

    it('Should update selected item on ngModel updates', () => {
      const newLabel = 'Some new label';
      scope.selectedItem.name = newLabel;
      scope.$digest();
      selected(ctrl).label.should.equal(newLabel);
    });

    it('Should clear selected item on ngModel clearing', () => {
      scope.selectedItem = null;
      scope.$digest();
      should.not.exist(selected(ctrl));
    });

    it('Should not get options on on initialization', () => {
      ctrl.selectInstance.props.data.length.should.equal(0);
    });

    it('Should get options on open', () => {
      ctrl.config.onBeforeOpen();
      scope.$digest();
      ctrl.selectInstance.props.data.length.should.equal(fakeItems.length);
    });

    it('Should convert ngModel to select supported object', () => {
      selected(ctrl).key.should.equal(scope.selectedItem.id);
      selected(ctrl).label.should.equal(scope.selectedItem.name);
    });

    it('Should convert options to select supported objects', () => {
      ctrl.loadOptionsToSelect();
      scope.$digest();
      ctrl.selectInstance.props.data[0].key.should.equal(fakeItems[0].id);
      ctrl.selectInstance.props.data[0].label.should.equal(fakeItems[0].name);
    });

    it('Should reject promise on loading error', inject($q => {
      const onError = sandbox.spy();
      sandbox.stub(ctrl, 'getOptions').returns($q.reject());
      ctrl.loadOptionsToSelect().catch(onError);
      scope.$digest();
      onError.should.be.called;
    }));

    it('Should use default type "Button" if type is not passed', () => {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem"></rg-select>');
      ctrl.selectInstance.props.type.should.equal(Select.Type.MATERIAL);
    });

    it('Should support type "input"', () => {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem" type="input"></rg-select>');
      ctrl.selectInstance.props.type.should.equal(Select.Type.INPUT);
    });

    it('Should support type "dropdown', () => {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem" type="dropdown"></rg-select>');
      ctrl.selectInstance.props.type.should.equal(Select.Type.CUSTOM);
    });

    it('Should support selectedLabelField customization', () => {
      scope.selectedItem.testField = 'test';
      compileTemplate('<rg-select options="item.name select as item.testField for item in items track by item.id" ng-model="selectedItem"></rg-select>');
      selected(ctrl).selectedLabel.should.equal('test');
    });

    it('Should support selected formatter function', () => {
      scope.formatter = sandbox.stub().returns('Formatted label');

      compileTemplate('<rg-select options="item.name select as formatter(item) for item in items track by item.id" external-filter="true" ng-model="selectedItem"></rg-select>');

      selected(ctrl).selectedLabel.should.equal('Formatted label');
    });

    it('Should support description customization', () => {
      scope.selectedItem.testField = 'test';
      compileTemplate('<rg-select options="item.name describe as item.testField for item in items track by item.id" ng-model="selectedItem"></rg-select>');

      selected(ctrl).description.should.equal('test');
    });

    it('Should support description and selected label customization together', () => {
      scope.selectedItem.selectText = 'test';
      scope.selectedItem.descriptionText = 'description';
      compileTemplate('<rg-select options="item.name select as item.selectText describe as item.descriptionText for item in items track by item.id" ng-model="selectedItem"></rg-select>');

      selected(ctrl).selectedLabel.should.equal(scope.selectedItem.selectText);
      selected(ctrl).description.should.equal(scope.selectedItem.descriptionText);
    });

    it('Should not call get option by value for description customization', () => {
      scope.selectedItem.descriptionText = 'description';

      element = $compile('<rg-select options="item.name describe as item.descriptionText for item in items track by item.id" ng-model="selectedItem"></rg-select>')(scope);
      ctrl = element.controller('rgSelect');
      sandbox.spy(ctrl.optionsParser, 'getOptions');
      scope.$digest();

      ctrl.optionsParser.getOptions.should.not.called;
    });

    it('Should not call get option by value for select label customization', () => {
      scope.selectedItem.selectText = 'Test';

      element = $compile('<rg-select options="item.name select as item.descriptionText for item in items track by item.id" ng-model="selectedItem"></rg-select>')(scope);
      ctrl = element.controller('rgSelect');
      sandbox.spy(ctrl.optionsParser, 'getOptions');
      scope.$digest();

      ctrl.optionsParser.getOptions.should.not.called;
    });

    it('Should not call get option by value for description and selected label customization together', () => {
      scope.selectedItem.selectText = 'test';
      scope.selectedItem.descriptionText = 'description';

      element = $compile('<rg-select options="item.name select as item.selectText describe as item.descriptionText for item in items track by item.id" ng-model="selectedItem"></rg-select>')(scope);
      ctrl = element.controller('rgSelect');
      sandbox.spy(ctrl.optionsParser, 'getOptions');
      scope.$digest();

      ctrl.optionsParser.getOptions.should.not.called;
    });

    it('Should save original model in select items', () => {
      ctrl.loadOptionsToSelect();
      scope.$digest();
      ctrl.selectInstance.props.data[0].originalModel.should.deep.equal(fakeItems[0]);
    });

    it('Should update ng-model on selecting', () => {
      ctrl.config.onChange({originalModel: fakeItems[0]});
      scope.$digest();
      scope.selectedItem.should.equal(fakeItems[0]);
    });

    it('Should clear ng-model on clearing select', () => {
      ctrl.config.onChange(null);
      scope.$digest();
      should.not.exist(scope.selectedItem);
    });

    it('Should call datasource on opening', () => {
      scope.dataSource = sandbox.stub().returns(fakeItems);

      compileTemplate('<rg-select options="item.name for item in dataSource(query) track by item.id" external-filter="true" ng-model="selectedItem"></rg-select>');

      ctrl.config.onBeforeOpen();
      scope.$digest();
      scope.dataSource.should.have.been.called;
    });

    it('Should call datasource on filtering if external filter enabled', () => {
      scope.dataSource = sandbox.stub().returns(fakeItems);

      compileTemplate('<rg-select options="item.name for item in dataSource(query) track by item.id" external-filter="true" ng-model="selectedItem"></rg-select>');

      ctrl.config.onFilter('test');
      scope.$digest();
      scope.dataSource.should.have.been.calledWith('test');
    });

    it('Should reload options with a controller query', () => {
      const queryMock = 'query';
      ctrl.query = queryMock;
      sandbox.spy(ctrl, 'loadOptionsToSelect');

      ctrl.config.reloadOptions();
      scope.$digest();

      ctrl.loadOptionsToSelect.should.have.been.calledWith(queryMock);
    });

    it('Should reload options with a provided query parameter', () => {
      const queryMock = 'query';
      ctrl.query = 'ctrlQuery';
      sandbox.spy(ctrl, 'loadOptionsToSelect');

      ctrl.config.reloadOptions(queryMock);
      scope.$digest();

      ctrl.loadOptionsToSelect.should.have.been.calledWith(queryMock);
    });

    it('If externalFilter enabled should provide custom filter.fn which should always return true', () => {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" external-filter="true" ng-model="selectedItem"></rg-select>');

      ctrl.filter.fn().should.be.true;
    });

    it('Should be disabled if disabled', () => {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem" ng-disabled="true"></rg-select>');

      element[0].should.contain(`.${styles.disabled}`);
    });

    it('Should hide on route changes ($locationChangeSuccess)', () => {
      sandbox.stub(ctrl.selectInstance._popup, 'isVisible').returns(true);
      ctrl.selectInstance._hidePopup = sandbox.stub();

      scope.$broadcast('$locationChangeSuccess');
      ctrl.selectInstance._hidePopup.should.have.been.called;
    });

    it('Should not try to hide on route changes if not showed ($locationChangeSuccess)', () => {
      sandbox.stub(ctrl.selectInstance._popup, 'isVisible').returns(false);
      ctrl.selectInstance._hidePopup = sandbox.stub();

      scope.$broadcast('$locationChangeSuccess');
      ctrl.selectInstance._hidePopup.should.not.have.been.called;
    });

    it('Should extend select model with properties from ng model', () => {
      const selectModel = ctrl.convertNgModelToSelect({ext: 'test'});
      selectModel.ext.should.equal('test');
    });

    it('Should not try to extend select model with string', () => {
      sandbox.spy(angular, 'extend');
      const stringValue = 'str-value';
      ctrl.convertNgModelToSelect(stringValue);
      angular.extend.should.been.calledWith(sandbox.match({}), null);
    });

    it('Should use select-type if defined', () => {
      compileTemplate('<button rg-select="" options="itemvar in items track by itemvar.id" select-type="dropdown" type="submit"></button>');

      ctrl.selectInstance.props.type.should.equal(Select.Type.CUSTOM);
    });

    it('Should use "multiple" attribute and provide it to select', () => {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" multiple="true" ng-model="selectedItems"></rg-select>');

      ctrl.selectInstance.props.multiple.should.be.true;
    });

    it('Should watch "multiple" and update select after change', () => {
      scope.selectMultiple = false;
      compileTemplate('<rg-select options="item.name for item in items track by item.id" multiple="selectMultiple" ng-model="selectedItems"></rg-select>');

      scope.selectMultiple = true;
      scope.$digest();
      ctrl.selectInstance.props.multiple.should.be.true;
    });

    it('Should return deselected item', () => {
      scope.selectedItem = scope.items[1];
      ctrl.config.onDeselect({originalModel: fakeItems[1]});
      scope.$digest();

      ctrl.selectInstance.props.selected.label.should.equal(fakeItems[1].name);
    });

    it('Should rerender with new config if config changed and autosync enabled', () => {
      scope.config = {};
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem" config="config" config-auto-update="true"></rg-select>');

      sandbox.spy(ctrl.selectInstance, 'rerender');
      scope.config.add = {label: 'fooo'};
      scope.$digest();

      ctrl.selectInstance.rerender.should.have.been.calledWith(sinon.match({add: {label: 'fooo'}}));
    });


    it('Should correctly reinitialize select with config', () => {
      const template = '<rg-select type="dropdown" options="item.name for item in items track by item.id" ng-model="selectedItem" config="config" config-auto-update="true"></rg-select>';
      scope.config = {};

      compileTemplate(template);
      initializeReactSelect(element[0]);
      scope.$digest();
      ctrl.$onDestroy();

      compileTemplate(template);
      initializeReactSelect(element[0]);
      scope.$digest();
    });


    it('Should update config and do not loose new selected items', () => {
      scope.config = {someField: 'AAA'};
      scope.selectedItem = [scope.items[1]];
      compileTemplate('<rg-select multiple=true options="item.name for item in items track by item.id" ng-model="selectedItem" config="config" config-auto-update="true"></rg-select>');

      selected(ctrl).length.should.equal(1);

      const newItems = [scope.items[0], scope.items[1]];
      scope.selectedItem = newItems;
      scope.$digest();
      selected(ctrl).length.should.equal(newItems.length);

      scope.config.someField = 'BBB';
      scope.$digest();

      selected(ctrl).length.should.equal(newItems.length);
    });
  });

  describe('Options parser', () => {
    it('Should support syntax "item in items"', () => {
      scope.items = [{key: 1, label: 'test1'}];
      scope.selectedItem = scope.items[0];

      compileTemplate('<rg-select options="item in items" ng-model="selectedItem"></rg-select>');
      ctrl.config.onBeforeOpen();
      scope.$digest();
      ctrl.selectInstance.props.data.length.should.equal(1);
    });

    it('Should support "item for item in items"', () => {
      scope.items = [{key: 1, label: 'test1'}];
      scope.selectedItem = scope.items[0];
      compileTemplate('<rg-select options="item as item.label for item in items" ng-model="selectedItem"></rg-select>');
      ctrl.config.onBeforeOpen();
      scope.$digest();
      ctrl.selectInstance.props.data[0].key.should.equal(scope.items[0].key);
    });

    it('Should support labeling item', () => {
      compileTemplate('<rg-select options="item.name for item in items track by item.id" ng-model="selectedItem"></rg-select>');
      ctrl.selectInstance.props.selected.label.should.equal(fakeItems[2].name);
    });

    it('Should support labeling item simple syntax', () => {
      scope.items = [{key: 1, name: 'test1'}];
      scope.selectedItem = scope.items[0];
      compileTemplate('<rg-select options="item.name for item in items" ng-model="selectedItem"></rg-select>');
      ctrl.selectInstance.props.selected.label.should.equal('test1');
    });

    it('Should support function as label', () => {
      scope.getLabel = sandbox.stub().returns('test label');

      compileTemplate('<rg-select options="getLabel(item) for item in items track by item.id" ng-model="selectedItem"></rg-select>');

      ctrl.optionsParser.getLabel(fakeItems[0]).should.equal('test label');
      scope.getLabel.should.been.calledWith(fakeItems[0]);
    });

    it('Should support custom key field with "track by" expression', () => {
      scope.items = [{id: 1, label: 'test1'}];
      scope.selectedItem = scope.items[0];
      compileTemplate('<rg-select options="item in items track by item.id" ng-model="selectedItem"></rg-select>');

      ctrl.optionsParser.getKey(scope.selectedItem).should.equal(scope.selectedItem.id);
    });

    it('Should support custom label field', () => {
      scope.options = [{key: 1, name: 'testname'}];

      compileTemplate('<rg-select options="item.name for item in options"></rg-select>');

      ctrl.optionsParser.getLabel(scope.options[0]).should.equal(scope.options[0].name);
    });

    it('Should support description', () => {
      scope.options = [{key: 1, fullText: 'testname'}];

      compileTemplate('<rg-select options="item.name select as item.fullText for item in options"></rg-select>');

      ctrl.optionsParser.getSelectedLabel(scope.options[0]).should.equal(scope.options[0].fullText);
    });

    it('Should support selected label customization', () => {
      scope.options = [{key: 1, fullText: 'testname'}];

      compileTemplate('<rg-select options="item.name select as item.fullText for item in options"></rg-select>');

      ctrl.optionsParser.getSelectedLabel(scope.options[0]).should.equal(scope.options[0].fullText);
    });

    it('Should pass selected to callback', () => {
      scope.options = [{key: 1, label: 'test'}];
      const selectedModel = {originalModel: scope.options[0]};
      scope.callback = sandbox.spy();

      compileTemplate('<rg-select options="item in options" on-select="callback(selected)"></rg-select>');
      ctrl.config.onSelect(selectedModel);
      scope.$digest();

      scope.callback.should.have.been.calledWith(selectedModel);
    });

    it('Should pass an event to a callback as a second parameter', () => {
      scope.event = {};
      scope.onSelect = sandbox.spy();
      scope.onDeselect = sandbox.spy();
      scope.onChange = sandbox.spy();
      scope.options = [{}];
      const model = {originalModel: scope.options[0]};

      compileTemplate('<rg-select options="item in options" on-change="onChange(selected,event)" on-select="onSelect(selected,event)" on-deselect="onDeselect(deselected,event)"></rg-select>');
      ctrl.config.onSelect(model, scope.event);
      ctrl.config.onChange(model, scope.event);
      ctrl.config.onDeselect(model, scope.event);
      scope.$digest();

      scope.onSelect.should.have.been.calledWith(model, scope.event);
      scope.onDeselect.should.have.been.calledWith(model, scope.event);
      scope.onChange.should.have.been.calledWith(model, scope.event);
    });

    it('Should take just plain option as label if option is string', () => {
      ctrl.optionsParser.getLabel('test').should.equal('test');
    });

    it('Should return no label if option is object and no valid label mapping provided', () => {
      should.not.exist(ctrl.optionsParser.getLabel({foo: 'bar'}));
    });

    it('Should support custom property for ng-model', () => {
      const optionMock = {value: 1, label: 'label'};
      scope.options = [optionMock];
      scope.selectedOption = null;

      compileTemplate('<rg-select ng-model="selectedOption" options="item.value as item.label for item in options"></rg-select>');
      ctrl.config.onChange({originalModel: optionMock});

      scope.selectedOption.should.equal(optionMock.value);
    });

    it('Should update select if we pass custom ng-model', () => {
      const optionMock = {value: 1, label: 'label'};
      scope.options = [optionMock];
      scope.selectedOption = optionMock.value;

      compileTemplate('<rg-select ng-model="selectedOption" options="item.value as item.label for item in options" lazy="false"></rg-select>');

      ctrl.selectInstance.props.selected.label.should.equal(optionMock.label);
    });

    it('Should call only once data source function for primitive ng-model', () => {
      function createOptionMock(value) {
        return {
          value,
          label: `label ${value}`
        };
      }

      scope.options = [
        createOptionMock(1),
        createOptionMock(2),
        createOptionMock(3),
        createOptionMock(4)
      ];

      scope.selectedOption = scope.options[0];
      scope.getOptions = sandbox.stub().returns(scope.options);

      compileTemplate('<rg-select ng-model="selectedOption" options="item.value as item.label for item in getOptions()"></rg-select>');
      ctrl.loadOptionsToSelect('');
      scope.$digest();

      scope.getOptions.should.been.calledOnce;
    });

    it('Should correct update select if options have  "track by" with "for" expressions without "as"', () => {
      compileTemplate('<rg-select ng-model="selectedItem" options="item.name for item in items track by item.id"></rg-select>');
      ctrl.config.onChange({originalModel: fakeItems[0]});
      scope.$digest();

      scope.selectedItem.should.equal(fakeItems[0]);
    });

    it('Should update select if list of options load after ng-model', () => {

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

    it('Should update select if list of options load after ng-model and update existing array not changing reference', () => {
      scope.items = [];
      scope.selectedItem = fakeItems[0].id;
      compileTemplate('<rg-select ng-model="selectedItem" lazy="false" options="item.id as item.name for item in items track by item.id"></rg-select>');
      scope.$digest();

      scope.items = angular.extend(scope.items, fakeItems);
      scope.$digest();

      ctrl.selectInstance.props.selected.label.should.equal(fakeItems[0].name);
    });

    it('Should throw exception if we have two options with same ng-model value', () => {
      const optionMock = {value: 1, label: 'label'};
      scope.options = [optionMock, optionMock];
      scope.selectedOption = optionMock.value;

      function compile() {
        compileTemplate('<rg-select ng-model="selectedOption" options="item.value as item.label for item in options" lazy="false"></rg-select>');
      }

      compile.should.throw(Error);
    });

    it('Should parse option variable name', () => {
      compileTemplate('<rg-select options="itemvar in items track by itemvar.id"></rg-select>');

      ctrl.optionsParser.optionVariableName.should.be.equal('itemvar');
    });

    it('should clear last query on close', () => {
      ctrl.query = 'query';
      ctrl.config.onClose();
      scope.$digest();

      should.not.exist(ctrl.query);
    });
  });

  function initializeReactSelect(node) {
    simulateClick(findContainerNode(node));
  }

  function simulateClick(node) {
    const clickEvent = new CustomEvent('click');
    node.dispatchEvent(clickEvent);
  }

  function findContainerNode(node) {
    return node.querySelector('span');
  }
});
