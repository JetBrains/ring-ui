import {PureComponent} from 'react';

import Link, {linkHOC} from '../link/link';
import dataTests from '../global/data-tests';

import {ListDataItemProps} from './consts';
import {getListClasses} from './list__classes';

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
    const classes = getListClasses(this.props);

    const Comp = LinkComponent ? linkHOC(LinkComponent) : Link;

    return (
      <Comp
        pseudo={!this.props.href}
        {...restProps}
        className={classes}
        data-test={dataTests('ring-list-link', dataTest)}
      >
        {label ?? children}
      </Comp>
    );
  }
}
