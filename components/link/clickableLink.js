import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

const LEFT_BUTTON = 0;
// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
const isPlainLeftClick = e =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

export default class ClickableLink extends PureComponent {
  static propTypes = {
    onPlainLeftClick: PropTypes.func,
    onClick: PropTypes.func,
    activeClassName: PropTypes.string
  };

  onClick = e => {
    const {onClick, onPlainLeftClick} = this.props;

    if (onClick) {
      onClick(e);
    }

    if (onPlainLeftClick && isPlainLeftClick(e)) {
      e.preventDefault();
      onPlainLeftClick(e);
    }
  };

  render() {
    // eslint-disable-next-line no-unused-vars
    const {onPlainLeftClick, activeClassName, ...restProps} = this.props;

    return <a {...restProps} onClick={this.onClick}/>;
  }
}
