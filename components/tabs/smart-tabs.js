import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import dataTests from '../global/data-tests';

import Tabs from './dumb-tabs';

export default class SmartTabs extends PureComponent {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    initSelected: PropTypes.string,
    'data-test': PropTypes.string
  }

  state = {
    selected: this.props.initSelected || this.props.children[0].props.id || '0'
  };

  handleSelect = selected => this.setState({selected});

  render() {
    const {children, initSelected, 'data-test': dataTest, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    return (
      <Tabs
        data-test={dataTests('ring-smart-tabs', dataTest)}
        selected={this.state.selected}
        onSelect={this.handleSelect}
        {...restProps}
      >{children}</Tabs>
    );
  }
}
