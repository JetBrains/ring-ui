import {PureComponent, HTMLAttributes} from 'react';
import classNames from 'classnames';

import styles from './button-group.css';

export default class Caption extends PureComponent<HTMLAttributes<HTMLElement>> {
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
