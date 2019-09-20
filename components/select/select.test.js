/* eslint-disable no-magic-numbers, react/no-find-dom-node */
import React from 'react';
import {findDOMNode} from 'react-dom';
import {Simulate} from 'react-dom/test-utils';
import {shallow, mount} from 'enzyme';

import List from '../list/list';
import Input from '../input/input';
import sniffr from '../global/sniffer';
import simulateCombo from '../../test-helpers/simulate-combo';

import Select from './select';
import styles from './select.css';

const isIE11 = sniffr.browser.name === 'ie' && sniffr.browser.versionString === '11.0';

function simulateInput(target, value) {
  target.value = value;

  Simulate.change(target, {target});

  if (isIE11) {
    Simulate.input(target, {target: {value}});
  }
}

const selectedIconSelector = `.${styles.selectedIcon.split(/\s/)[0]}`;

describe('Select', () => {
  const testData = [
    {key: 1, label: 'first1', type: List.ListProps.Type.ITEM},
    {key: 2, label: 'test2', type: List.ListProps.Type.ITEM},
    {key: 3, label: 'test3', type: List.ListProps.Type.ITEM},
    {key: 4, label: 'four4', selectedLabel: '', type: List.ListProps.Type.ITEM}
  ];

  const defaultProps = () => ({
    data: testData,
    selected: testData[0],
    onChange: sandbox.spy(),
    onFilter: sandbox.spy(),
    onFocus: sandbox.spy(),
    onBlur: sandbox.spy(),
    filter: true
  });

  let mountWrapper;
  const shallowSelect = props => shallow(<Select {...defaultProps()} {...props}/>);
  const mountSelect = props => {
    mountWrapper = mount(<Select {...defaultProps()} {...props}/>);
    return mountWrapper;
  };

  afterEach(() => {
    if (mountWrapper) {
      mountWrapper.unmount();
      mountWrapper = null;
    }
  });

  it('Should initialize', () => {
    shallowSelect().should.exist;
  });

  it('Should save selected item in state', () => {
    const wrapper = mountSelect();
    wrapper.should.have.state('selected', wrapper.prop('selected'));
  });

  it('Should provide select types', () => {
    Select.Type.should.exist;
    Select.Type.BUTTON.should.exist;
    Select.Type.INPUT.should.exist;
    Select.Type.CUSTOM.should.exist;
    Select.Type.MATERIAL.should.exist;
    Select.Type.INLINE.should.exist;
  });

  it('Should take provided className', () => {
    const wrapper = shallowSelect({className: 'foo-bar'});
    wrapper.should.have.className('foo-bar');
  });

  it('Should compute selected index', () => {
    const instance = shallowSelect().instance();
    const selectedIndex = instance._getSelectedIndex(testData[2], testData);
    selectedIndex.should.equal(2);
  });

  it('should update rendered data if props change', () => {
    const wrapper = shallowSelect();
    wrapper.setProps({data: [testData[0]]});
    wrapper.state('shownData').should.deep.equal([testData[0]]);
  });

  it('Should use selectedLabel for select button title if provided', () => {
    const wrapper = shallowSelect({
      selected: {
        key: 1, label: 'test1', selectedLabel: 'testLabel'
      }
    });
    const instance = wrapper.instance();
    const selectedLabel = instance._getSelectedString();
    selectedLabel.should.equal('testLabel');
  });

  it('Should use label for select button title', () => {
    const instance = shallowSelect().instance();
    const selectedLabel = instance._getSelectedString();
    selectedLabel.should.equal('first1');
  });

  it('Should clear selected on clearing', () => {
    const wrapper = shallowSelect();
    const instance = wrapper.instance();
    instance.clear();
    wrapper.should.have.state('selected', null);
  });

  it('Should call onChange on clearing', () => {
    const wrapper = mountSelect();
    const instance = wrapper.instance();
    instance.clear();
    wrapper.prop('onChange').should.be.calledOnce;
    wrapper.prop('onChange').should.be.called.calledWith(null);
  });

  it('Should pass selected item and event to onChange', () => {
    const wrapper = mountSelect();
    const instance = wrapper.instance();
    instance._listSelectHandler({item: 'foo'}, {nativeEvent: 'foo'});
    wrapper.prop('onChange').should.be.called.calledWith({item: 'foo'}, {nativeEvent: 'foo'});
  });

  it('Should clear selected when rerendering with no selected item', () => {
    const wrapper = shallowSelect();
    wrapper.setProps({selected: null});
    wrapper.should.have.state('selected', null);
  });

  it('Should handle UP, DOWN and ENTER shortcuts', () => {
    const wrapper = shallowSelect();
    const instance = wrapper.instance();
    const shortcutsMap = instance.getShortcutsMap();
    shortcutsMap.enter.should.exist;
    shortcutsMap.up.should.exist;
    shortcutsMap.down.should.exist;
  });

  it('Should generate unique scope for shortcuts', () => {
    const firstTimeScope = shallowSelect().instance().shortcutsScope;
    const secondTimeScope = shallowSelect().instance().shortcutsScope;
    secondTimeScope.should.not.be.equal(firstTimeScope);
  });

  it('Should open popup on key handling if not opened', () => {
    const wrapper = mountSelect({type: Select.Type.INPUT});
    const instance = wrapper.instance();
    instance._showPopup = sandbox.spy();
    wrapper.setState({focused: true});
    instance._inputShortcutHandler();
    instance._showPopup.should.be.calledOnce;
  });

  it('Should not open popup if disabled', () => {
    const wrapper = mountSelect({disabled: true});
    const instance = wrapper.instance();
    instance._showPopup = sandbox.spy();
    instance._clickHandler();
    instance._showPopup.should.not.be.called;
  });

  it('Should close popup on click if it is already open', () => {
    const wrapper = mountSelect();
    const instance = wrapper.instance();
    instance._hidePopup = sandbox.spy();
    instance._showPopup();
    instance._clickHandler();
    instance._hidePopup.should.be.called;
  });

  it('Should call onAdd on adding', () => {
    const wrapper = mountSelect({onAdd: sandbox.spy()});
    const instance = wrapper.instance();
    instance.addHandler();
    wrapper.prop('onAdd').should.be.calledOnce;
  });

  it('Should call onFocus on input focus', () => {
    const wrapper = mountSelect({type: Select.Type.INPUT});
    const instance = wrapper.instance();

    Simulate.focus(instance.filter);
    wrapper.prop('onFocus').should.be.called;
  });

  it('Should call onBlur on input blur', () => {
    const wrapper = mountSelect({type: Select.Type.INPUT});
    const instance = wrapper.instance();

    Simulate.blur(instance.filter);
    wrapper.prop('onBlur').should.be.called;
  });

  it('Should close popup if input lost focus in INPUT mode', () => {
    sandbox.useFakeTimers({toFake: ['setTimeout']});
    const wrapper = mountSelect({type: Select.Type.INPUT});
    const instance = wrapper.instance();
    instance._showPopup();

    Simulate.blur(instance.filter);
    sandbox.clock.tick();
    instance._popup.props.hidden.should.be.true;
  });

  it('Should not close popup while clicking on popup in INPUT mode', () => {
    sandbox.useFakeTimers({toFake: ['setTimeout']});
    const wrapper = mountSelect({type: Select.Type.INPUT});
    const instance = wrapper.instance();
    instance._showPopup();

    Simulate.mouseDown(findDOMNode(instance._popup.list));
    Simulate.blur(instance.filter);
    sandbox.clock.tick();
    instance._popup.props.hidden.should.be.false;
  });

  describe('componentWillReceiveProps', () => {

    let wrapper;
    let instance;
    beforeEach(() => {
      wrapper = shallowSelect();
      instance = wrapper.instance();
    });


    beforeEach(() => {
      sandbox.stub(instance, 'setState');
      sandbox.stub(instance, '_handleMultipleToggling');
    });


    it('Should update shown data', () => {
      instance.UNSAFE_componentWillReceiveProps({data: []});

      instance.setState.should.be.calledWithMatch({shownData: []});
    });

    it('Should not update shown data if data is not passed', () => {
      instance.UNSAFE_componentWillReceiveProps({});

      instance.setState.should.not.be.calledWithMatch({shownData: sandbox.match.defined});
    });

    it('Should not update shown data if data the same as previous', () => {
      instance.UNSAFE_componentWillReceiveProps({data: instance.props.data});

      instance.setState.should.not.be.calledWithMatch({shownData: sandbox.match.defined});
    });

    it('Should toggle multiple state', () => {
      const newMultiple = !instance.props.multiple;
      instance.UNSAFE_componentWillReceiveProps({multiple: newMultiple});

      instance._handleMultipleToggling.should.be.calledWith(newMultiple);
    });

    it('Should not toggle multiple state if value the same as previous', () => {
      const newMultiple = instance.props.multiple;
      instance.UNSAFE_componentWillReceiveProps({multiple: newMultiple});

      instance._handleMultipleToggling.should.not.be.called;
    });

    it('Should update selected index for select', () => {
      const selectedItem = createItem();

      instance.props = {multiple: false, selected: null, data: [selectedItem, createItem()]};

      instance.UNSAFE_componentWillReceiveProps({
        selected: selectedItem,
        data: instance.props.data
      });

      instance.setState.should.be.calledWithMatch({selectedIndex: sandbox.match.defined});
    });

    it('Should not update selected index if selected is the same as previous', () => {
      const selectedItem = createItem();

      instance.props = {
        multiple: false,
        selected: selectedItem,
        data: [selectedItem, createItem()]
      };

      instance.UNSAFE_componentWillReceiveProps({
        selected: selectedItem,
        data: instance.props.data
      });

      instance.setState.should.not.be.calledWithMatch({selectedIndex: sandbox.match.defined});
    });

    it('Should update selected index for multiple select if selected is changed', () => {
      const selectedItem = createItem();

      instance.props = {multiple: true, selected: [], data: [selectedItem]};

      instance.UNSAFE_componentWillReceiveProps({selected: [selectedItem]});

      instance.setState.should.be.calledWithMatch({selectedIndex: 0});
    });

    it('Should update selected index for multiple select if selected is changed but count of element is the same', () => {
      const selectedItem = createItem();

      instance.props = {multiple: true, selected: [], data: [selectedItem, createItem()]};

      instance.UNSAFE_componentWillReceiveProps({selected: [selectedItem, createItem()]});

      instance.setState.should.be.calledWithMatch({selectedIndex: 0});
    });

    it('Should not update selected index for multiple select if selected is not changed', () => {
      const selectedItem = createItem();

      instance.props = {multiple: true, selected: [], data: [selectedItem]};

      instance.UNSAFE_componentWillReceiveProps({});

      instance.setState.should.not.be.calledWithMatch({selectedIndex: sandbox.match.defined});
    });

    it('Should not update selected index for multiple select if items inside the selected list are the same and order is same', () => {
      const selectedItem1 = createItem();
      const selectedItem2 = createItem();

      instance.props = {
        multiple: true,
        selected: [selectedItem1, selectedItem2],
        data: [selectedItem1, createItem(), selectedItem2]
      };

      instance.UNSAFE_componentWillReceiveProps({selected: [selectedItem1, selectedItem2]});

      instance.setState.should.not.be.calledWithMatch({selectedIndex: sandbox.match.defined});
    });

    it('Should not update selected index for multiple select if items inside the selected list are the same but order is changed', () => {
      const selectedItem1 = createItem();
      const selectedItem2 = createItem();

      instance.props = {
        multiple: true,
        selected: [selectedItem1, selectedItem2],
        data: [selectedItem1, createItem(), selectedItem2]
      };

      instance.UNSAFE_componentWillReceiveProps({selected: [selectedItem2, selectedItem1]});

      instance.setState.should.not.be.calledWithMatch({selectedIndex: sandbox.match.defined});
    });

    function createItem() {
      createItem.key = (createItem.key || 0) + 1;
      return {key: createItem.key};
    }
  });

  describe('DOM', () => {
    it('Should place select button inside container', () => {
      const wrapper = shallowSelect();
      wrapper.should.have.className(styles.select);
    });

    it('Should disable select button if needed', () => {
      const wrapper = mountSelect({
        disabled: true
      });
      wrapper.should.have.className(styles.disabled);
      wrapper.instance().button.should.have.attr('disabled');
    });

    it('Should not disable select button if not needed', () => {
      const wrapper = mountSelect({
        disabled: false
      });
      wrapper.instance().button.should.not.have.attr('disabled');
    });

    it('Should place input inside in INPUT mode', () => {
      const wrapper = shallowSelect({type: Select.Type.INPUT});
      wrapper.should.have.descendants(Input);
    });

    it('Should place icons inside', () => {
      const wrapper = shallowSelect();
      wrapper.should.have.descendants(`.${styles.icons}`);
    });

    it('Should add selected item icon to button', () => {
      const wrapper = shallowSelect({
        selected: {
          key: 1,
          label: 'test',
          icon: 'fakeImageUrl'
        }
      });
      wrapper.should.have.descendants(selectedIconSelector);
    });

    it('Should not display selected item icon if it is not provided', () => {
      const wrapper = shallowSelect({selected: {key: 1, label: 'test', icon: null}});
      wrapper.should.not.have.descendants(selectedIconSelector);
    });

    it('Should display selected item icon', () => {
      const wrapper = mountSelect({
        selected: {
          key: 1,
          label: 'test',
          icon: 'http://fake.image/'
        }
      });
      const icon = wrapper.find(selectedIconSelector).getDOMNode();
      icon.style.backgroundImage.should.contain('http://fake.image/');
    });

    it('Should place icons inside in INPUT mode', () => {
      const wrapper = shallowSelect({type: Select.Type.INPUT});
      wrapper.should.have.descendants(`.${styles.icons}`);
    });

    it('Should open select dropdown on click', () => {
      const wrapper = shallowSelect();
      const instance = wrapper.instance();
      sandbox.spy(instance, '_showPopup');
      wrapper.find('button').simulate('click');

      instance._showPopup.should.be.called;
    });

    describe('Bottom toolbar', () => {
      it('Should not add "Add" button if enabled but filter query is empty', () => {
        const wrapper = mountSelect({add: {}});
        const instance = wrapper.instance();
        instance.filterValue = sandbox.stub().returns('');
        instance._showPopup();
        instance._popup.popup.popup.should.not.contain('.ring-select__button');
      });

      it('Should add "Add" button if enabled and filter query not empty', () => {
        const wrapper = mountSelect({add: {}});
        const instance = wrapper.instance();
        instance.filterValue = sandbox.stub().returns('test');
        instance._showPopup();
        instance._popup.popup.popup.should.contain(`.${styles.button}`);
      });

      it('Should add "Add" button if alwaysVisible is set', () => {
        const wrapper = mountSelect({
          add: {
            alwaysVisible: true
          }
        });
        const instance = wrapper.instance();
        instance._showPopup();
        instance._popup.popup.popup.should.contain(`.${styles.button}`);
      });

      it('Should place label instead filterValue to "Add" button if alwaysVisible is set', () => {
        const wrapper = mountSelect({
          add: {
            alwaysVisible: true,
            label: 'Add Something'
          }
        });
        const instance = wrapper.instance();
        instance._showPopup();
        const addButton = instance._popup.popup.popup.query(`.${styles.button}`);

        addButton.should.contain.text('Add Something');
      });

      it('Should add hint if specified', () => {
        const wrapper = mountSelect({
          hint: 'blah blah'
        });
        const instance = wrapper.instance();
        instance._showPopup();
        instance._popup.popup.popup.should.contain('[data-test=ring-list-hint]');
      });

      it('Hint should be placed under "add" button', () => {
        const wrapper = mountSelect({
          add: {},
          hint: 'blah blah'
        });
        const instance = wrapper.instance();
        instance._showPopup();
        const hint = instance._popup.popup.popup.queryAll('[data-test=ring-list-hint]');

        hint.should.exist;
      });
    });
  });

  describe('getListItems', () => {
    it('Should filter items by label', () => {
      const wrapper = shallowSelect();
      const instance = wrapper.instance();
      const filtered = instance.getListItems('test3');
      filtered.length.should.equal(1);
      filtered[0].label.should.equal('test3');
    });

    it('Should filter items by part of label', () => {
      const wrapper = shallowSelect();
      const instance = wrapper.instance();
      const filtered = instance.getListItems('test');
      filtered.length.should.equal(2);
    });

    it('Should not filter separators', () => {
      const separators = [{
        type: List.ListProps.Type.SEPARATOR,
        key: 1,
        description: 'test'
      }];
      const wrapper = shallowSelect({data: separators});
      const instance = wrapper.instance();

      const filtered = instance.getListItems('foo');
      filtered.should.deep.equal(separators);
    });

    it('Should not filter hints', () => {
      const hints = [{
        type: List.ListProps.Type.HINT,
        key: 1,
        description: 'test'
      }];
      const wrapper = shallowSelect({data: hints});
      const instance = wrapper.instance();

      const filtered = instance.getListItems('foo');
      filtered.should.deep.equal(hints);
    });

    it('Should filter custom items with label', () => {
      const customItems = [{
        type: List.ListProps.Type.CUSTOM,
        key: 1,
        label: 'bar',
        template: <div/>
      }];
      const wrapper = shallowSelect({data: customItems});
      const instance = wrapper.instance();

      const filtered = instance.getListItems('foo');
      filtered.should.deep.equal([]);
    });

    it('Should not filter items without label', () => {
      const items = [{
        key: 1,
        description: 'test'
      }];
      const wrapper = shallowSelect({data: items});
      const instance = wrapper.instance();

      const filtered = instance.getListItems('foo');
      filtered.should.deep.equal(items);
    });

    it('Should use custom filter.fn if provided', () => {
      const filterStub = sandbox.stub().returns(true);

      const wrapper = shallowSelect({
        filter: {fn: filterStub}
      });
      const instance = wrapper.instance();

      const filtered = instance.getListItems('test3');

      filtered.length.should.equal(testData.length);
      filterStub.should.have.callCount(4);
    });

    it('Should write filter query on add button if enabled', () => {
      const wrapper = shallowSelect({
        add: {
          prefix: 'Add some'
        }
      });
      const instance = wrapper.instance();

      instance.getListItems('foo');

      instance._addButton.label.should.equal('foo');
    });
  });

  describe('Filtering', () => {
    it('Should call onFilter on input changes', () => {
      const wrapper = mountSelect();
      const instance = wrapper.instance();
      wrapper.setState({
        focused: true,
        showPopup: true
      });
      simulateInput(instance._popup.filter, 'a');
      wrapper.prop('onFilter').should.be.called;
    });

    it('Should save input changes', () => {
      const wrapper = mountSelect();
      const instance = wrapper.instance();
      wrapper.setState({showPopup: true});
      simulateInput(instance._popup.filter, 'a');
      wrapper.should.have.state('filterValue', 'a');
    });

    it('Should open popup on input changes if in focus', () => {
      const wrapper = mountSelect({type: Select.Type.INPUT});
      const instance = wrapper.instance();
      instance._showPopup = sandbox.spy();
      wrapper.setState({focused: true});
      simulateInput(instance.filter, 'a');
      instance._showPopup.should.be.called;
    });

    it('should filter if not focused but not in input mode', () => {
      const wrapper = mountSelect({type: Select.Type.MATERIAL});
      const instance = wrapper.instance();
      wrapper.setState({showPopup: true});
      simulateInput(instance._popup.filter, 'a');

      wrapper.prop('onFilter').should.be.called;
    });

    it('Should not open popup on input changes if not in focus', () => {
      const wrapper = mountSelect({type: Select.Type.INPUT});
      const instance = wrapper.instance();

      instance._showPopup = sandbox.spy();
      simulateInput(instance.filter, 'a');
      instance._showPopup.should.not.be.called;
    });

    it('Should return empty string if not input mode and filter is disabled', () => {
      const wrapper = shallowSelect({filter: false, type: Select.Type.MATERIAL});
      const instance = wrapper.instance();

      instance.filterValue().should.equal('');
    });

    it('Should return input value if input mode enabled', () => {
      const wrapper = mountSelect({filter: false, type: Select.Type.INPUT});
      const instance = wrapper.instance();
      wrapper.setState({focused: true});
      simulateInput(instance.filter, 'test input');
      instance.filterValue().should.equal('test input');
    });

    it('Should set value to popup input if passed', () => {
      const wrapper = mountSelect();
      const instance = wrapper.instance();
      instance._showPopup();
      instance.filterValue('test');
      findDOMNode(instance._popup.filter).value.should.equal('test');
    });

    it('Should set target input value in input mode', () => {
      const wrapper = mountSelect({filter: false, type: Select.Type.INPUT});
      const instance = wrapper.instance();

      wrapper.setState({focused: true});
      instance.filterValue('test');
      instance.filter.value.should.equal('test');
    });

    it('Should clear filter value when closing', () => {
      const wrapper = mountSelect();
      const instance = wrapper.instance();
      instance.filterValue('test');
      instance._showPopup();
      instance._hidePopup();
      instance._showPopup();
      findDOMNode(instance._popup.filter).value.should.equal('');
    });
  });

  describe('Multiple', () => {
    const defaultPropsMultiple = () => ({
      data: testData,
      selected: testData.slice(0, 2),
      filter: true,
      multiple: true,
      onChange: sandbox.spy()
    });

    const shallowSelectMultiple = props => shallow(
      <Select {...defaultPropsMultiple()} {...props}/>
    );
    const mountSelectMultiple = props => {
      mountWrapper = mount(
        <Select {...defaultPropsMultiple()} {...props}/>
      );
      return mountWrapper;
    };

    it('Should fill _multipleMap on initialization', () => {
      const wrapper = mountSelectMultiple();
      const instance = wrapper.instance();
      instance._multipleMap['1'].should.be.true;
    });

    it('Should fill _multipleMap on _rebuildMultipleMap', () => {
      const wrapper = mountSelectMultiple();
      const instance = wrapper.instance();
      instance._rebuildMultipleMap(testData.slice(1, 2));
      instance._multipleMap['2'].should.be.true;
    });

    it('Should construct label from selected array', () => {
      const wrapper = shallowSelectMultiple();
      const instance = wrapper.instance();
      const selectedLabel = instance._getSelectedString();
      selectedLabel.should.equal('first1, test2');
    });

    it('Should skip empty labels', () => {
      const wrapper = shallowSelectMultiple({
        selected: testData.slice(2)
      });
      const instance = wrapper.instance();
      const selectedLabel = instance._getSelectedString();
      selectedLabel.should.equal('test3');
    });

    it('Should detect selection is empty according on not empty array', () => {
      const wrapper = shallowSelectMultiple();
      const instance = wrapper.instance();
      instance._selectionIsEmpty().should.be.false;
    });

    it('Should detect selection is empty according on empty array', () => {
      const wrapper = shallowSelectMultiple({selected: []});
      const instance = wrapper.instance();
      instance._selectionIsEmpty().should.be.true;
    });

    it('Should clear selected on clearing', () => {
      const wrapper = shallowSelectMultiple();
      const instance = wrapper.instance();
      instance.clear();
      wrapper.state('selected').length.should.equal(0);
    });

    it('Should call onChange on clearing', () => {
      const wrapper = mountSelectMultiple();
      const instance = wrapper.instance();
      instance.clear();
      wrapper.prop('onChange').should.be.calledOnce;
      wrapper.prop('onChange').should.be.called.calledWith([]);
    });

    it('Should clear selected when rerendering with no selected item in multiple mode', () => {
      const wrapper = shallowSelectMultiple();
      wrapper.setProps({selected: null});
      wrapper.state('selected').should.deep.equal([]);
    });

    it('Should update selected checkboxes on selected update', () => {
      const wrapper = shallowSelectMultiple();
      const instance = wrapper.instance();
      wrapper.setProps({selected: []});
      instance.getListItems(instance.filterValue())[0].checkbox.should.be.false;
    });

    describe('On selecting', () => {
      let wrapper;
      let instance;
      beforeEach(() => {
        wrapper = mountSelectMultiple();
        instance = wrapper.instance();
      });

      it('Should add item to multiple map on selecting item', () => {
        instance._listSelectHandler(testData[3]);
        instance._multipleMap['4'].should.be.true;
      });

      it('Should select just picked item on selecting by clicking item', () => {
        const lengthBefore = testData.slice(0, 2).length;
        instance._listSelectHandler(testData[3]);
        wrapper.state('selected').length.should.equal(lengthBefore + 1);
      });

      it('Should add item to selection on clicking by checkbox', () => {
        const lengthBefore = testData.slice(0, 2).length;
        instance._listSelectHandler(testData[3], {
          originalEvent: {
            target: {
              matches: () => true
            }
          }
        });
        wrapper.state('selected').length.should.equal(lengthBefore + 1);
      });

      it('Should close popup on selecting by item', () => {
        instance._hidePopup = sandbox.spy();
        instance._listSelectHandler(testData[3], {
          originalEvent: {
            target: {
              matches: () => false
            }
          }
        });
        instance._hidePopup.should.have.been.called;
      });

      it('Should not close popup on selecting by checkbox', () => {
        instance._hidePopup = sandbox.spy();
        instance._listSelectHandler(testData[3], {}, {tryKeepOpen: true});
        instance._hidePopup.should.not.be.called;
      });

      it('Should reset filter', () => {
        wrapper.setState({filterValue: 'query'});
        instance._listSelectHandler(testData[3]);
        wrapper.state('filterValue').should.equal('');
      });
    });

    describe('On deselecting', () => {
      it('Should remove item from selected on deselecting', () => {
        const wrapper = mountSelectMultiple();
        const instance = wrapper.instance();
        const lengthBefore = testData.slice(0, 2).length;
        instance._listSelectHandler(testData[0]);
        wrapper.state('selected').length.should.equal(lengthBefore - 1);
      });

      it('Should call onDeselect on deselecting item', () => {
        const wrapper = mountSelectMultiple({
          onDeselect: sandbox.spy()
        });
        const instance = wrapper.instance();
        instance._listSelectHandler(testData[0]);
        wrapper.prop('onDeselect').should.be.calledWith(testData[0]);
      });
    });

  });

  describe('On selecting', () => {
    it('Should not react on selecting disabled element', () => {
      const wrapper = shallowSelect();
      const instance = wrapper.instance();
      instance.setState = sandbox.spy();

      instance._listSelectHandler({
        key: 1,
        label: 'test',
        disabled: true
      });

      instance.setState.should.not.be.called;
    });

    it('Should not react on selecting separator', () => {
      const wrapper = shallowSelect();
      const instance = wrapper.instance();
      instance.setState = sandbox.spy();

      instance._listSelectHandler({
        key: 1,
        label: 'test',
        rgItemType: List.ListProps.Type.SEPARATOR
      });

      instance.setState.should.not.be.called;
    });

    it('Should react on selecting custom item', () => {
      const wrapper = shallowSelect();
      const instance = wrapper.instance();
      instance.setState = sandbox.spy();

      instance._listSelectHandler({
        key: 1,
        label: 'test',
        type: List.ListProps.Type.CUSTOM
      });

      instance.setState.should.be.called;
    });

    it('Should set selected on selecting', () => {
      const wrapper = shallowSelect();
      const instance = wrapper.instance();
      instance._listSelectHandler(testData[3]);
      wrapper.should.have.state('selected', testData[3]);
    });

    it('Should set call onSelect on selecting', () => {
      const wrapper = mountSelect({
        onSelect: sandbox.spy()
      });
      const instance = wrapper.instance();
      instance._listSelectHandler(testData[1]);
      wrapper.prop('onSelect').should.be.calledOnce;
    });

    it('Should set call onChange on selecting', () => {
      const wrapper = mountSelect({
        onChange: sandbox.spy()
      });
      const instance = wrapper.instance();
      instance._listSelectHandler(testData[1]);
      wrapper.prop('onChange').should.be.calledOnce;
    });

    it('Should hide popup on selecting', () => {
      const wrapper = mountSelect();
      const instance = wrapper.instance();
      instance._hidePopup = sandbox.spy();
      instance._listSelectHandler(testData[1]);
      instance._hidePopup.should.be.calledOnce;
    });
  });

  describe('Popup', () => {
    let container;
    const mountSelectToContainer = props => {
      mountWrapper = mount(
        <Select {...props}/>,
        {
          attachTo: container
        }
      );
    };
    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
      container = null;
    });

    it('Should pass loading message and indicator to popup if loading', () => {
      const wrapper = mountSelect({loading: true, loadingMessage: 'test message'});
      const instance = wrapper.instance();
      instance._popup.rerender = sandbox.stub();
      instance._showPopup();
      instance._popup.props.message.should.equal('test message');
      instance._popup.props.loading.should.be.true;
    });

    it('Should pass notFoundMessage message to popup if not loading and data is empty', () => {
      const wrapper = mountSelect({data: [], notFoundMessage: 'test not found'});
      const instance = wrapper.instance();
      instance._popup.rerender = sandbox.stub();
      instance._showPopup();
      instance._popup.props.message.should.equal('test not found');
    });

    describe('filter focusing', () => {
      const SHOW_TIMEOUT = 300;

      beforeEach(() => {
        mountSelectToContainer({filter: true});
      });

      it('Should focus the filter on opening', done => {
        const instance = mountWrapper.instance();
        instance._showPopup();
        // Can't use fake timers here, as Popup redraws by requestAnimationFrame.
        // Stabbing it isn't possible either, as it hangs IE11
        setTimeout(() => {
          instance._popup.filter.should.equal(document.activeElement);
          done();
        }, SHOW_TIMEOUT);
      });

      it('Should focus the filter on second opening', done => {
        const instance = mountWrapper.instance();
        instance._showPopup();
        instance._hidePopup();
        instance._showPopup();
        setTimeout(() => {
          instance._popup.filter.should.equal(document.activeElement);
          done();
        }, SHOW_TIMEOUT);
      });
    });

    it('Should restore focus on select in button mode after closing popup', () => {
      mountSelectToContainer({
        data: testData,
        filter: true
      });
      const instance = mountWrapper.instance();

      instance._showPopup();
      instance._hidePopup(true);
      document.activeElement.should.equal(instance.button);
    });

    describe('Focus after close', () => {
      let instance;
      let targetInput;
      beforeEach(() => {
        targetInput = document.createElement('input');
        document.body.appendChild(targetInput);

        mountSelectToContainer({
          data: testData,
          filter: true,
          targetElement: targetInput
        });
        instance = mountWrapper.instance();

        instance._showPopup();
      });

      afterEach(() => {
        document.body.removeChild(targetInput);
        targetInput = null;
      });

      it('Should restore focus on provided target element after closing popup', () => {
        instance._hidePopup(true);

        targetInput.should.equal(document.activeElement);
      });

      it('Should restore focus on provided target element after closing popup with keyboard', () => {
        simulateCombo('esc');
        targetInput.should.equal(document.activeElement);
      });

      it('Should not restore focus on provided target element after closing popup with not keyboard event', () => {
        Simulate.click(document.body);

        targetInput.should.not.equal(document.activeElement);
      });

      it('Should not restore focus on provided target element after closing popup', () => {
        instance._hidePopup();

        targetInput.should.not.equal(document.activeElement);
      });
    });

  });

  describe('_resetMultipleSelectionMap', () => {
    let instance;
    beforeEach(() => {
      instance = shallowSelect().instance();
    });

    it('should reset map', () => {
      instance._multipleMap[0] = true;

      instance._resetMultipleSelectionMap();

      Object.keys(instance._multipleMap).length.
        should.be.equal(0);
    });
  });


  describe('_getResetOption', () => {
    let instance;

    it('should create tags reset option', () => {
      const labelMock = 'label';
      const tagsMock = {
        reset: {
          key: labelMock,
          label: labelMock,
          glyph: 'glyph',
          rgItemType: List.ListProps.Type.LINK,
          className: 'cssClass',
          onClick: () => {}
        }
      };
      instance = shallowSelect({
        selected: [{}, {}],
        tags: tagsMock
      }).instance();

      const resetOption = instance._getResetOption();

      resetOption.rgItemType.should.be.equal(List.ListProps.Type.ITEM);
      resetOption.glyph.should.be.equal(tagsMock.reset.glyph);
      resetOption.onClick.should.be.an.instanceof(Function);
    });

    it('should not create tags reset option if it is not provided', () => {
      instance = shallowSelect({
        select: [{}, {}]
      }).instance();

      should.not.exist(instance._getResetOption());
    });

    it('should not create tags reset option without selected elements', () => {
      instance = shallowSelect({
        tags: {reset: {}}
      }).instance();

      should.not.exist(instance._getResetOption());
    });
  });


  describe('_prependResetOption', () => {
    let instance;

    it('should prepend reset option', () => {
      instance = getInstance();
      const newShownData = instance._prependResetOption([{}]);

      newShownData.length.should.be.equal(4);
    });

    it('should prepend reset option with separator', () => {
      instance = getInstance(true);

      const newShownData = instance._prependResetOption([{}]);

      newShownData.length.should.be.equal(5);
    });

    it('should not prepend reset option', () => {
      instance = getInstance(true, []);

      const newShownData = instance._prependResetOption([]);

      newShownData.length.should.be.equal(0);
    });

    function getInstance(resetWithSeparator, selected) {
      const resetMock = {
        reset: {}
      };
      if (resetWithSeparator) {
        resetMock.reset.separator = true;
      }

      return shallowSelect({
        selected: selected || [{}, {}],
        tags: resetMock
      }).instance();
    }
  });


  describe('_redrawPopup', () => {
    let clock;

    beforeEach(() => {
      clock = sandbox.useFakeTimers({toFake: ['setTimeout']});
    });

    it('should not redraw a popup in default mode', () => {
      const instance = shallowSelect().instance();
      sandbox.stub(instance, '_showPopup');
      instance._redrawPopup();

      clock.tick();
      instance._showPopup.should.not.have.been.called;
    });

    it('should redraw a popup in multiselect mode', () => {
      const instance = shallowSelect({
        multiple: true,
        selected: testData.slice(1)
      }).instance();

      sandbox.stub(instance, '_showPopup');
      instance._redrawPopup();

      clock.tick();
      instance._showPopup.should.have.been.called;
    });
  });
});
