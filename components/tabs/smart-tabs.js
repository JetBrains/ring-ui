import React, {PureComponent, PropTypes} from 'react';

import Tabs from './dumb-tabs';

export default class SmartTabs extends PureComponent {
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
