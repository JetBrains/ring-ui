/* eslint-disable func-names */
import 'dom4';
import Select from './select';
import List from '../list/list';
import React from 'react';
import TestUtils from 'react-addons-test-utils';
import renderIntoDocument from 'render-into-document';
import RingComponent from '../ring-component/ring-component';
import simulateKeypress from 'simulate-keypress';

import styles from './select.css';

describe('Select', () => {
  const testData = [
    {key: 1, label: 'first1', type: List.ListProps.Type.ITEM},
    {key: 2, label: 'test2', type: List.ListProps.Type.ITEM},
    {key: 3, label: 'test3', type: List.ListProps.Type.ITEM},
    {key: 4, label: 'four4', type: List.ListProps.Type.ITEM}
  ];

  beforeEach(function () {
    this.renderSelect = props => {
      this.select = renderIntoDocument(React.createElement(Select, {
        data: testData,
        selected: testData[0],
        onChange: this.sinon.spy(),
        onFilter: this.sinon.spy(),
        onFocus: this.sinon.spy(),
        onBlur: this.sinon.spy(),
        filter: true,
        ...props
      }));
    };
    this.renderSelect({});
  });

  it('Should initialize', function () {
    expect(this.select).to.be.defined;
  });

  it('Should save selected item in state', function () {
    expect(this.select.state.selected).to.equal(this.select.props.selected);
  });

  it('Should provide select types', () => {
    expect(Select.Type).to.be.defined;
    expect(Select.Type.BUTTON).to.be.defined;
    expect(Select.Type.INPUT).to.be.defined;
    expect(Select.Type.CUSTOM).to.be.defined;
  });

  it('Should take provided className', function () {
    this.renderSelect({className: 'foo-bar'});
    this.select.node.should.have.class('foo-bar');
  });

  it('Should compute selected index', function () {
    const selectedIndex = this.select._getSelectedIndex(testData[2], testData);
    selectedIndex.should.equal(2);
  });

  it('should update rendered data if props change', function () {
    this.renderSelect({data: [testData[0]]});
    this.select.state.shownData.should.deep.equal([testData[0]]);
  });

  it('Should use selectedLabel for select button title if provided', function () {
    this.renderSelect({
      selected: {
        key: 1, label: 'test1', selectedLabel: 'testLabel'
      }
    });
    const selectedLabel = this.select._getSelectedString();
    selectedLabel.should.equal('testLabel');
  });

  it('Should use label for select button title', function () {
    const selectedLabel = this.select._getSelectedString();
    selectedLabel.should.equal('first1');
  });

  it('Should clear selected on clearing', function () {
    this.select.clear();
    expect(this.select.state.selected).to.be.null;
  });

  it('Should call onChange on clearing', function () {
    this.select.clear();
    this.select.props.onChange.should.been.called.once;
    this.select.props.onChange.should.been.called.calledWith(null);
  });

  it('Should pass selected item and event to onChange', function () {
    this.select._listSelectHandler({item: 'foo'}, {nativeEvent: 'foo'});
    this.select.props.onChange.should.been.called.calledWith({item: 'foo'}, {nativeEvent: 'foo'});
  });

  it('Should clear selected when rerendering with no selected item', function () {
    this.renderSelect({selected: null});
    expect(this.select.state.selected).to.be.null;
  });

  it('Should handle UP, DOWN and ENTER shortcuts', function () {
    const shortcuts = this.select.getShortcutsProps();
    shortcuts.map.enter.should.be.defined;
    shortcuts.map.up.should.be.defined;
    shortcuts.map.down.should.be.defined;
  });

  it('Should generate unique scope for shortcuts', function () {
    const firstTimeScope = this.select.getShortcutsProps().scope;
    const secondTimeScope = this.select.getShortcutsProps().scope;
    secondTimeScope.should.not.be.equal(firstTimeScope);
  });

  it('Should open popup on key handling if not opened', function () {
    this.renderSelect({type: Select.Type.INPUT});
    this.select._showPopup = this.sinon.spy();
    this.select.setState({focused: true});
    this.select._inputShortcutHandler();
    this.select._showPopup.should.been.calledOnce;
  });

  it('Should not open popup if disabled', function () {
    this.renderSelect({disabled: true});
    this.select._showPopup = this.sinon.spy();
    this.select._clickHandler();
    this.select._showPopup.should.not.been.called;
  });

  it('Should close popup on click if it is already open', function () {
    this.select._hidePopup = this.sinon.spy();
    this.select._showPopup();
    this.select._clickHandler();
    this.select._hidePopup.should.been.called;
  });

  it('Should call onAdd on adding', function () {
    this.renderSelect({onAdd: this.sinon.spy()});
    this.select.addHandler();
    this.select.props.onAdd.should.been.calledOnce;
  });

  it('Should call onFocus on input focus', function () {
    this.renderSelect({type: Select.Type.INPUT});

    TestUtils.Simulate.focus(this.select.filter);
    this.select.props.onFocus.should.been.called;
  });

  it('Should call onBlur on input blur', function () {
    this.renderSelect({type: Select.Type.INPUT});

    TestUtils.Simulate.blur(this.select.filter);
    this.select.props.onBlur.should.been.called;
  });

  it('Should close popup if input lost focus in INPUT mode', function () {
    this.sinon.useFakeTimers();
    this.renderSelect({type: Select.Type.INPUT});
    this.select._showPopup();

    TestUtils.Simulate.blur(this.select.filter);
    this.sinon.clock.tick();
    this.select._popup.props.hidden.should.be.true;
  });

  it('Should not close popup while clicking on popup in INPUT mode', function () {
    this.sinon.useFakeTimers();
    this.renderSelect({type: Select.Type.INPUT});
    this.select._showPopup();

    TestUtils.Simulate.mouseDown(this.select._popup.list.node);
    TestUtils.Simulate.blur(this.select.filter);
    this.sinon.clock.tick();
    this.select._popup.props.hidden.should.be.false;
  });

  describe('DOM', () => {
    it('Should place select button inside container', function () {
      this.select.node.should.have.class(styles.select);
    });

    it('Should disable select button if needed', function () {
      this.renderSelect({
        disabled: true
      });
      this.select.node.should.have.class(styles.disabled);
      this.select.button.should.have.attr('disabled');
    });

    it('Should not disable select button if not needed', function () {
      this.renderSelect({
        disabled: false
      });
      this.select.button.should.not.have.attr('disabled');
    });

    it('Should place input inside in INPUT mode', function () {
      this.renderSelect({type: Select.Type.INPUT});
      this.select.node.should.contain('input');
    });

    it('Should place icons inside', function () {
      this.select.node.should.contain(`.${styles.icons}`);
    });

    it('Should add selected item icon to button', function () {
      this.renderSelect({
        selected: {
          key: 1,
          label: 'test',
          icon: 'fakeImageUrl'
        }
      });
      this.select.node.should.contain(`.${styles.selectedIcon}`);
    });

    it('Should not display selected item icon if it is not provided', function () {
      this.renderSelect({selected: {key: 1, label: 'test', icon: null}});
      this.select.node.should.not.contain(`.${styles.selectedIcon}`);
    });

    it('Should display selected item icon', function () {
      this.renderSelect({
        selected: {
          key: 1,
          label: 'test',
          icon: 'http://fake.image/'
        }
      });
      const icon = this.select.node.querySelector(`.${styles.selectedIcon}`);
      expect(icon.style.backgroundImage).to.contain('http://fake.image/');
    });

    it('Should place icons inside in INPUT mode', function () {
      this.renderSelect({type: Select.Type.INPUT});
      this.select.node.should.contain(`.${styles.icons}`);
    });

    it('Should open select dropdown on click', function () {
      this.sinon.spy(this.select, '_showPopup');
      TestUtils.Simulate.click(this.select.node);

      this.select._showPopup.should.have.been.called;
    });

    describe('Bottom toolbar', () => {
      it('Should not add "Add" button if enabled but filter query is empty', function () {
        this.renderSelect({add: true});
        this.select.filterValue = this.sinon.stub().returns('');
        this.select._showPopup();
        this.select._popup.popup.popup.should.not.contain(`.${styles.button}`);
      });

      it('Should add "Add" button if enabled and filter query not empty', function () {
        this.renderSelect({add: true});
        this.select.filterValue = this.sinon.stub().returns('test');
        this.select._showPopup();
        this.select._popup.popup.popup.should.contain(`.${styles.button}`);
      });

      it('Should add "Add" button if alwaysVisible is set', function () {
        this.renderSelect({
          add: {
            alwaysVisible: true
          }
        });
        this.select._showPopup();
        this.select._popup.popup.popup.should.contain(`.${styles.button}`);
      });

      it('Should place label instead filterValue to "Add" button if alwaysVisible is set', function () {
        this.renderSelect({
          add: {
            alwaysVisible: true,
            label: 'Add Something'
          }
        });
        this.select._showPopup();
        const addButton = this.select._popup.popup.popup.query(`.${styles.button}`);

        addButton.should.contain.text('Add Something');
      });

      it('Should add hint if specified', function () {
        this.renderSelect({
          hint: 'blah blah'
        });
        this.select._showPopup();
        this.select._popup.popup.popup.should.contain('[data-test=ring-list-hint]');
      });

      it('Hint should be placed under "add" button', function () {
        this.renderSelect({
          add: true,
          hint: 'blah blah'
        });
        this.select._showPopup();
        const hint = this.select._popup.popup.popup.queryAll('[data-test=ring-list-hint]');

        hint.should.exist;
      });
    });
  });

  describe('getListItems', () => {
    it('Should filter items by label', function () {
      const filtered = this.select.getListItems('test3');
      filtered.length.should.equal(1);
      filtered[0].label.should.equal('test3');
    });

    it('Should filter items by part of label', function () {
      const filtered = this.select.getListItems('test');
      filtered.length.should.equal(2);
    });

    it('Should not filter separators', function () {
      const separators = [{
        type: List.ListProps.Type.SEPARATOR,
        key: 1,
        description: 'test'
      }];
      this.renderSelect({data: separators});

      const filtered = this.select.getListItems('foo');
      filtered.should.deep.equal(separators);
    });

    it('Should use custom filter.fn if provided', function () {
      const filterStub = this.sinon.stub().returns(true);

      this.renderSelect({
        filter: {fn: filterStub}
      });

      const filtered = this.select.getListItems('test3');

      filtered.length.should.equal(testData.length);
      filterStub.should.have.callCount(8);
    });

    it('Should write filter query on add button if enabled', function () {
      this.renderSelect({
        add: {
          prefix: 'Add some'
        }
      });

      this.select.getListItems('foo');

      this.select._addButton.label.should.equal('foo');
    });
  });

  describe('Filtering', () => {
    it('Should call onFilter on input changes', function () {
      this.select.filterValue = this.sinon.stub().returns('a');
      this.select.setState({
        focused: true,
        showPopup: true
      });
      TestUtils.Simulate.input(this.select._popup.filter);
      this.select.props.onFilter.should.been.called;
    });

    it('Should save input changes', function () {
      this.select.filterValue = this.sinon.stub().returns('a');
      this.select._filterChangeHandler();
      this.select.state.prevFilterValue.should.equals('a');
    });

    it('Should open popup on input changes if in focus', function () {
      this.renderSelect({type: Select.Type.INPUT});
      this.select._showPopup = this.sinon.spy();
      this.select.filterValue = this.sinon.stub().returns('a');
      this.select.setState({focused: true});
      this.select._filterChangeHandler();
      this.select._showPopup.should.have.been.called;
    });

    it('should filter if not focused but not in input mode', function () {
      this.renderSelect({type: Select.Type.BUTTON});
      this.sinon.spy(this.select, 'filterValue');
      this.select._filterChangeHandler();

      this.select.filterValue.should.have.been.called;
    });

    it('Should not open popup on input changes if not in focus', function () {
      this.renderSelect({type: Select.Type.INPUT});

      this.select._showPopup = this.sinon.spy();
      this.select._filterChangeHandler();
      this.select._showPopup.should.not.have.been.called;
    });

    it('Should return empty string if not input mode and filter is disabled', function () {
      this.renderSelect({filter: false, type: Select.Type.BUTTON});

      this.select.filterValue().should.equal('');
    });

    it('Should return input value if input mode enabled', function () {
      this.renderSelect({filter: false, type: Select.Type.INPUT});
      this.select.filter.value = 'test input';
      this.select.filterValue().should.equal('test input');
    });

    it('Should set value to popup input if passed', function () {
      this.select._showPopup();
      this.select.filterValue('test');
      this.select._popup.filter.value.should.equal('test');
    });

    it('Should set target input value in input mode', function () {
      this.renderSelect({filter: false, type: Select.Type.INPUT});

      this.select.filterValue('test');
      this.select.filter.value.should.equal('test');
    });
  });

  describe('Multiple', () => {
    let selectedArray;

    beforeEach(function () {
      selectedArray = testData.slice(0, 2);

      this.renderSelect = props => {
        this.select = renderIntoDocument(React.createElement(Select, {
          data: testData,
          selected: selectedArray,
          filter: true,
          multiple: true,
          onChange: this.sinon.spy(),
          ...props
        }));
      };
      this.renderSelect();

      /**
       * Disable code running in setTimeout to avoid side effects
       */
      this.clock = this.sinon.useFakeTimers();
    });

    afterEach(function () {
      this.clock.restore();
    });

    it('Should fill _multipleMap on initialization', function () {
      this.select._multipleMap['1'].should.be.true;
    });

    it('Should fill _multipleMap on _rebuildMultipleMap', function () {
      this.select._rebuildMultipleMap(testData.slice(1, 2));
      this.select._multipleMap['2'].should.be.true;
    });

    it('Should construct label from selected array', function () {
      const selectedLabel = this.select._getSelectedString();
      selectedLabel.should.equal('first1, test2');
    });

    it('Should detect selection is empty according on not empty array', function () {
      this.select._selectionIsEmpty().should.be.false;
    });

    it('Should detect selection is empty according on empty array', function () {
      this.renderSelect({selected: []});
      this.select._selectionIsEmpty().should.be.true;
    });

    it('Should clear selected on clearing', function () {
      this.select.clear();
      this.select.state.selected.length.should.equal(0);
    });

    it('Should call onChange on clearing', function () {
      this.select.clear();
      this.select.props.onChange.should.been.called.once;
      this.select.props.onChange.should.been.called.calledWith([]);
    });

    it('Should clear selected when rerendering with no selected item in multiple mode', function () {
      this.renderSelect({selected: null});
      this.select.state.selected.should.deep.equal([]);
    });

    it('Should update selected checkboxes on selected update', function () {
      this.renderSelect({selected: []});
      this.select.getListItems(this.select.filterValue())[0].checkbox.should.be.false;
    });

    describe('On selecting', () => {
      it('Should add item to multiple map on selecting item', function () {
        this.select._listSelectHandler(testData[3]);
        this.select._multipleMap['4'].should.be.true;
      });

      it('Should add item to selected on selecting item', function () {
        const lengthBefore = selectedArray.length;
        this.select._listSelectHandler(testData[3]);
        this.select.state.selected.length.should.equal(lengthBefore + 1);
      });

      it('Should not close popup on selecting', function () {
        this.select._hidePopup = this.sinon.spy();
        this.select._listSelectHandler(testData[3]);
        this.select._hidePopup.should.not.been.called;
      });
    });

    describe('On deselecting', () => {
      it('Should remove item from selected on deselecting', function () {
        const lengthBefore = selectedArray.length;
        this.select._listSelectHandler(testData[0]);
        this.select.state.selected.length.should.equal(lengthBefore - 1);
      });

      it('Should call onDeselect on deselecting item', function () {
        this.renderSelect({
          onDeselect: this.sinon.spy()
        });
        this.select._listSelectHandler(testData[0]);
        this.select.props.onDeselect.should.been.calledWith(testData[0]);
      });
    });

  });

  describe('On selecting', () => {
    it('Should not react on selecting disabled element', function () {
      this.select.setState = this.sinon.spy();

      this.select._listSelectHandler({
        key: 1,
        label: 'test',
        disabled: true
      });

      this.select.setState.should.not.been.called;
    });

    it('Should not react on selecting separator', function () {
      this.select.setState = this.sinon.spy();

      this.select._listSelectHandler({
        key: 1,
        label: 'test',
        type: List.ListProps.Type.SEPARATOR
      });

      this.select.setState.should.not.been.called;
    });

    it('Should react on selecting custom item', function () {
      this.select.setState = this.sinon.spy();

      this.select._listSelectHandler({
        key: 1,
        label: 'test',
        type: List.ListProps.Type.CUSTOM
      });

      this.select.setState.should.been.called;
    });

    it('Should set selected on selecting', function () {
      this.select._listSelectHandler(testData[3]);
      this.select.state.selected.should.equal(testData[3]);
    });

    it('Should set call onSelect on selecting', function () {
      this.renderSelect({
        onSelect: this.sinon.spy()
      });
      this.select._listSelectHandler(testData[1]);
      this.select.props.onSelect.should.been.calledOnce;
    });

    it('Should set call onChange on selecting', function () {
      this.renderSelect({
        onChange: this.sinon.spy()
      });
      this.select._listSelectHandler(testData[1]);
      this.select.props.onChange.should.been.calledOnce;
    });

    it('Should hide popup on selecting', function () {
      this.select._hidePopup = this.sinon.spy();
      this.select._listSelectHandler(testData[1]);
      this.select._hidePopup.should.been.calledOnce;
    });
  });

  describe('Popup', () => {
    it('Should pass loading message and indicator to popup if loading', function () {
      this.renderSelect({loading: true, loadingMessage: 'test message'});
      this.select._popup.rerender = this.sinon.stub();
      this.select._showPopup();
      this.select._popup.props.message.should.equal('test message');
      this.select._popup.props.loading.should.be.true;
    });

    it('Should pass notFoundMessage message to popup if not loading and data is empty', function () {
      this.renderSelect({data: [], notFoundMessage: 'test not found'});
      this.select._popup.rerender = this.sinon.stub();
      this.select._showPopup();
      this.select._popup.props.message.should.equal('test not found');
    });

    it('Should restore focus on select in button mode after closing popup', function () {
      this.select = renderIntoDocument(React.createElement(Select, {
        data: testData,
        filter: true
      }));

      this.select._showPopup();
      this.select._hidePopup(true);
      document.activeElement.should.equal(this.select.button);
    });

    describe('Focus after close', () => {
      let targetInput = null;

      beforeEach(function () {
        targetInput = renderIntoDocument(React.createElement(
          class extends RingComponent {
            render() {
              return <input/>;
            }
          }
        ));

        this.select = renderIntoDocument(React.createElement(Select, {
          data: testData,
          filter: true,
          targetElement: targetInput.node
        }));
        this.select._showPopup();
      });

      it('Should restore focus on provided target element after closing popup', function () {
        this.select._hidePopup(true);

        targetInput.node.should.equal(document.activeElement);
      });

      it('Should restore focus on provided target element after closing popup with keyboard', () => {
        const ESC_KEY = 27;
        simulateKeypress(null, ESC_KEY);
        targetInput.node.should.equal(document.activeElement);
      });

      it('Should not restore focus on provided target element after closing popup with not keyboard event', () => {
        TestUtils.Simulate.click(document.body);

        targetInput.node.should.not.equal(document.activeElement);
      });

      it('Should not restore focus on provided target element after closing popup', function () {
        this.select._hidePopup();
        targetInput.node.should.not.equal(document.activeElement);
      });
    });
  });
});
