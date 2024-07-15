import {PureComponent, HTMLAttributes} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './button-group.css';

export default class Caption extends PureComponent<HTMLAttributes<HTMLElement>> {
  static propTypes = {
    className: PropTypes.node
  };

  render() {
    const {className} = this.props;
    const classes = classNames(styles.caption, className);

    return (
      <span
        {...this.props}
        className={classes}
      />
    );
  }
}
