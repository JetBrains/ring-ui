import {PureComponent, AnchorHTMLAttributes} from 'react';
import * as React from 'react';
import PropTypes from 'prop-types';

const LEFT_BUTTON = 0;
// Cmd/Ctrl/Shift/Alt + Click should trigger default browser behaviour. Same applies to non-left clicks
const isPlainLeftClick = (e: React.MouseEvent) =>
  e.button === LEFT_BUTTON && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

export interface ClickableLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  onConditionalClick?:
    | ((isPlainLeft: boolean, e: React.MouseEvent<HTMLAnchorElement>) => void)
    | null
    | undefined
  onPlainLeftClick?: ((e: React.MouseEvent<HTMLAnchorElement>) => void) | null | undefined
  activeClassName?: string | null | undefined
  disabled?: boolean | undefined
}

export default class ClickableLink extends PureComponent<ClickableLinkProps> {
  static propTypes = {
    onClick: PropTypes.func,
    onPlainLeftClick: PropTypes.func,
    onConditionalClick: PropTypes.func,
    activeClassName: PropTypes.string,
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired
  };

  onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const {onClick, onConditionalClick, onPlainLeftClick} = this.props;

    const isPlainLeft = isPlainLeftClick(e);

    if (onClick) {
      onClick(e);
    }

    if (onConditionalClick) {
      onConditionalClick(isPlainLeft, e);
    }

    if (onPlainLeftClick && isPlainLeft) {
      e.preventDefault();
      onPlainLeftClick(e);
    }
  };

  render() {
    const {
      onConditionalClick, onPlainLeftClick, activeClassName,
      href,
      children,
      ...restProps
    } = this.props;

    return <a href={href} {...restProps} onClick={this.onClick}>{children}</a>;
  }
}
