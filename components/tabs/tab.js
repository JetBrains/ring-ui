import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dataTests from '../global/data-tests';

import styles from './tabs.css';

export default class Tab extends PureComponent {
  static renderTitle(title, isSelected) {
    return typeof title === 'function'
      ? title(isSelected)
      : title;
  }

  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
    id: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.node,
    'data-test': PropTypes.string
  };

  render() {
    const {className, children, 'data-test': dataTest} = this.props;
    const classes = classNames(styles.tab, className);
    return (
      <div data-test={dataTests('ring-tab', dataTest)} className={classes}>{children}</div>
    );
  }
}
