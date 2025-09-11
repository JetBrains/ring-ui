import {PureComponent, type ReactNode} from 'react';
import classnames from 'classnames';

import styles from './list.css';

export interface ListHintProps {
  label: ReactNode;
}

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default class ListHint extends PureComponent<ListHintProps> {
  render() {
    return (
      <span className={classnames(styles.item, styles.hint)} data-test='ring-list-hint'>
        {this.props.label}
      </span>
    );
  }
}
