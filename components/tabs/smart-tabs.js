import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import Tabs from './dumb-tabs';

export default class SmartTabs extends PureComponent {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    initSelected: PropTypes.string
  }

  state = {
    selected: this.props.initSelected || this.props.children[0].props.id || '0'
  };

  handleSelect = selected => this.setState({selected});

  render() {
    const {children, initSelected, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    return (
      <Tabs
        selected={this.state.selected}
        onSelect={this.handleSelect}
        {...restProps}
      >{children}</Tabs>
    );
  }
}
