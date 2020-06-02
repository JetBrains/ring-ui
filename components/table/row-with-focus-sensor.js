import React, {PureComponent} from 'react';

import focusSensorHOC from '../global/focus-sensor-hoc';

import Row from './row';

const RowWithFocusSensor = focusSensorHOC(Row);

export default class RowWithFocusSensorCallbacks extends PureComponent {
  static propTypes = Row.propTypes;

  onFocus = () => {
    this.props.onFocus(this.props.item);
  };

  onSelect = selected => {
    this.props.onSelect(this.props.item, selected);
  };

  onCollapse = () => {
    this.props.onCollapse(this.props.item);
  };

  onExpand = () => {
    this.props.onExpand(this.props.item);
  };

  render() {
    return (
      <RowWithFocusSensor
        {...this.props}
        onFocus={this.onFocus}
        onSelect={this.onSelect}
        onCollapse={this.onCollapse}
        onExpand={this.onExpand}
      />
    );
  }
}
