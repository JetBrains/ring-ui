/**
  * @name Data List
  */

import React, {PureComponent, Component, ComponentType} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import focusSensorHOC, {FocusSensorAddProps, FocusSensorProps} from '../global/focus-sensor-hoc';
import selectionShortcutsHOC, {
  SelectionShortcutsAddProps,
  SelectionShortcutsProps
} from '../table/selection-shortcuts-hoc';
import disableHoverHOC from '../table/disable-hover-hoc';
import getUID from '../global/get-uid';
import Shortcuts from '../shortcuts/shortcuts';
import Loader from '../loader/loader';

import {SelectionItem} from '../table/selection';

import Item, {FormattedItem, moreLessButtonStates} from './item';

import styles from './data-list.css';
import Selection from './selection';

import {refObject} from '@jetbrains/ring-ui/components/global/prop-types';

export interface DataListBaseProps<
  T extends SelectionItem
> {
  data: readonly T[]
  itemFormatter: (item: T) => FormattedItem<T>
  loading?: boolean | undefined
  onItemMoreLess?: ((item: T, more: boolean) => void) | undefined
  itemMoreLessState?: ((item: FormattedItem<T>) => moreLessButtonStates) | undefined
  remoteSelection?: boolean | undefined
  className?: string | null | undefined
  disabledHover?: boolean | null | undefined
}

type DataListProps<T extends SelectionItem> = DataListBaseProps<T> &
  FocusSensorAddProps<HTMLDivElement> & SelectionShortcutsAddProps<T>

class DataList<T extends SelectionItem> extends PureComponent<DataListProps<T>> {
  static defaultProps = {
    loading: false,

    onItemMoreLess: () => {},
    itemMoreLessState: () => moreLessButtonStates.UNUSED,

    remoteSelection: false
  };

  componentDidUpdate(prevProps: DataListProps<T>) {
    const {data, selection, onSelect, selectable} = this.props;

    if (data !== prevProps.data && !prevProps.remoteSelection) {
      onSelect(selection.cloneWith({data}));
    }

    if (!selectable && prevProps.selectable) {
      onSelect(selection.resetSelection());
    }
  }

  shortcutsScope = getUID('ring-data-list-');

  onItemFocus = (item: T) => {
    const {selection, onSelect} = this.props;
    onSelect(selection.focus(item));
  };

  onItemSelect = (item: T, selected: boolean) => {
    const {selection, onSelect} = this.props;
    if (selected) {
      onSelect(selection.select(item));
    } else {
      onSelect(selection.deselect(item));
    }
  };

  onEqualPress = () => {
    const {
      selection, itemFormatter
    } = this.props;

    const focused = selection.getFocused();
    if (focused == null) {
      throw new Error('No focused item');
    }
    const item = itemFormatter(focused);

    if (item.collapsed) {
      item.onExpand?.();
    } else {
      item.onCollapse?.();
    }
  };

  shortcutsMap = {
    '=': this.onEqualPress
  };

  render() {
    const {
      data, className, loading,
      selection, disabledHover,
      itemFormatter, focused, innerRef
    } = this.props;

    const shortcutsMap = {...this.shortcutsMap, ...this.props.shortcutsMap};

    const classes = classNames(className, {
      [styles.dataList]: true,
      [styles.disabledHover]: disabledHover,
      [styles.multiSelection]: selection.getSelected().size > 0
    });

    return (
      <div className={styles.dataListWrapper} data-test="ring-data-list" ref={innerRef}>
        {focused &&
          (
            <Shortcuts
              map={shortcutsMap}
              scope={this.shortcutsScope}
            />
          )
        }

        <ul className={classes}>
          {data.map(model => {
            const item = itemFormatter(model);
            const {id, key, title, items} = item;

            const showMoreLessButton = this.props.itemMoreLessState?.(item);

            return (
              <Item
                key={key || id}
                item={model}
                title={title}
                items={items}

                itemFormatter={itemFormatter}

                collapsible={item.collapsible}
                collapsed={item.collapsed}
                onCollapse={item.onCollapse}
                onExpand={item.onExpand}

                showFocus={selection.isFocused(model)}
                onFocus={this.onItemFocus}

                selection={selection}
                selectable={item.selectable}
                selected={selection.isSelected(model)}
                onSelect={this.onItemSelect}

                showMoreLessButton={showMoreLessButton}
                onItemMoreLess={this.props.onItemMoreLess}
              />
            );
          })}
        </ul>

        {loading && (
          <div className={data.length > 0 ? styles.loadingOverlay : undefined}>
            <Loader/>
          </div>
        )}
      </div>
    );
  }
}

(DataList as ComponentType<DataListProps<SelectionItem>>).propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  focused: PropTypes.bool.isRequired,
  disabledHover: PropTypes.bool,
  selection: PropTypes.instanceOf(Selection).isRequired,
  selectable: PropTypes.bool.isRequired,
  shortcutsMap: PropTypes.shape({}).isRequired,
  innerRef: PropTypes.oneOfType([
    refObject(PropTypes.instanceOf(HTMLDivElement).isRequired),
    PropTypes.func
  ]),

  itemFormatter: PropTypes.func.isRequired,

  onItemMoreLess: PropTypes.func,
  itemMoreLessState: PropTypes.func,
  onSelect: PropTypes.func.isRequired,

  remoteSelection: PropTypes.bool
};

type FocusableProps<T extends SelectionItem> = DataListBaseProps<T> &
  FocusSensorProps<HTMLDivElement> & SelectionShortcutsAddProps<T>
export type DataListContainerProps<T extends SelectionItem> = DataListBaseProps<T> &
  FocusSensorProps<HTMLDivElement> & SelectionShortcutsProps<T>
const getContainer = <T extends SelectionItem>() => disableHoverHOC(
  selectionShortcutsHOC<T, FocusableProps<T>>(
    focusSensorHOC<HTMLDivElement, DataListProps<T>>(DataList)
  )
);

// eslint-disable-next-line react/no-multi-comp
export default class DataListContainer<
  T extends SelectionItem
> extends Component<DataListContainerProps<T>> {
  static propTypes = getContainer().propTypes;
  // https://stackoverflow.com/a/53882322/6304152
  DataList = getContainer<T>();

  render() {
    return <this.DataList {...this.props}/>;
  }
}
