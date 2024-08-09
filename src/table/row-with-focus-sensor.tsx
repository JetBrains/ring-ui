import {PureComponent} from 'react';

import focusSensorHOC, {FocusSensorProps} from '../global/focus-sensor-hoc';

import Row, {RowProps} from './row';
import {SelectionItem} from './selection';

const getContainer = <T extends SelectionItem>() =>
  focusSensorHOC<HTMLDivElement, RowProps<T>, typeof Row>(Row);

export interface RowWithFocusSensorCallbacksProps<T extends SelectionItem> extends Omit<
  FocusSensorProps<RowProps<T>, HTMLTableRowElement, typeof Row>,
  'onFocus'
> {
  onFocus?: (item: T) => void
  onSelect?: (item: T, selected: boolean) => void
  onCollapse?: (item: T) => void
  onExpand?: (item: T) => void
}

export default class RowWithFocusSensorCallbacks<T extends SelectionItem>
  extends PureComponent<RowWithFocusSensorCallbacksProps<T>> {
  // https://stackoverflow.com/a/53882322/6304152
  RowWithFocusSensor = getContainer<T>();

  onFocus = () => {
    this.props.onFocus?.(this.props.item);
  };

  onSelect = (item: T, selected: boolean) => {
    this.props.onSelect?.(item, selected);
  };

  onCollapse = () => {
    this.props.onCollapse?.(this.props.item);
  };

  onExpand = () => {
    this.props.onExpand?.(this.props.item);
  };

  render() {
    return (
      <this.RowWithFocusSensor
        {...this.props}
        onFocus={this.onFocus}
        onSelect={this.onSelect}
        onCollapse={this.onCollapse}
        onExpand={this.onExpand}
      />
    );
  }
}
