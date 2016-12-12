import React, {PropTypes} from 'react';

import RingComponent from '../ring-component/ring-component';
import {Tabs} from './tabs';

export class SmartTabs extends RingComponent {
  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.element).isRequired,
    initSelected: PropTypes.string
  }

  constructor(props) {
    super(props);
    const {children, initSelected} = props;
    this.state = {
      selected: initSelected || children[0].props.id || '0'
    };
  }

  render() {
    const {children, initSelected, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    return (
      <Tabs
        selected={this.state.selected}
        onSelect={selected => this.setState({selected})}
        {...restProps}
      >{children}</Tabs>
    );
  }
}

export {default as Tab} from './tab';
