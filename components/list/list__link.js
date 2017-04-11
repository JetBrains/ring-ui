import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Link, {linkHOC} from '../link/link';
import styles from './list.css';

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default class ListLink extends PureComponent {
  static propTypes = {
    ...Link.propTypes,
    description: PropTypes.string,
    label: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.string
    ]),
    rgItemType: PropTypes.number,
    scrolling: PropTypes.bool,
    url: PropTypes.string,
    LinkComponent: PropTypes.oneOfType([
      PropTypes.instanceOf(Component),
      PropTypes.func,
      PropTypes.string
    ])
  };

  render() {
    const {className, label, hover, description, rgItemType, url, disabled, LinkComponent, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    const classes = classnames(styles.item, className, {
      [styles.actionLink]: !disabled,
      [styles.hover]: hover && !disabled
    });

    const Comp = LinkComponent ? linkHOC(LinkComponent) : Link;

    return (
      <Comp
        pseudo={!this.props.href}
        {...restProps}
        hover={hover && !disabled}
        className={classes}
        data-test="ring-list-link"
      >
        {label}
      </Comp>
    );
  }
}
