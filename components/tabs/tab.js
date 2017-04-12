import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './tabs.css';

export default class Tab extends PureComponent {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node
  }

  static renderTitle(title, isSelected) {
    return typeof title === 'function'
      ? title(isSelected)
      : title;
  }

  render() {
    const {className, children} = this.props;
    const classes = classNames(styles.tab, className);
    return (
      <div className={classes}>{children}</div>
    );
  }
}
