import {cleanup, fireEvent, render, screen} from '@testing-library/react';

import userEvent from '@testing-library/user-event';

import {beforeEach, expect} from 'vitest';

import {act} from 'react';

import List from '../list/list';
import simulateCombo from '../../test-helpers/simulate-combo';

import Select, {MultipleSelectAttrs, SelectAttrs, SelectItem, SingleSelectAttrs} from './select';
import styles from './select.css';

import {Tags} from './select__popup';

const selectedIconSelector = `.${styles.selectedIcon.split(/\s/)[0]}`;

describe('Select', () => {
  const testData: SelectItem[] = [
    {key: 1, label: 'first1', rgItemType: List.ListProps.Type.ITEM},
    {key: 2, label: 'test2', rgItemType: List.ListProps.Type.ITEM},
    {key: 3, label: 'test3', rgItemType: List.ListProps.Type.ITEM},
    {key: 4, label: 'four4', selectedLabel: '', rgItemType: List.ListProps.Type.ITEM},
  ];

  const defaultProps = () => ({
    renderOptimization: false,
    data: testData,
    selected: testData[0],
    onChange: sandbox.spy(),
    onFilter: sandbox.spy(),
    onFocus: sandbox.spy(),
    onBlur: sandbox.spy(),
    filter: true,
  });

  const renderSelect = (props?: SingleSelectAttrs) => render(<Select {...defaultProps()} {...props} />);

  const defaultPropsMultiple = (): MultipleSelectAttrs => ({
    renderOptimization: false,
    data: testData,
    selected: testData.slice(0, 2),
    filter: true,
    multiple: true,
    onChange: sandbox.spy(),
  });

  const renderSelectMultiple = (props?: MultipleSelectAttrs) =>
    render(<Select {...defaultPropsMultiple()} {...props} />);

  it('Should initialize', () => {
    renderSelect();
    expect(screen.getByTestId('ring-select')).to.exist;
  });

  it('Should save selected item', () => {
    renderSelect();
    expect(screen.getByRole('combobox', {name: 'first1'})).to.exist;
  });

  it('Should provide select types', () => {
    expect(Select.Type).to.exist;
    expect(Select.Type.BUTTON).to.exist;
    expect(Select.Type.INPUT).to.exist;
    expect(Select.Type.CUSTOM).to.exist;
    expect(Select.Type.INLINE).to.exist;
  });

  it('Should take provided className', () => {
    renderSelect({className: 'foo-bar'});
    expect(screen.getByTestId('ring-select')).to.have.class('foo-bar');
  });

  it('Should highlight selected item', async () => {
    renderSelect({selected: testData[2]});
    const button = screen.getByRole('combobox', {name: 'test3'});
    const user = userEvent.setup();
    await user.click(button);
    expect(screen.getByRole('row', {selected: true})).to.have.text('test3');
  });

  it('should update rendered data if props change', async () => {
    const {rerender} = renderSelect();
    rerender(<Select {...defaultProps()} data={[testData[0]]} />);
    const button = screen.getByRole('combobox', {name: 'first1'});
    const user = userEvent.setup();
    await user.click(button);
    expect(screen.getAllByTestId('ring-list-item-action ring-list-item')).to.have.length(1);
  });

  it('Should use selectedLabel for select button title if provided', () => {
    renderSelect({
      selected: {
        key: 1,
        label: 'test1',
        selectedLabel: 'testLabel',
      },
    });
    const button = screen.getByRole('combobox', {name: 'testLabel'});
    expect(button).to.exist;
  });

  it('Should use label for select button title', () => {
    renderSelect();
    const button = screen.getByRole('combobox', {name: 'first1'});
    expect(button).to.exist;
  });

  it('Should clear selected on clearing', async () => {
    renderSelect({clear: true});
    const clearButton = screen.getByRole('button', {name: 'Clear selection'});
    const user = userEvent.setup();
    await user.click(clearButton);
    expect(screen.getByRole('combobox', {name: 'Select an option'})).to.exist;
  });

  it('Should call onChange on clearing', async () => {
    const props = {...defaultProps(), clear: true};
    renderSelect(props);
    const clearButton = screen.getByRole('button', {name: 'Clear selection'});
    const user = userEvent.setup();
    await user.click(clearButton);
    expect(props.onChange).to.be.calledOnce;
    expect(props.onChange).to.be.called.calledWith(null);
  });

  it('Should pass selected item and event to onChange', async () => {
    const props = defaultProps();
    renderSelect(props);
    const button = screen.getByRole('combobox', {name: 'first1'});
    const user = userEvent.setup();
    await user.click(button);
    const secondItem = screen.getByRole('button', {name: 'test2'});
    await user.click(secondItem);
    expect(props.onChange).to.be.called.calledWithMatch({key: 2}, {originalEvent: {type: 'click'}});
  });

  it('Should clear selected when rerendering with no selected item', () => {
    const {rerender} = renderSelect();
    rerender(<Select {...defaultProps()} selected={null} />);
    expect(screen.getByRole('combobox', {name: 'Select an option'})).to.exist;
  });

  it('Should handle ENTER shortcut', async () => {
    const onDone = vi.fn();
    renderSelect({type: Select.Type.INPUT, onDone});
    const user = userEvent.setup();
    await user.tab(); // focus the input to enable shortcuts
    simulateCombo('enter');
    expect(onDone).toHaveBeenCalled();
  });

  it('Should open popup on key handling if not opened', async () => {
    renderSelect({type: Select.Type.INPUT});
    const user = userEvent.setup();
    await user.tab(); // focus the input to enable shortcuts
    act(() => simulateCombo('up'));
    expect(screen.getByRole('grid')).to.exist;
    cleanup();
    renderSelect({type: Select.Type.INPUT});
    await user.tab(); // focus the input to enable shortcuts
    act(() => simulateCombo('down'));
    expect(screen.getByRole('grid')).to.exist;
  });

  it('Should not open popup if disabled', async () => {
    renderSelect({disabled: true});
    const button = screen.getByRole('combobox', {name: 'first1'});
    const user = userEvent.setup();
    await user.click(button);
    expect(screen.queryByRole('grid')).to.not.exist;
  });

  it('Should close popup on click if it is already open', async () => {
    renderSelect();
    const button = screen.getByRole('combobox', {name: 'first1'});
    const user = userEvent.setup();
    await user.click(button);
    await user.click(button);
    expect(screen.queryByRole('grid')).to.not.exist;
  });

  it('Should call onAdd on adding', async () => {
    const onAdd = vi.fn();
    renderSelect({add: {alwaysVisible: true, label: 'Add item'}, onAdd});
    const button = screen.getByRole('combobox', {name: 'first1'});
    const user = userEvent.setup();
    await user.click(button);
    const addButton = screen.getByRole('button', {name: 'Add item'});
    await user.click(addButton);
    expect(onAdd).toHaveBeenCalledOnce();
  });

  it('Should call onFocus on input focus', async () => {
    const props = defaultProps();
    renderSelect({...props, type: Select.Type.INPUT});
    const filter = screen.getByRole('combobox');
    const user = userEvent.setup();
    await user.click(filter);
    expect(props.onFocus).to.be.called;
  });

  it('Should call onBlur on input blur', async () => {
    const props = {...defaultProps(), type: Select.Type.INPUT};
    renderSelect(props);
    const filter = screen.getByRole('combobox');
    const user = userEvent.setup();
    await user.click(filter);
    await user.tab();
    expect(props.onBlur).to.be.called;
  });

  it('Should close popup if input lost focus in INPUT mode', async () => {
    renderSelect({type: Select.Type.INPUT});
    const filter = screen.getByRole('combobox');
    const user = userEvent.setup();
    await user.click(filter);
    await user.tab();
    expect(screen.queryByRole('grid')).to.not.exist;
  });

  it('Should not close popup while clicking on popup in INPUT mode', async () => {
    renderSelect({type: Select.Type.INPUT});
    const filter = screen.getByRole('combobox');
    const user = userEvent.setup();
    await user.click(filter);
    await user.click(screen.getByRole('grid'));
    expect(screen.getByRole('grid')).to.exist;
  });

  describe('Derived state', () => {
    it('Should show initial data', () => {
      renderSelect({showPopup: true});
      expect(screen.getByRole('row', {name: 'first1'})).to.exist;
    });

    it('Should update shown data', async () => {
      const {rerender} = renderSelect();
      rerender(<Select {...defaultProps()} data={[]} />);
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      expect(screen.queryByTestId('ring-list-item-action ring-list-item')).to.not.exist;
    });

    it('Should reset selection when toggling multiple state', () => {
      const {rerender} = renderSelect();
      rerender(<Select {...defaultProps()} selected={undefined} multiple />);
      const button = screen.getByRole('combobox', {name: 'Select an option'});
      expect(button).to.have.text('Select an option');
      rerender(<Select {...defaultProps()} />);
      expect(button).to.have.text('Select an option');
    });

    it('Should not reset selection if mulitiple prop is the same as previous', () => {
      const {rerender} = renderSelect();
      rerender(<Select {...defaultProps()} multiple={false} />);
      const button = screen.getByRole('combobox', {name: 'first1'});
      expect(button).to.have.text('first1');
    });

    it('Should update selected index for select', async () => {
      const {rerender} = renderSelect();
      const selectedItem = createItem('New item');
      rerender(<Select {...defaultProps()} selected={selectedItem} data={[createItem(), selectedItem]} />);
      const button = screen.getByRole('combobox', {name: 'New item'});
      const user = userEvent.setup();
      await user.click(button);
      expect(screen.getByRole('row', {selected: true})).to.have.text('New item');
    });

    it('Should update selected index for multiple select if selected is changed', async () => {
      const {rerender} = renderSelectMultiple();
      const selectedItem = createItem('New item');
      rerender(<Select {...defaultProps()} multiple selected={[selectedItem]} data={[createItem(), selectedItem]} />);
      const button = screen.getByRole('combobox', {name: 'New item'});
      const user = userEvent.setup();
      await user.click(button);
      expect(screen.getByRole('row', {selected: true})).to.have.text('New item');
    });

    it('Should update selected index for multiple select if selected is changed but count of element is the same', async () => {
      const firstItem = createItem('First item');
      const secondItem = createItem('Second item');

      const {rerender} = renderSelect();
      const data = [firstItem, secondItem];
      rerender(<Select {...defaultProps()} multiple selected={[secondItem]} data={data} />);
      rerender(<Select {...defaultProps()} multiple selected={[firstItem]} data={data} />);
      const button = screen.getByRole('combobox', {name: 'First item'});
      const user = userEvent.setup();
      await user.click(button);
      expect(screen.getByRole('row', {selected: true})).to.have.text('First item');
    });

    function createItem(label?: string): SelectItem {
      createItem.key += 1;
      return {key: createItem.key, label};
    }
    createItem.key = 0;
  });

  describe('DOM', () => {
    it('Should place select button inside container', () => {
      renderSelect();
      expect(screen.getByTestId('ring-select')).to.have.class(styles.select);
    });

    it('Should disable select button if needed', () => {
      renderSelect({
        disabled: true,
      });
      expect(screen.getByRole<HTMLButtonElement>('combobox', {name: 'first1'}).disabled).to.be.true;
    });

    it('Should not disable select button if not needed', () => {
      renderSelect({
        disabled: false,
      });
      expect(screen.getByRole<HTMLButtonElement>('combobox', {name: 'first1'}).disabled).to.be.false;
    });

    it('Should place input inside in INPUT mode', () => {
      renderSelect({type: Select.Type.INPUT});
      expect(screen.getByRole('combobox')).to.exist;
    });

    it('Should place icons inside', () => {
      renderSelect();
      expect(screen.getByTestId('ring-select')).to.have.descendants(`.${styles.icons}`);
    });

    it('Should add selected item icon to button', () => {
      renderSelect({
        selected: {
          key: 1,
          label: 'test',
          icon: 'fakeImageUrl',
        },
      });
      expect(screen.getByTestId('ring-select')).to.have.descendants(selectedIconSelector);
    });

    it('Should not display selected item icon if it is not provided', () => {
      renderSelect({selected: {key: 1, label: 'test', icon: undefined}});
      expect(screen.getByTestId('ring-select')).to.not.have.descendants(selectedIconSelector);
    });

    it('Should display selected item icon', () => {
      renderSelect({
        selected: {
          key: 1,
          label: 'test',
          icon: 'http://fake.image/',
        },
      });
      const icon: HTMLElement = screen.getByTestId('ring-select').querySelector(selectedIconSelector)!;
      expect(icon.style.backgroundImage).to.contain('http://fake.image/');
    });

    it('Should place icons inside in INPUT mode', () => {
      renderSelect({type: Select.Type.INPUT});
      expect(screen.getByTestId('ring-select')).to.have.descendants(`.${styles.icons}`);
    });

    it('Should open select dropdown on click', async () => {
      renderSelect();
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      expect(screen.getByTestId('ring-popup')).to.exist;
    });

    describe('Bottom toolbar', () => {
      it('Should not add "Add" button if enabled but filter query is empty', async () => {
        renderSelect({add: {label: 'Add item'}});
        const button = screen.getByRole('combobox', {name: 'first1'});
        const user = userEvent.setup();
        await user.click(button);
        expect(screen.queryByRole('button', {name: 'Add item'})).to.not.exist;
      });

      it('Should add "Add" button if enabled and filter query not empty', async () => {
        renderSelect({type: Select.Type.INPUT, add: {label: 'Add item'}});
        const filter = screen.getByRole('combobox');
        const user = userEvent.setup();
        await user.type(filter, 'test');
        expect(screen.getByRole('button', {name: 'Add item'})).to.exist;
      });

      it('Should add "Add" button if alwaysVisible is set', async () => {
        renderSelect({
          add: {
            alwaysVisible: true,
            label: 'Add item',
          },
        });
        const button = screen.getByRole('combobox', {name: 'first1'});
        const user = userEvent.setup();
        await user.click(button);
        expect(screen.getByRole('button', {name: 'Add item'})).to.exist;
      });

      it('Should place label instead filterValue to "Add" button if alwaysVisible is set', async () => {
        renderSelect({
          add: {
            alwaysVisible: true,
            label: 'Add Something',
          },
        });
        const button = screen.getByRole('combobox', {name: 'first1'});
        const user = userEvent.setup();
        await user.click(button);
        expect(screen.getByRole('button', {name: 'Add Something'})).to.exist;
      });

      it('Should process filterValue into a label at the "Add" button if "add.label" prop is a function', async () => {
        renderSelect({
          type: Select.Type.INPUT,
          add: {
            label: value => `--${value}--`,
          },
        });
        const filter = screen.getByRole('combobox');
        const user = userEvent.setup();
        await user.clear(filter);
        await user.type(filter, 'test');
        expect(screen.getByRole('button', {name: '--test--'})).to.exist;
      });

      it('Should add hint if specified', async () => {
        renderSelect({
          hint: 'blah blah',
        });
        const button = screen.getByRole('combobox', {name: 'first1'});
        const user = userEvent.setup();
        await user.click(button);
        expect(screen.getByTestId('ring-list-hint')).to.exist;
      });

      it('Hint should be placed under "add" button', async () => {
        renderSelect({
          add: {alwaysVisible: true},
          hint: 'blah blah',
        });
        const button = screen.getByRole('combobox', {name: 'first1'});
        const user = userEvent.setup();
        await user.click(button);
        expect(screen.getByTestId('ring-list-hint')).to.exist;
      });
    });
  });

  describe('getListItems', () => {
    it('Should filter items by label', async () => {
      renderSelect({type: Select.Type.INPUT});
      const filter = screen.getByRole('combobox');
      const user = userEvent.setup();
      await user.clear(filter);
      await user.type(filter, 'test3');
      const filtered = screen.getAllByTestId('ring-list-item-action ring-list-item');
      expect(filtered.length).to.equal(1);
      expect(filtered[0]).to.have.text('test3');
    });

    it('Should filter items by part of label', async () => {
      renderSelect({type: Select.Type.INPUT});
      const filter = screen.getByRole('combobox');
      const user = userEvent.setup();
      await user.clear(filter);
      await user.type(filter, 'test');
      const filtered = screen.getAllByTestId('ring-list-item-action ring-list-item');
      expect(filtered.length).to.equal(2);
    });

    it('Should not filter separators', async () => {
      const separators = [
        {
          rgItemType: List.ListProps.Type.SEPARATOR,
          key: 1,
          description: 'test',
        },
      ];
      renderSelect({type: Select.Type.INPUT, data: separators});
      const filter = screen.getByRole('combobox');
      const user = userEvent.setup();
      await user.clear(filter);
      await user.type(filter, 'foo');
      const filtered = screen.getAllByTestId('ring-list-separator');
      expect(filtered[0]).to.have.text('test');
    });

    it('Should filter custom items with label', async () => {
      const customItems = [
        {
          rgItemType: List.ListProps.Type.CUSTOM,
          key: 1,
          label: 'bar',
          template: <div />,
        },
      ];
      renderSelect({type: Select.Type.INPUT, data: customItems});
      const filter = screen.getByRole('combobox');
      const user = userEvent.setup();
      await user.clear(filter);
      await user.type(filter, 'foo');
      const filtered = screen.queryAllByTestId('ring-list-item-action ring-list-item');
      expect(filtered).to.deep.equal([]);
    });

    it('Should not filter items without label', async () => {
      const items = [
        {
          key: 1,
          description: 'test',
        },
      ];
      renderSelect({type: Select.Type.INPUT, data: items});
      const filter = screen.getByRole('combobox');
      const user = userEvent.setup();
      await user.clear(filter);
      await user.type(filter, 'foo');
      const filtered = screen.getAllByTestId('ring-list-item-action ring-list-item');
      expect(filtered[0]).to.have.text('test');
    });

    it('Should use custom filter.fn if provided', async () => {
      const filterStub = sandbox.stub().returns(true);

      renderSelect({
        type: Select.Type.INPUT,
        filter: {fn: filterStub},
      });
      const filter = screen.getByRole('combobox');
      const user = userEvent.setup();
      await user.clear(filter);
      await user.type(filter, 'test3');
      const filtered = screen.getAllByTestId('ring-list-item-action ring-list-item');

      expect(filtered.length).to.equal(testData.length);
      expect(filterStub).to.have.been.called;
    });

    it('Should write filter query on add button if enabled', async () => {
      renderSelect({
        type: Select.Type.INPUT,
        add: {
          prefix: 'Add some',
        },
      });
      const filter = screen.getByRole('combobox');
      const user = userEvent.setup();
      await user.clear(filter);
      await user.type(filter, 'foo');
      expect(screen.getByRole('button', {name: 'Add some foo'})).to.exist;
    });
  });

  describe('Filtering', () => {
    it('Should call onFilter on input changes', async () => {
      const props = {...defaultProps(), type: Select.Type.INPUT};
      renderSelect(props);
      const filter = screen.getByRole('combobox');
      const user = userEvent.setup();
      await user.type(filter, 'a');
      expect(props.onFilter).to.be.called;
    });

    it('Should open popup on input changes if in focus', async () => {
      renderSelect({type: Select.Type.INPUT});
      const filter = screen.getByRole('combobox');
      const user = userEvent.setup();
      await user.type(filter, 'a');
      expect(screen.getByTestId('ring-popup')).to.exist;
    });

    it('should filter if not focused but not in input mode', async () => {
      const props = defaultProps();
      renderSelect(props);
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      const filter = screen.getByRole('textbox');
      await user.type(filter, 'a', {skipClick: true});

      expect(props.onFilter).to.be.called;
    });

    it('Should not open popup on input changes if not in focus', async () => {
      renderSelect({type: Select.Type.INPUT});
      const filter = screen.getByRole('combobox');
      const user = userEvent.setup();
      await user.type(filter, 'a', {skipClick: true});
      expect(screen.queryByTestId('ring-popup')).to.not.exist;
    });

    it('Should return empty string if not input mode and filter is disabled', async () => {
      const onAdd = vi.fn();
      renderSelect({filter: false, add: {alwaysVisible: true, label: 'Add item'}, onAdd});
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      const addButton = screen.getByRole('button', {name: 'Add item'});
      await user.click(addButton);
      expect(onAdd).toHaveBeenCalledWith('');
    });

    it('Should return input value if input mode enabled', async () => {
      const onAdd = vi.fn();
      renderSelect({filter: false, type: Select.Type.INPUT, add: {}, onAdd});
      const filter = screen.getByRole('combobox');
      const user = userEvent.setup();
      await user.clear(filter);
      await user.type(filter, 'test input');
      const addButton = screen.getByRole('button', {name: 'test input'});
      await user.click(addButton);
      expect(onAdd).toHaveBeenCalledWith('test input');
    });

    it('Should set value to popup input if passed', async () => {
      const onAdd = vi.fn();
      renderSelect({add: {}, onAdd});
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      const filter = screen.getByRole('textbox');
      await user.type(filter, 'test');
      const addButton = screen.getByRole('button', {name: 'test'});
      await user.click(addButton);
      expect(onAdd).toHaveBeenCalledWith('test');
    });

    it('Should clear filter value when closing', async () => {
      renderSelect();
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      let filter = screen.getByRole('textbox');
      await user.type(filter, 'test');
      await user.click(button);
      await user.click(button);
      filter = screen.getByRole('textbox');
      expect(filter).to.have.value('');
    });
  });

  describe('Multiple', () => {
    it('Should fill multipleMap on initialization', async () => {
      renderSelectMultiple();
      const user = userEvent.setup();
      const button = screen.getByRole('combobox', {name: 'first1, test2'});
      await user.click(button);
      const firstCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'first1'});
      expect(firstCheckbox.checked).to.be.true;
      const secondCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test2'});
      expect(secondCheckbox.checked).to.be.true;
      const thirdCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test3'});
      expect(thirdCheckbox.checked).to.be.false;
      const fourthCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'four4'});
      expect(fourthCheckbox.checked).to.be.false;
    });

    it('Should fill multipleMap on selection change', async () => {
      const {rerender} = renderSelectMultiple();
      rerender(<Select {...defaultPropsMultiple()} selected={testData.slice(1, 2)} />);
      const user = userEvent.setup();
      const button = screen.getByRole('combobox', {name: 'test2'});
      await user.click(button);
      const firstCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'first1'});
      expect(firstCheckbox.checked).to.be.false;
      const secondCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test2'});
      expect(secondCheckbox.checked).to.be.true;
      const thirdCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test3'});
      expect(thirdCheckbox.checked).to.be.false;
      const fourthCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'four4'});
      expect(fourthCheckbox.checked).to.be.false;
    });

    it('Should construct label from selected array', () => {
      renderSelectMultiple();
      const button = screen.getByRole('combobox', {name: 'first1, test2'});
      expect(button).to.exist;
    });

    it('Should skip empty labels', () => {
      renderSelectMultiple({
        selected: testData.slice(2),
      });
      const button = screen.getByRole('combobox', {name: 'test3'});
      expect(button).to.exist;
    });

    it('Should detect selection is empty according on not empty array', () => {
      renderSelectMultiple();
      const button = screen.getByRole('combobox', {name: 'first1, test2'});
      expect(button).to.not.have.class(styles.buttonValueEmpty);
    });

    it('Should detect selection is empty according on empty array', () => {
      renderSelectMultiple({selected: []});
      const button = screen.getByRole('combobox', {name: 'Select an option'});
      expect(button).to.have.class(styles.buttonValueEmpty);
    });

    it('Should clear selected on clearing', async () => {
      renderSelectMultiple({clear: true});
      const clearButton = screen.getByRole('button', {name: 'Clear selection'});
      const user = userEvent.setup();
      await user.click(clearButton);
      const button = screen.getByRole('combobox', {name: 'Select an option'});
      await user.click(button);
      const firstCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'first1'});
      expect(firstCheckbox.checked).to.be.false;
      const secondCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test2'});
      expect(secondCheckbox.checked).to.be.false;
      const thirdCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test3'});
      expect(thirdCheckbox.checked).to.be.false;
      const fourthCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'four4'});
      expect(fourthCheckbox.checked).to.be.false;
    });

    it('Should not draw "clear" button if multiple and nothing selected', () => {
      const {rerender} = renderSelectMultiple();
      rerender(<Select {...defaultPropsMultiple()} clear selected={[]} />);
      const clearButton = screen.queryByRole('button', {name: 'Clear selection'});
      expect(clearButton).to.not.exist;
    });

    it('Should call onChange on clearing', async () => {
      const props = {...defaultPropsMultiple(), clear: true};
      renderSelectMultiple(props);
      const clearButton = screen.getByRole('button', {name: 'Clear selection'});
      const user = userEvent.setup();
      await user.click(clearButton);
      expect(props.onChange!).to.be.calledOnce;
      expect(props.onChange!).to.be.called.calledWith([]);
    });

    it('Should clear selected when rerendering with no selected item in multiple mode', async () => {
      const {rerender} = renderSelectMultiple();
      rerender(<Select {...defaultPropsMultiple()} selected={null as never} />);
      const button = screen.getByRole('combobox', {name: 'Select an option'});
      const user = userEvent.setup();
      await user.click(button);
      const firstCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'first1'});
      expect(firstCheckbox.checked).to.be.false;
      const secondCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test2'});
      expect(secondCheckbox.checked).to.be.false;
      const thirdCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test3'});
      expect(thirdCheckbox.checked).to.be.false;
      const fourthCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'four4'});
      expect(fourthCheckbox.checked).to.be.false;
    });

    it('Should update selected checkboxes on selected update', async () => {
      const {rerender} = renderSelectMultiple();
      rerender(<Select {...defaultPropsMultiple()} selected={[]} />);
      const button = screen.getByRole('combobox', {name: 'Select an option'});
      const user = userEvent.setup();
      await user.click(button);
      const firstCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'first1'});
      expect(firstCheckbox.checked).to.be.false;
    });

    describe('On selecting', () => {
      it('Should select just picked item on selecting by clicking item', async () => {
        renderSelectMultiple();
        let button = screen.getByRole('combobox', {name: 'first1, test2'});
        const user = userEvent.setup();
        await user.click(button);
        const fourthItem = screen.getByRole('button', {name: 'four4'});
        await user.click(fourthItem);
        button = screen.getByRole('combobox', {name: 'first1, test2'});
        await user.click(button);
        const firstCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'first1'});
        expect(firstCheckbox.checked).to.be.true;
        const secondCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test2'});
        expect(secondCheckbox.checked).to.be.true;
        const thirdCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test3'});
        expect(thirdCheckbox.checked).to.be.false;
        const fourthCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'four4'});
        expect(fourthCheckbox.checked).to.be.true;
      });

      it('Should add item to selection on clicking by checkbox', () => {
        renderSelectMultiple();
        const button = screen.getByRole('combobox', {name: 'first1, test2'});
        fireEvent.click(button);
        const fourthCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'four4'});
        expect(fourthCheckbox.checked).to.be.false;
        fireEvent.click(fourthCheckbox);
        expect(fourthCheckbox.checked).to.be.true;
      });

      it('Should close popup on selecting by item', async () => {
        renderSelectMultiple();
        const button = screen.getByRole('combobox', {name: 'first1, test2'});
        const user = userEvent.setup();
        await user.click(button);
        const fourthItem = screen.getByRole('button', {name: 'four4'});
        await user.click(fourthItem);
        const list = screen.queryByRole('grid');
        expect(list).to.not.exist;
      });

      it('Should not close popup on selecting by checkbox', async () => {
        renderSelectMultiple();
        const button = screen.getByRole('combobox', {name: 'first1, test2'});
        const user = userEvent.setup();
        await user.click(button);
        const fourthCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'four4'});
        await user.click(fourthCheckbox);
        const list = screen.getByRole('grid');
        expect(list).to.exist;
      });
    });

    describe('On deselecting', () => {
      it('Should remove item from selected on deselecting', async () => {
        renderSelectMultiple();
        let button = screen.getByRole('combobox', {name: 'first1, test2'});
        const user = userEvent.setup();
        await user.click(button);
        const firstItem = screen.getByRole('button', {name: 'first1'});
        await user.click(firstItem);
        button = screen.getByRole('combobox', {name: 'test2'});
        await user.click(button);
        const firstCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'first1'});
        expect(firstCheckbox.checked).to.be.false;
        const secondCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test2'});
        expect(secondCheckbox.checked).to.be.true;
        const thirdCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test3'});
        expect(thirdCheckbox.checked).to.be.false;
        const fourthCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'four4'});
        expect(fourthCheckbox.checked).to.be.false;
      });

      it('Should call onDeselect on deselecting item', async () => {
        const onDeselect = sandbox.spy();
        renderSelectMultiple({onDeselect});
        const button = screen.getByRole('combobox', {name: 'first1, test2'});
        const user = userEvent.setup();
        await user.click(button);
        const firstItem = screen.getByRole('button', {name: 'first1'});
        await user.click(firstItem);
        expect(onDeselect).to.be.calledWithMatch(testData[0]);
      });
    });
  });

  describe('On selecting', () => {
    it('Should not react on selecting disabled element', async () => {
      renderSelect({
        data: [
          ...testData,
          {
            key: 5,
            label: 'test',
            disabled: true,
          },
        ],
      });
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      const fifthItem = screen.getByRole('button', {name: 'test'});
      await user.click(fifthItem);
      expect(screen.getByRole('row', {selected: true})).to.have.text('first1');
    });

    it('Should not react on selecting separator', async () => {
      renderSelect({data: [...testData, {key: 5, label: 'test', rgItemType: List.ListProps.Type.SEPARATOR}]});
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      const fifthItem = screen.getByTestId('ring-list-separator');
      await user.click(fifthItem);
      expect(screen.getByRole('row', {selected: true})).to.have.text('first1');
    });

    it('Should react on selecting custom item', async () => {
      renderSelect({data: [...testData, {key: 5, template: 'test', rgItemType: List.ListProps.Type.CUSTOM}]});
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      const fifthItem = screen.getByRole('button', {name: 'test'});
      await user.click(fifthItem);
      await user.click(button);
      expect(screen.getByRole('row', {selected: true})).to.have.text('test');
    });

    it('Should set selected on selecting', async () => {
      renderSelect();
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      const fourthItem = screen.getByRole('button', {name: 'four4'});
      await user.click(fourthItem);
      await user.click(button);
      const selected = screen.getByRole('row', {selected: true});
      expect(selected).to.have.text('four4');
    });

    it('Should set call onSelect on selecting', async () => {
      const onSelect = sandbox.spy();
      renderSelect({
        onSelect,
      });
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      const secondItem = screen.getByRole('button', {name: 'test2'});
      await user.click(secondItem);
      expect(onSelect).to.be.calledWith(testData[1]);
    });

    it('Should set call onChange on selecting', async () => {
      const onChange = sandbox.spy();
      renderSelect({
        onChange,
      });
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      const secondItem = screen.getByRole('button', {name: 'test2'});
      await user.click(secondItem);
      expect(onChange).to.be.calledOnce;
    });

    it('Should hide popup on selecting', async () => {
      renderSelect();
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      const secondItem = screen.getByRole('button', {name: 'test2'});
      await user.click(secondItem);
      expect(screen.queryByRole('grid')).to.not.exist;
    });
  });

  describe('On select all', () => {
    it('Should set selected on selecting all', async () => {
      renderSelectMultiple({multiple: {selectAll: true}});
      const button = screen.getByRole('combobox', {name: 'first1, test2'});
      const user = userEvent.setup();
      await user.click(button);
      const selectAll = screen.getByRole('button', {name: 'Select all'});
      await user.click(selectAll);
      const firstCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'first1'});
      expect(firstCheckbox.checked).to.be.true;
      const secondCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test2'});
      expect(secondCheckbox.checked).to.be.true;
      const thirdCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test3'});
      expect(thirdCheckbox.checked).to.be.true;
      const fourthCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'four4'});
      expect(fourthCheckbox.checked).to.be.true;
    });

    it('Should react on select all action with false flag', async () => {
      renderSelectMultiple({multiple: {selectAll: true}, selected: testData});
      const button = screen.getByRole('combobox', {name: 'first1, test2, test3'});
      const user = userEvent.setup();
      await user.click(button);
      const deselectAll = screen.getByRole('button', {name: 'Deselect all'});
      await user.click(deselectAll);
      const firstCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'first1'});
      expect(firstCheckbox.checked).to.be.false;
      const secondCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test2'});
      expect(secondCheckbox.checked).to.be.false;
      const thirdCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'test3'});
      expect(thirdCheckbox.checked).to.be.false;
      const fourthCheckbox = screen.getByRole<HTMLInputElement>('checkbox', {name: 'four4'});
      expect(fourthCheckbox.checked).to.be.false;
    });

    it('Should set call onSelect on selecting', async () => {
      const onSelect = sandbox.spy();
      renderSelectMultiple({
        multiple: {selectAll: true},
        onSelect,
        selected: [testData[0]],
        data: testData,
      });
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      const selectAll = screen.getByRole('button', {name: 'Select all'});
      await user.click(selectAll);
      expect(onSelect).to.be.calledThrice;
    });

    it('Should set call onDeselect on call handler with false flag', async () => {
      const onDeselect = sandbox.spy();
      renderSelectMultiple({
        multiple: {selectAll: true},
        onDeselect,
        selected: testData,
        data: testData,
      });
      const button = screen.getByRole('combobox', {name: 'first1, test2, test3'});
      const user = userEvent.setup();
      await user.click(button);
      const deselectAll = screen.getByRole('button', {name: 'Deselect all'});
      await user.click(deselectAll);
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      expect(onDeselect).to.have.callCount(4);
    });

    it('Should set call onChange on selecting', async () => {
      const onChange = sandbox.spy();
      renderSelectMultiple({
        multiple: {selectAll: true},
        onChange,
        selected: [testData[0]],
        data: testData,
      });
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      const selectAll = screen.getByRole('button', {name: 'Select all'});
      await user.click(selectAll);
      expect(onChange).to.be.calledOnce;
    });
  });

  describe('Popup', () => {
    let container: HTMLElement | undefined;
    const renderSelectToContainer = (props: SelectAttrs) =>
      render(<Select renderOptimization={false} {...props} />, {container});
    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container!);
      container = undefined;
    });

    it('Should pass loading message and indicator to popup if loading', async () => {
      renderSelect({loading: true, loadingMessage: 'test message'});
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      expect(screen.getByText('test message')).to.exist;
      expect(screen.getByTestId('ring-loader-inline')).to.exist;
    });

    it('Should pass notFoundMessage message to popup if not loading and data is empty', async () => {
      renderSelect({data: [], notFoundMessage: 'test not found'});
      const button = screen.getByRole('combobox', {name: 'first1'});
      const user = userEvent.setup();
      await user.click(button);
      expect(screen.getByText('test not found')).to.exist;
    });

    describe('filter focusing', () => {
      beforeEach(() => {
        renderSelectToContainer({filter: true});
      });

      it('Should focus the filter on opening', async () => {
        const button = screen.getByRole('combobox', {name: 'Select an option'});
        const user = userEvent.setup();
        await user.click(button);
        const filter = screen.getByRole('textbox');
        expect(filter).to.equal(document.activeElement);
      });

      it('Should focus the filter on second opening', async () => {
        const button = screen.getByRole('combobox', {name: 'Select an option'});
        const user = userEvent.setup();
        await user.click(button);
        await user.click(button);
        await user.click(button);
        const filter = screen.getByRole('textbox');
        expect(filter).to.equal(document.activeElement);
      });
    });

    it('Should restore focus on select in button mode after closing popup', async () => {
      renderSelectToContainer({
        data: testData,
        filter: true,
      });
      let button = screen.getByRole('combobox', {name: 'Select an option'});
      const user = userEvent.setup();
      await user.click(button);
      const secondItem = screen.getByRole('button', {name: 'test2'});
      await user.click(secondItem);
      button = screen.getByRole('combobox', {name: 'test2'});
      expect(button).to.equal(document.activeElement);
    });

    describe('Focus after close', () => {
      let targetInput: HTMLElement | null;
      let button: HTMLElement | null;
      beforeEach(async () => {
        targetInput = document.createElement('input');
        document.body.appendChild(targetInput);

        renderSelectToContainer({
          data: testData,
          filter: true,
          targetElement: targetInput,
        });

        button = screen.getByRole('combobox', {name: 'Select an option'});
        const user = userEvent.setup();
        await user.click(button);
      });

      afterEach(() => {
        document.body.removeChild(targetInput!);
        targetInput = null;
      });

      it('Should restore focus on provided target element after closing popup', async () => {
        const secondItem = screen.getByRole('button', {name: 'test2'});
        const user = userEvent.setup();
        await user.click(secondItem);

        expect(targetInput!).to.equal(document.activeElement);
      });

      it('Should restore focus on provided target element after closing popup with keyboard', () => {
        act(() => simulateCombo('esc'));
        expect(targetInput!).to.equal(document.activeElement);
      });

      it('Should not restore focus on provided target element after closing popup with not keyboard event', () => {
        fireEvent.click(document.body);

        expect(targetInput!).to.not.equal(document.activeElement);
      });

      it('Should not restore focus on provided target element after closing popup', async () => {
        const user = userEvent.setup();
        await user.click(button!);

        expect(targetInput!).to.not.equal(document.activeElement);
      });
    });
  });

  describe('_getResetOption', () => {
    it('should create tags reset option', async () => {
      const labelMock = 'label';
      const onFilter = sandbox.spy();
      const tagsMock = {
        reset: {
          key: labelMock,
          label: labelMock,
        },
      };
      renderSelectMultiple({
        tags: tagsMock,
        onFilter,
      });

      const button = screen.getByRole('combobox', {name: 'first1, test2'});
      const user = userEvent.setup();
      await user.click(button);

      const resetOption = screen.getByTestId('ring-select-reset-tags-button');
      expect(resetOption).to.have.text(labelMock);
      await user.click(resetOption);
      expect(onFilter).to.be.calledWith('');
    });

    it('should not create tags reset option if it is not provided', async () => {
      renderSelectMultiple();
      const button = screen.getByRole('combobox', {name: 'first1, test2'});
      const user = userEvent.setup();
      await user.click(button);
      const resetOption = screen.queryByTestId('ring-select-reset-tags-button');
      expect(resetOption).to.not.exist;
    });

    it('should not create tags reset option without selected elements', async () => {
      renderSelectMultiple({
        selected: [],
        tags: {reset: {}},
      });
      const button = screen.getByRole('combobox', {name: 'Select an option'});
      const user = userEvent.setup();
      await user.click(button);
      const resetOption = screen.queryByTestId('ring-select-reset-tags-button');
      expect(resetOption).to.not.exist;
    });
  });

  describe('_prependResetOption', () => {
    it('should prepend reset option', async () => {
      const resetMock: Tags = {
        reset: {},
      };
      renderSelectMultiple({
        tags: resetMock,
      });
      const button = screen.getByRole('combobox', {name: 'first1, test2'});
      const user = userEvent.setup();
      await user.click(button);
      const resetOption = screen.getByTestId('ring-select-reset-tags-button');
      expect(resetOption).to.exist;
    });

    it('should prepend reset option with separator', async () => {
      const resetMock: Tags = {
        reset: {
          separator: true,
        },
      };
      renderSelectMultiple({
        tags: resetMock,
      });
      const button = screen.getByRole('combobox', {name: 'first1, test2'});
      const user = userEvent.setup();
      await user.click(button);
      const resetOption = screen.getByTestId('ring-select-reset-tags-button');
      expect(resetOption).to.exist;
      const separator = screen.getByTestId('ring-list-separator');
      expect(separator).to.exist;
    });

    it('should not prepend reset option', async () => {
      const resetMock: Tags = {
        reset: {separator: true},
      };
      renderSelectMultiple({
        tags: resetMock,
        selected: [],
      });
      const button = screen.getByRole('combobox', {name: 'Select an option'});
      const user = userEvent.setup();
      await user.click(button);
      const resetOption = screen.queryByTestId('ring-select-reset-tags-button');
      expect(resetOption).to.not.exist;
      const separator = screen.queryByTestId('ring-list-separator');
      expect(separator).to.not.exist;
    });
  });
});
