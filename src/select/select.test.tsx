/* eslint-disable @typescript-eslint/no-magic-numbers*/
import {Simulate} from 'react-dom/test-utils';
import {shallow, mount, ReactWrapper, ShallowWrapper} from 'enzyme';

import Sinon from 'sinon';

import List from '../list/list';
import Input from '../input/input';
import simulateCombo from '../../test-helpers/simulate-combo';

import Select, {MultipleSelectAttrs, SelectAttrs, SelectItem, SelectState, SingleSelectAttrs} from './select';
import styles from './select.css';

import {Tags} from './select__popup';

function simulateInput(target: HTMLInputElement, value: string) {
  target.value = value;

  Simulate.change(target, {target});
}

const selectedIconSelector = `.${styles.selectedIcon.split(/\s/)[0]}`;

describe('Select', () => {
  const testData: SelectItem[] = [
    {key: 1, label: 'first1', rgItemType: List.ListProps.Type.ITEM},
    {key: 2, label: 'test2', rgItemType: List.ListProps.Type.ITEM},
    {key: 3, label: 'test3', rgItemType: List.ListProps.Type.ITEM},
    {key: 4, label: 'four4', selectedLabel: '', rgItemType: List.ListProps.Type.ITEM},
  ];

  const defaultProps = () => ({
    data: testData,
    selected: testData[0],
    onChange: sandbox.spy(),
    onFilter: sandbox.spy(),
    onFocus: sandbox.spy(),
    onBlur: sandbox.spy(),
    filter: true,
  });

  let mountWrapper:
    | ReactWrapper<SingleSelectAttrs, SelectState, Select>
    | ReactWrapper<MultipleSelectAttrs, SelectState, Select>
    | null;
  const shallowSelect = (props?: SingleSelectAttrs) =>
    shallow<Select, SelectAttrs>(<Select {...defaultProps()} {...props} />);
  const mountSelect = (props?: SingleSelectAttrs) => {
    const wrapper = mount<Select, SingleSelectAttrs>(<Select {...defaultProps()} {...props} />);
    mountWrapper = wrapper;
    return wrapper;
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
    Select.Type.INLINE.should.exist;
  });

  it('Should take provided className', () => {
    const wrapper = mountSelect({className: 'foo-bar'});
    wrapper.should.have.className('foo-bar');
  });

  it('Should compute selected index', () => {
    const instance = shallowSelect().instance();
    const selectedIndex = instance._getSelectedIndex(testData[2], testData);
    selectedIndex!.should.equal(2);
  });

  it('should update rendered data if props change', () => {
    const wrapper = shallowSelect();
    wrapper.setProps({data: [testData[0]]});
    wrapper.state('shownData').should.deep.equal([testData[0]]);
  });

  it('Should use selectedLabel for select button title if provided', () => {
    const wrapper = shallowSelect({
      selected: {
        key: 1,
        label: 'test1',
        selectedLabel: 'testLabel',
      },
    });
    const instance = wrapper.instance();
    const selectedLabel = instance._getSelectedString();
    selectedLabel!.should.equal('testLabel');
  });

  it('Should use label for select button title', () => {
    const instance = shallowSelect().instance();
    const selectedLabel = instance._getSelectedString();
    selectedLabel!.should.equal('first1');
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
    wrapper.prop('onChange')!.should.be.calledOnce;
    wrapper.prop('onChange')!.should.be.called.calledWith(null);
  });

  it('Should pass selected item and event to onChange', () => {
    const wrapper = mountSelect();
    const instance = wrapper.instance();
    instance._listSelectHandler({key: 'foo'}, {type: 'click'} as Event);
    wrapper.prop('onChange')!.should.be.called.calledWith({key: 'foo'}, {type: 'click'});
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
    wrapper.prop('onAdd')!.should.be.calledOnce;
  });

  it('Should call onFocus on input focus', () => {
    const wrapper = mountSelect({type: Select.Type.INPUT});
    const instance = wrapper.instance();

    Simulate.focus(instance.filter!);
    wrapper.prop('onFocus')!.should.be.called;
  });

  it('Should call onBlur on input blur', () => {
    const wrapper = mountSelect({type: Select.Type.INPUT});
    const instance = wrapper.instance();

    Simulate.blur(instance.filter!);
    wrapper.prop('onBlur')!.should.be.called;
  });

  it('Should close popup if input lost focus in INPUT mode', () => {
    sandbox.useFakeTimers({toFake: ['setTimeout']});
    const wrapper = mountSelect({type: Select.Type.INPUT});
    const instance = wrapper.instance();
    instance._showPopup();

    Simulate.blur(instance.filter!);
    sandbox.clock.tick(0);
    instance._popup!.props.hidden!.should.be.true;
  });

  it('Should not close popup while clicking on popup in INPUT mode', () => {
    sandbox.useFakeTimers({toFake: ['setTimeout']});
    const wrapper = mountSelect({type: Select.Type.INPUT});
    const instance = wrapper.instance();
    instance._showPopup();

    Simulate.mouseDown(instance._popup!.list!.container!);
    Simulate.blur(instance.filter!);
    sandbox.clock.tick(0);
    instance._popup!.props.hidden!.should.be.false;
  });

  describe('Derived state', () => {
    let wrapper: ShallowWrapper<SelectAttrs, SelectState, Select>;
    beforeEach(() => {
      wrapper = shallowSelect();
    });

    it('Should update shown data', () => {
      const {shownData} = wrapper.state();
      wrapper.setProps({data: []});

      wrapper.state().shownData.should.deep.equal([]);
      wrapper.state().shownData.should.not.equal(shownData);
    });

    it('Should not update shown data if data is not passed', () => {
      const {shownData} = wrapper.state();
      wrapper.setProps({});

      wrapper.state().shownData.should.equal(shownData);
    });

    it('Should not update shown data if data the same as previous', () => {
      const {shownData} = wrapper.state();
      wrapper.setProps({data: testData});

      wrapper.state().shownData.should.equal(shownData);
    });

    it('Should reset selection when toggling multiple state', () => {
      wrapper.setProps({multiple: true});
      wrapper.state().selected!.should.deep.equal([]);

      wrapper.setProps({multiple: false});
      should.equal(wrapper.state().selected, null);
    });

    it('Should not reset selection if mulitiple prop is the same as previous', () => {
      const {selected} = wrapper.state();
      wrapper.setProps({multiple: false});

      wrapper.state().selected!.should.equal(selected);
    });

    it('Should update selected index for select', () => {
      const selectedItem = createItem();

      wrapper.setProps({
        selected: selectedItem,
        data: [createItem(), selectedItem],
      });

      wrapper.state().selectedIndex!.should.equal(1);
    });

    it('Should update selected index for multiple select if selected is changed', () => {
      const selectedItem = createItem();

      wrapper.setProps({
        multiple: true,
        selected: [selectedItem],
        data: [createItem(), selectedItem],
      });

      wrapper.state().selectedIndex!.should.equal(1);
    });

    it('Should update selected index for multiple select if selected is changed but count of element is the same', () => {
      const firstItem = createItem();
      const secondItem = createItem();

      wrapper.setProps({
        multiple: true,
        selected: [secondItem],
        data: [firstItem, secondItem],
      });

      wrapper.setProps({
        selected: [firstItem],
      });

      wrapper.state().selectedIndex!.should.equal(0);
    });

    function createItem(): SelectItem {
      createItem.key += 1;
      return {key: createItem.key};
    }
    createItem.key = 0;
  });

  describe('DOM', () => {
    it('Should place select button inside container', () => {
      const wrapper = mountSelect();
      wrapper.should.have.className(styles.select);
    });

    it('Should disable select button if needed', () => {
      const wrapper = mountSelect({
        disabled: true,
      });
      wrapper.should.have.className(styles.disabled);
      wrapper.find('button[data-test*="ring-select__button"]').should.have.prop('disabled');
    });

    it('Should not disable select button if not needed', () => {
      const wrapper = mountSelect({
        disabled: false,
      });
      wrapper.find('button[data-test*="ring-select__button"]').should.have.prop('disabled');
    });

    it('Should place input inside in INPUT mode', () => {
      const wrapper = mountSelect({type: Select.Type.INPUT});
      wrapper.should.have.descendants(Input);
    });

    it('Should place icons inside', () => {
      const wrapper = mountSelect();
      wrapper.should.have.descendants(`.${styles.icons}`);
    });

    it('Should add selected item icon to button', () => {
      const wrapper = mountSelect({
        selected: {
          key: 1,
          label: 'test',
          icon: 'fakeImageUrl',
        },
      });
      wrapper.should.have.descendants(selectedIconSelector);
    });

    it('Should not display selected item icon if it is not provided', () => {
      const wrapper = shallowSelect({selected: {key: 1, label: 'test', icon: undefined}});
      wrapper.should.not.have.descendants(selectedIconSelector);
    });

    it('Should display selected item icon', () => {
      const wrapper = mountSelect({
        selected: {
          key: 1,
          label: 'test',
          icon: 'http://fake.image/',
        },
      });
      const icon = wrapper.find(selectedIconSelector).getDOMNode<HTMLElement>();
      icon.style.backgroundImage.should.contain('http://fake.image/');
    });

    it('Should place icons inside in INPUT mode', () => {
      const wrapper = mountSelect({type: Select.Type.INPUT});
      wrapper.should.have.descendants(`.${styles.icons}`);
    });

    it('Should open select dropdown on click', () => {
      const wrapper = mountSelect();
      const instance = wrapper.instance();
      sandbox.spy(instance, '_showPopup');
      wrapper.find('button').first().simulate('click');

      instance._showPopup.should.be.called;
    });

    describe('Bottom toolbar', () => {
      it('Should not add "Add" button if enabled but filter query is empty', () => {
        const wrapper = mountSelect({add: {}});
        const instance = wrapper.instance();
        instance.filterValue = sandbox.stub().returns('');
        instance._showPopup();
        instance._popup!.popup!.popup!.should.not.contain('.ring-select__button');
      });

      it('Should add "Add" button if enabled and filter query not empty', () => {
        const wrapper = mountSelect({add: {}});
        const instance = wrapper.instance();
        instance.filterValue = sandbox.stub().returns('test');
        instance._showPopup();
        instance._popup!.popup!.popup!.should.contain(`.${styles.button}`);
      });

      it('Should add "Add" button if alwaysVisible is set', () => {
        const wrapper = mountSelect({
          add: {
            alwaysVisible: true,
          },
        });
        const instance = wrapper.instance();
        instance._showPopup();
        instance._popup!.popup!.popup!.should.contain(`.${styles.button}`);
      });

      it('Should place label instead filterValue to "Add" button if alwaysVisible is set', () => {
        const wrapper = mountSelect({
          add: {
            alwaysVisible: true,
            label: 'Add Something',
          },
        });
        const instance = wrapper.instance();
        instance._showPopup();
        const addButton = instance._popup!.popup!.popup!.querySelector('[data-test~="ring-select-toolbar-button"]');

        addButton!.should.contain.text('Add Something');
      });

      it('Should process filterValue into a label at the "Add" button if "add.label" prop is a function', () => {
        const wrapper = mountSelect({
          add: {
            label: value => `--${value}--`,
          },
        });
        const instance = wrapper.instance();
        instance.filterValue = sandbox.stub().returns('test');
        instance._showPopup();
        const addButton = instance._popup!.popup!.popup!.querySelector('[data-test~="ring-select-toolbar-button"]');

        addButton!.should.contain.text('--test--');
      });

      it('Should add hint if specified', () => {
        const wrapper = mountSelect({
          hint: 'blah blah',
        });
        const instance = wrapper.instance();
        instance._showPopup();
        instance._popup!.popup!.popup!.should.contain('[data-test=ring-list-hint]');
      });

      it('Hint should be placed under "add" button', () => {
        const wrapper = mountSelect({
          add: {},
          hint: 'blah blah',
        });
        const instance = wrapper.instance();
        instance._showPopup();
        const hint = instance._popup!.popup!.popup!.querySelectorAll('[data-test=ring-list-hint]');

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
      filtered[0].label!.should.equal('test3');
    });

    it('Should filter items by part of label', () => {
      const wrapper = shallowSelect();
      const instance = wrapper.instance();
      const filtered = instance.getListItems('test');
      filtered.length.should.equal(2);
    });

    it('Should not filter separators', () => {
      const separators = [
        {
          rgItemType: List.ListProps.Type.SEPARATOR,
          key: 1,
          description: 'test',
        },
      ];
      const wrapper = shallowSelect({data: separators});
      const instance = wrapper.instance();

      const filtered = instance.getListItems('foo');
      filtered.should.deep.equal(separators);
    });

    it('Should not filter hints', () => {
      const hints = [
        {
          rgItemType: List.ListProps.Type.HINT,
          key: 1,
          description: 'test',
        },
      ];
      const wrapper = shallowSelect({data: hints});
      const instance = wrapper.instance();

      const filtered = instance.getListItems('foo');
      filtered.should.deep.equal(hints);
    });

    it('Should filter custom items with label', () => {
      const customItems = [
        {
          rgItemType: List.ListProps.Type.CUSTOM,
          key: 1,
          label: 'bar',
          template: <div />,
        },
      ];
      const wrapper = shallowSelect({data: customItems});
      const instance = wrapper.instance();

      const filtered = instance.getListItems('foo');
      filtered.should.deep.equal([]);
    });

    it('Should not filter items without label', () => {
      const items = [
        {
          key: 1,
          description: 'test',
        },
      ];
      const wrapper = shallowSelect({data: items});
      const instance = wrapper.instance();

      const filtered = instance.getListItems('foo');
      filtered.should.deep.equal(items);
    });

    it('Should use custom filter.fn if provided', () => {
      const filterStub = sandbox.stub().returns(true);

      const wrapper = shallowSelect({
        filter: {fn: filterStub},
      });
      const instance = wrapper.instance();

      const filtered = instance.getListItems('test3');

      filtered.length.should.equal(testData.length);
      filterStub.should.have.callCount(4);
    });

    it('Should write filter query on add button if enabled', () => {
      const wrapper = shallowSelect({
        add: {
          prefix: 'Add some',
        },
      });
      const instance = wrapper.instance();

      instance.getListItems('foo');

      wrapper.state().addButton!.label.should.equal('foo');
    });
  });

  describe('Filtering', () => {
    it('Should call onFilter on input changes', () => {
      const wrapper = mountSelect();
      const instance = wrapper.instance();
      wrapper.setState({
        focused: true,
        showPopup: true,
      });
      simulateInput(instance._popup!.filter!, 'a');
      wrapper.prop('onFilter')!.should.be.called;
    });

    it('Should save input changes', () => {
      const wrapper = mountSelect();
      const instance = wrapper.instance();
      wrapper.setState({showPopup: true});
      simulateInput(instance._popup!.filter!, 'a');
      wrapper.should.have.state('filterValue', 'a');
    });

    it('Should open popup on input changes if in focus', () => {
      const wrapper = mountSelect({type: Select.Type.INPUT});
      const instance = wrapper.instance();
      instance._showPopup = sandbox.spy();
      wrapper.setState({focused: true});
      simulateInput(instance.filter!, 'a');
      instance._showPopup.should.be.called;
    });

    it('should filter if not focused but not in input mode', () => {
      const wrapper = mountSelect();
      const instance = wrapper.instance();
      wrapper.setState({showPopup: true});
      simulateInput(instance._popup!.filter!, 'a');

      wrapper.prop('onFilter')!.should.be.called;
    });

    it('Should not open popup on input changes if not in focus', () => {
      const wrapper = mountSelect({type: Select.Type.INPUT});
      const instance = wrapper.instance();

      instance._showPopup = sandbox.spy();
      simulateInput(instance.filter!, 'a');
      instance._showPopup.should.not.be.called;
    });

    it('Should return empty string if not input mode and filter is disabled', () => {
      const wrapper = shallowSelect({filter: false});
      const instance = wrapper.instance();

      instance.filterValue().should.equal('');
    });

    it('Should return input value if input mode enabled', () => {
      const wrapper = mountSelect({filter: false, type: Select.Type.INPUT});
      const instance = wrapper.instance();
      wrapper.setState({focused: true});
      simulateInput(instance.filter!, 'test input');
      instance.filterValue().should.equal('test input');
    });

    it('Should set value to popup input if passed', () => {
      const wrapper = mountSelect();
      const instance = wrapper.instance();
      instance._showPopup();
      instance.filterValue('test');
      instance._popup!.filter!.value.should.equal('test');
    });

    it('Should set target input value in input mode', () => {
      const wrapper = mountSelect({filter: false, type: Select.Type.INPUT});
      const instance = wrapper.instance();

      wrapper.setState({focused: true});
      instance.filterValue('test');
      instance.filter!.value.should.equal('test');
    });

    it('Should clear filter value when closing', () => {
      const wrapper = mountSelect();
      const instance = wrapper.instance();
      instance.filterValue('test');
      instance._showPopup();
      instance._hidePopup();
      instance._showPopup();
      instance._popup!.filter!.value.should.equal('');
    });
  });

  const defaultPropsMultiple = (): MultipleSelectAttrs => ({
    data: testData,
    selected: testData.slice(0, 2),
    filter: true,
    multiple: true,
    onChange: sandbox.spy(),
  });

  const shallowSelectMultiple = (props?: MultipleSelectAttrs) =>
    shallow<Select>(<Select {...defaultPropsMultiple()} {...props} />);
  const mountSelectMultiple = (props?: MultipleSelectAttrs): ReactWrapper<MultipleSelectAttrs, SelectState, Select> => {
    const wrapper = mount<Select, MultipleSelectAttrs>(<Select {...defaultPropsMultiple()} {...props} />);
    mountWrapper = wrapper;
    return wrapper;
  };

  describe('Multiple', () => {
    it('Should fill multipleMap on initialization', () => {
      const wrapper = mountSelectMultiple();
      wrapper.state().multipleMap.should.deep.equal({1: true, 2: true});
    });

    it('Should fill multipleMap on selection change', () => {
      const wrapper = mountSelectMultiple();
      wrapper.setProps({selected: testData.slice(1, 2)});
      wrapper.state().multipleMap.should.deep.equal({2: true});
    });

    it('Should construct label from selected array', () => {
      const wrapper = shallowSelectMultiple();
      const instance = wrapper.instance();
      const selectedLabel = instance._getSelectedString();
      selectedLabel!.should.equal('first1, test2');
    });

    it('Should skip empty labels', () => {
      const wrapper = shallowSelectMultiple({
        selected: testData.slice(2),
      });
      const instance = wrapper.instance();
      const selectedLabel = instance._getSelectedString();
      selectedLabel!.should.equal('test3');
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
      (wrapper.state('selected') as SelectItem[]).length.should.equal(0);
    });

    it('Should not draw "clear" button if multiple and nothing selected', () => {
      const wrapper = shallowSelectMultiple();
      wrapper.setProps({clear: true, selected: []});
      wrapper.should.not.have.descendants('[data-test~="ring-clear-select"]');
    });

    it('Should call onChange on clearing', () => {
      const wrapper = mountSelectMultiple();
      const instance = wrapper.instance();
      instance.clear();
      wrapper.prop('onChange')!.should.be.calledOnce;
      wrapper.prop('onChange')!.should.be.called.calledWith([]);
    });

    it('Should clear selected when rerendering with no selected item in multiple mode', () => {
      const wrapper = shallowSelectMultiple();
      wrapper.setProps({selected: null});
      wrapper.state('selected')!.should.deep.equal([]);
    });

    it('Should update selected checkboxes on selected update', () => {
      const wrapper = shallowSelectMultiple();
      const instance = wrapper.instance();
      wrapper.setProps({selected: []});
      instance.getListItems(instance.filterValue())[0].checkbox!.should.be.false;
    });

    describe('On selecting', () => {
      let wrapper: ReactWrapper<MultipleSelectAttrs, SelectState, Select>;
      let instance: Select;
      beforeEach(() => {
        wrapper = mountSelectMultiple();
        instance = wrapper.instance();
      });

      it('Should add item to multiple map on selecting item', () => {
        instance._listSelectHandler(testData[3]);
        wrapper.state().multipleMap['4'].should.be.true;
      });

      it('Should select just picked item on selecting by clicking item', () => {
        const lengthBefore = testData.slice(0, 2).length;
        instance._listSelectHandler(testData[3]);
        (wrapper.state('selected') as SelectItem[]).length.should.equal(lengthBefore + 1);
      });

      it('Should add item to selection on clicking by checkbox', () => {
        const lengthBefore = testData.slice(0, 2).length;
        instance._listSelectHandler(testData[3], {} as Event);
        (wrapper.state('selected') as SelectItem[]).length.should.equal(lengthBefore + 1);
      });

      it('Should close popup on selecting by item', () => {
        instance._hidePopup = sandbox.spy();
        instance._listSelectHandler(testData[3], {} as Event);
        instance._hidePopup.should.have.been.called;
      });

      it('Should not close popup on selecting by checkbox', () => {
        instance._hidePopup = sandbox.spy();
        instance._listSelectHandler(testData[3], {} as Event, {tryKeepOpen: true});
        instance._hidePopup.should.not.be.called;
      });
    });

    describe('On deselecting', () => {
      it('Should remove item from selected on deselecting', () => {
        const wrapper = mountSelectMultiple();
        const instance = wrapper.instance();
        const lengthBefore = testData.slice(0, 2).length;
        instance._listSelectHandler(testData[0]);
        (wrapper.state('selected') as SelectItem[]).length.should.equal(lengthBefore - 1);
      });

      it('Should call onDeselect on deselecting item', () => {
        const wrapper = mountSelectMultiple({
          onDeselect: sandbox.spy(),
        });
        const instance = wrapper.instance();
        instance._listSelectHandler(testData[0]);
        wrapper.prop('onDeselect')!.should.be.calledWith(testData[0]);
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
        disabled: true,
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
        rgItemType: List.ListProps.Type.SEPARATOR,
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
        rgItemType: List.ListProps.Type.CUSTOM,
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
        onSelect: sandbox.spy(),
      });
      const instance = wrapper.instance();
      instance._listSelectHandler(testData[1]);
      wrapper.prop('onSelect')!.should.be.calledOnce;
    });

    it('Should set call onChange on selecting', () => {
      const wrapper = mountSelect({
        onChange: sandbox.spy(),
      });
      const instance = wrapper.instance();
      instance._listSelectHandler(testData[1]);
      wrapper.prop('onChange')!.should.be.calledOnce;
    });

    it('Should hide popup on selecting', () => {
      const wrapper = mountSelect();
      const instance = wrapper.instance();
      instance._hidePopup = sandbox.spy();
      instance._listSelectHandler(testData[1]);
      instance._hidePopup.should.be.calledOnce;
    });
  });

  describe('On select all', () => {
    it('Should react on select all action', () => {
      const wrapper = shallowSelectMultiple();
      const instance = wrapper.instance();
      instance.setState = sandbox.spy();

      instance._listSelectAllHandler();

      instance.setState.should.be.called;
    });

    it('Should react on select all action with false flag', () => {
      const wrapper = shallowSelectMultiple();
      const instance = wrapper.instance();
      instance.setState = sandbox.spy();

      instance._listSelectAllHandler(false);

      instance.setState.should.be.called;
    });

    it('Should set selected on selecting all', () => {
      const wrapper = mountSelectMultiple({
        onSelect: sandbox.spy(),
        selected: [],
        data: testData,
      });
      const instance = wrapper.instance();
      instance._listSelectAllHandler();
      wrapper.state().selected!.should.be.eql(testData);
    });

    it('Should set call onSelect on selecting', () => {
      const wrapper = mountSelectMultiple({
        onSelect: sandbox.spy(),
        selected: [testData[0]],
        data: testData,
      });
      const instance = wrapper.instance();
      instance._listSelectAllHandler();
      wrapper.prop('onSelect')!.should.be.calledThrice;
    });

    it('Should set call onDeselect on call handler with false flag', () => {
      const wrapper = mountSelectMultiple({
        onDeselect: sandbox.spy(),
        selected: [testData[0], testData[1], testData[2]],
        data: testData,
      });
      const instance = wrapper.instance();
      instance._listSelectAllHandler(false);
      wrapper.prop('onDeselect')!.should.be.calledThrice;
    });

    it('Should set call onChange on selecting', () => {
      const wrapper = mountSelectMultiple({
        onChange: sandbox.spy(),
        selected: [testData[0]],
        data: testData,
      });
      const instance = wrapper.instance();
      instance._listSelectAllHandler();
      wrapper.prop('onChange')!.should.be.calledOnce;
    });
  });

  describe('Popup', () => {
    let container: HTMLElement | null;
    const mountSelectToContainer = (props: SelectAttrs) => {
      mountWrapper = mount(<Select {...props} />, {
        attachTo: container,
      });
    };
    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container!);
      container = null;
    });

    it('Should pass loading message and indicator to popup if loading', () => {
      const wrapper = mountSelect({loading: true, loadingMessage: 'test message'});
      const instance = wrapper.instance();
      instance._showPopup();
      instance._popup!.props.message!.should.equal('test message');
      instance._popup!.props.loading.should.be.true;
    });

    it('Should pass notFoundMessage message to popup if not loading and data is empty', () => {
      const wrapper = mountSelect({data: [], notFoundMessage: 'test not found'});
      const instance = wrapper.instance();
      instance._showPopup();
      instance._popup!.props.message!.should.equal('test not found');
    });

    describe('filter focusing', () => {
      const SHOW_TIMEOUT = 300;

      beforeEach(() => {
        mountSelectToContainer({filter: true});
      });

      it('Should focus the filter on opening', async () => {
        const instance = mountWrapper!.instance();
        instance._showPopup();
        // Can't use fake timers here, as Popup redraws by requestAnimationFrame.
        // Stabbing it isn't possible either, as it hangs IE11
        await new Promise<void>(resolve => {
          setTimeout(() => {
            instance._popup!.filter!.should.equal(document.activeElement);
            resolve();
          }, SHOW_TIMEOUT);
        });
      });

      it('Should focus the filter on second opening', async () => {
        const instance = mountWrapper!.instance();
        instance._showPopup();
        instance._hidePopup();
        instance._showPopup();
        await new Promise<void>(resolve => {
          setTimeout(() => {
            instance._popup!.filter!.should.equal(document.activeElement);
            resolve();
          }, SHOW_TIMEOUT);
        });
      });
    });

    it('Should restore focus on select in button mode after closing popup', () => {
      mountSelectToContainer({
        data: testData,
        filter: true,
      });
      const instance = mountWrapper!.instance();

      instance._showPopup();
      instance._hidePopup(true);
      document.activeElement!.should.equal(mountWrapper!.find('button[data-test*="ring-select__button"]').getDOMNode());
    });

    describe('Focus after close', () => {
      let instance: Select;
      let targetInput: HTMLElement | null;
      beforeEach(() => {
        targetInput = document.createElement('input');
        document.body.appendChild(targetInput);

        mountSelectToContainer({
          data: testData,
          filter: true,
          targetElement: targetInput,
        });
        instance = mountWrapper!.instance();

        instance._showPopup();
      });

      afterEach(() => {
        document.body.removeChild(targetInput!);
        targetInput = null;
      });

      it('Should restore focus on provided target element after closing popup', () => {
        instance._hidePopup(true);

        targetInput!.should.equal(document.activeElement);
      });

      it('Should restore focus on provided target element after closing popup with keyboard', () => {
        simulateCombo('esc');
        targetInput!.should.equal(document.activeElement);
      });

      it('Should not restore focus on provided target element after closing popup with not keyboard event', () => {
        Simulate.click(document.body);

        targetInput!.should.not.equal(document.activeElement);
      });

      it('Should not restore focus on provided target element after closing popup', () => {
        instance._hidePopup();

        targetInput!.should.not.equal(document.activeElement);
      });
    });
  });

  describe('_getResetOption', () => {
    let instance;

    it('should create tags reset option', () => {
      const labelMock = 'label';
      const tagsMock = {
        reset: {
          key: labelMock,
          template: labelMock,
          glyph: 'glyph',
          rgItemType: List.ListProps.Type.CUSTOM,
          className: 'cssClass',
          onClick: () => {},
        },
      };
      instance = shallowSelectMultiple({
        selected: [{key: 0}, {key: 1}],
        tags: tagsMock,
      }).instance();

      const resetOption = instance._getResetOption()!;

      resetOption.rgItemType!.should.be.equal(List.ListProps.Type.CUSTOM);
      resetOption.glyph!.should.be.equal(tagsMock.reset.glyph);
      resetOption.onClick!.should.be.an.instanceof(Function);
    });

    it('should not create tags reset option if it is not provided', () => {
      instance = shallowSelectMultiple({
        selected: [{key: 0}, {key: 1}],
      }).instance();

      should.not.exist(instance._getResetOption());
    });

    it('should not create tags reset option without selected elements', () => {
      instance = shallowSelectMultiple({
        selected: [],
        tags: {reset: {}},
      }).instance();

      should.not.exist(instance._getResetOption());
    });
  });

  describe('_prependResetOption', () => {
    let instance;

    it('should prepend reset option', () => {
      instance = getInstance();
      const newShownData = instance._prependResetOption([{key: 0}]);

      newShownData.length.should.be.equal(2);
    });

    it('should prepend reset option with separator', () => {
      instance = getInstance(true);

      const newShownData = instance._prependResetOption([{key: 0}]);

      newShownData.length.should.be.equal(3);
    });

    it('should not prepend reset option', () => {
      instance = getInstance(true, []);

      const newShownData = instance._prependResetOption([]);

      newShownData.length.should.be.equal(0);
    });

    function getInstance(resetWithSeparator?: boolean, selected?: SelectItem[]) {
      const resetMock: Tags = {
        reset: {},
      };
      if (resetWithSeparator) {
        resetMock.reset!.separator = true;
      }

      return shallowSelectMultiple({
        selected: selected || [{key: 0}, {key: 1}],
        tags: resetMock,
      }).instance();
    }
  });

  describe('_redrawPopup', () => {
    let clock: Sinon.SinonFakeTimers;

    beforeEach(() => {
      clock = sandbox.useFakeTimers({toFake: ['setTimeout']});
    });

    it('should not redraw a popup in default mode', () => {
      const instance = shallowSelect().instance();
      sandbox.stub(instance, '_showPopup');
      instance._redrawPopup();

      clock.tick(0);
      instance._showPopup.should.not.have.been.called;
    });

    it('should redraw a popup in multiselect mode', () => {
      const instance = shallowSelectMultiple({
        selected: testData.slice(1),
      }).instance();

      sandbox.stub(instance, '_showPopup');
      instance._redrawPopup();

      clock.tick(0);
      instance._showPopup.should.have.been.called;
    });
  });
});
