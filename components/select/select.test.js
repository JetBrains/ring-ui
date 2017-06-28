/* eslint-disable no-magic-numbers */
import React from 'react';
import {findDOMNode} from 'react-dom';
import {Simulate} from 'react-dom/test-utils';
import {shallow, mount} from 'enzyme';

import List from '../list/list';
import Input from '../input/input';
import sniffr from '../global/sniffer';

import Select from './select';
import styles from './select.css';

import simulateCombo from 'simulate-combo';

const isIE11 = sniffr.browser.name === 'ie' && sniffr.browser.versionString === '11.0';

function simulateInput(node, value) {
  const target = findDOMNode(node);
  target.value = value;

  Simulate.change(target, {target});

  if (isIE11) {
    Simulate.input(target, {target: {value}});
  }
}

describe('Select', () => {
  const testData = [
    {key: 1, label: 'first1', type: List.ListProps.Type.ITEM},
    {key: 2, label: 'test2', type: List.ListProps.Type.ITEM},
    {key: 3, label: 'test3', type: List.ListProps.Type.ITEM},
    {key: 4, label: 'four4', type: List.ListProps.Type.ITEM}
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

  const shallowSelect = props => shallow(<Select {...defaultProps()} {...props}/>);
  const mountSelect = props => mount(<Select {...defaultProps()} {...props}/>);

  it('Should initialize', () => {
    shallowSelect().should.exist;
  });

  it('Should save selected item in state', () => {
    const wrapper = mountSelect();
    wrapper.should.have.state('selected', wrapper.prop('selected'));
  });

  it('Should provide select types', () => {
    expect(Select.Type).to.be.defined;
    expect(Select.Type.BUTTON).to.be.defined;
    expect(Select.Type.INPUT).to.be.defined;
    expect(Select.Type.CUSTOM).to.be.defined;
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
    const shortcuts = instance.getShortcutsProps();
    shortcuts.map.enter.should.be.defined;
    shortcuts.map.up.should.be.defined;
    shortcuts.map.down.should.be.defined;
  });

  it('Should generate unique scope for shortcuts', () => {
    const wrapper = shallowSelect();
    const instance = wrapper.instance();
    const firstTimeScope = instance.getShortcutsProps().scope;
    const secondTimeScope = instance.getShortcutsProps().scope;
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
    sandbox.useFakeTimers();
    const wrapper = mountSelect({type: Select.Type.INPUT});
    const instance = wrapper.instance();
    instance._showPopup();

    Simulate.blur(instance.filter);
    sandbox.clock.tick();
    instance._popup.props.hidden.should.be.true;
  });

  it('Should not close popup while clicking on popup in INPUT mode', () => {
    sandbox.useFakeTimers();
    const wrapper = mountSelect({type: Select.Type.INPUT});
    const instance = wrapper.instance();
    instance._showPopup();

    Simulate.mouseDown(instance._popup.list.node);
    Simulate.blur(instance.filter);
    sandbox.clock.tick();
    instance._popup.props.hidden.should.be.false;
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
      wrapper.should.have.descendants(`.${styles.selectedIcon}`);
    });

    it('Should not display selected item icon if it is not provided', () => {
      const wrapper = shallowSelect({selected: {key: 1, label: 'test', icon: null}});
      wrapper.should.not.have.descendants(`.${styles.selectedIcon}`);
    });

    it('Should display selected item icon', () => {
      const wrapper = mountSelect({
        selected: {
          key: 1,
          label: 'test',
          icon: 'http://fake.image/'
        }
      });
      const icon = wrapper.find(`.${styles.selectedIcon}`).getDOMNode();
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
      wrapper.simulate('mousedown');
      wrapper.simulate('click');

      instance._showPopup.should.be.called;
    });

    describe('Bottom toolbar', () => {
      it('Should not add "Add" button if enabled but filter query is empty', () => {
        const wrapper = mountSelect({add: true});
        const instance = wrapper.instance();
        instance.filterValue = sandbox.stub().returns('');
        instance._showPopup();
        instance._popup.popup.popup.should.not.contain('.ring-select__button');
      });

      it('Should add "Add" button if enabled and filter query not empty', () => {
        const wrapper = mountSelect({add: true});
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
          add: true,
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

    it('Should use custom filter.fn if provided', () => {
      const filterStub = sandbox.stub().returns(true);

      const wrapper = shallowSelect({
        filter: {fn: filterStub}
      });
      const instance = wrapper.instance();

      const filtered = instance.getListItems('test3');

      filtered.length.should.equal(testData.length);
      filterStub.should.have.callCount(8);
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
      const wrapper = mountSelect({type: Select.Type.BUTTON});
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
      const wrapper = shallowSelect({filter: false, type: Select.Type.BUTTON});
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

    it('Should clear fiter value when closing', () => {
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
    const mountSelectMultiple = props => mount(
      <Select {...defaultPropsMultiple()} {...props}/>
    );

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
      it('Should add item to multiple map on selecting item', () => {
        const wrapper = mountSelectMultiple();
        const instance = wrapper.instance();
        instance._listSelectHandler(testData[3]);
        instance._multipleMap['4'].should.be.true;
      });

      it('Should add item to selected on selecting item', () => {
        const wrapper = mountSelectMultiple();
        const instance = wrapper.instance();
        const lengthBefore = testData.slice(0, 2).length;
        instance._listSelectHandler(testData[3]);
        wrapper.state('selected').length.should.equal(lengthBefore + 1);
      });

      it('Should not close popup on selecting', () => {
        const wrapper = mountSelectMultiple();
        const instance = wrapper.instance();
        instance._hidePopup = sandbox.spy();
        instance._listSelectHandler(testData[3]);
        instance._hidePopup.should.not.be.called;
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
        type: List.ListProps.Type.SEPARATOR
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
    let mountWrapper;
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
      if (mountWrapper) {
        mountWrapper.detach();
        mountWrapper = null;
      }
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
      beforeEach(() => {
        this.targetInput = document.createElement('input');
        document.body.appendChild(this.targetInput);

        mountSelectToContainer({
          data: testData,
          filter: true,
          targetElement: this.targetInput
        });
        instance = mountWrapper.instance();

        instance._showPopup();
      });

      afterEach(() => {
        document.body.removeChild(this.targetInput);
        this.targetInput = null;
      });

      it('Should restore focus on provided target element after closing popup', () => {
        instance._hidePopup(true);

        this.targetInput.should.equal(document.activeElement);
      });

      it('Should restore focus on provided target element after closing popup with keyboard', () => {
        simulateCombo('esc');
        this.targetInput.should.equal(document.activeElement);
      });

      it('Should not restore focus on provided target element after closing popup with not keyboard event', () => {
        Simulate.click(document.body);

        this.targetInput.should.not.equal(document.activeElement);
      });

      it('Should not restore focus on provided target element after closing popup', () => {
        instance._hidePopup();

        this.targetInput.should.not.equal(document.activeElement);
      });
    });
  });
});
