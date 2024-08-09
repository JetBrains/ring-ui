import {PureComponent} from 'react';
import classNames from 'classnames';

import Link, {linkHOC} from '../link/link';
import dataTests from '../global/data-tests';

import styles from './list.css';

import {ListDataItemProps} from './consts';

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default class ListLink<T> extends PureComponent<ListDataItemProps<T>> {
  render() {
    const {
      scrolling,
      'data-test': dataTest,
      className,
      label,
      hover,
      description,
      rgItemType,
      url,
      onCheckboxChange,
      disabled,
      LinkComponent,
      compact,
      hoverClassName,
      children,
      ...restProps
    } = this.props;
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
        {label ?? children}
      </Comp>
    );
  }
}
