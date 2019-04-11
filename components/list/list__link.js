import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Link, {linkHOC} from '../link/link';
import dataTests from '../global/data-tests';

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
    ]),
    onCheckboxChange: PropTypes.func,
    compact: PropTypes.bool
  };

  render() {
    const {scrolling, 'data-test': dataTest, className, label, hover, description, rgItemType, url, onCheckboxChange, disabled, LinkComponent, compact, ...restProps} = this.props; // eslint-disable-line no-unused-vars, max-len
    const classes = classNames(styles.item, className, {
      [styles.actionLink]: !disabled,
      [styles.compact]: compact,
      [styles.scrolling]: scrolling
    });

    const Comp = LinkComponent ? linkHOC(LinkComponent) : Link;

    return (
      <Comp
        pseudo={!this.props.href}
        {...restProps}
        hover={hover && !disabled}
        className={classes}
        data-test={dataTests('ring-list-link', dataTest)}
      >
        {label}
      </Comp>
    );
  }
}
