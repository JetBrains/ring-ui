import {PureComponent} from 'react';
import classNames from 'classnames';

import styles from './list.css';
import {type ListDataItemProps} from './consts';

export default class ListSeparator<T> extends PureComponent<ListDataItemProps<T>> {
  render() {
    const {description, isFirst, className} = this.props;

    const classes = classNames(styles.separator, className, {
      [styles.separator_first]: isFirst,
    });

    return (
      <span data-test='ring-list-separator' className={classes}>
        {description}
      </span>
    );
  }
}
