import React, {PureComponent, PropTypes} from 'react';
import classnames from 'classnames';
import Link from '../link/link';
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
    url: PropTypes.string
  };

  render() {
    const {className, label, hover, description, rgItemType, url, disabled, ...restProps} = this.props; // eslint-disable-line no-unused-vars
    const classes = classnames(styles.item, className, {
      [styles.actionLink]: !disabled,
      [styles.hover]: hover && !disabled
    });

    return (
      <Link
        pseudo={!this.props.href}
        {...restProps}
        hover={hover && !disabled}
        className={classes}
      >
        {label}
      </Link>
    );
  }
}
