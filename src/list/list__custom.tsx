import {PureComponent, ReactNode} from 'react';
import * as React from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import getEventKey from '../global/get-event-key';

import styles from './list.css';
import {ListDataItemProps} from './consts';

export default class ListCustom<T> extends PureComponent<ListDataItemProps<T>> {
  handleKeyPress = (event: React.KeyboardEvent) => {
    const key = getEventKey(event);
    if (key === 'Enter' || key === ' ') {
      this.props.onClick(event);
    }
  };

  render() {
    const {
      scrolling,
      hover,
      className,
      disabled,
      template,
      rgItemType,
      tabIndex,
      onClick,
      onCheckboxChange,
      onMouseOver,
      onMouseUp,
      role,
      tagName,
      ...restProps
    } = this.props;
    const classes = classNames(styles.item, className, {
      [styles.action]: !disabled,
      [styles.hover]: hover && !disabled,
      [styles.scrolling]: scrolling
    });


    const dataTest = dataTests('ring-list-item-custom', {
      'ring-list-item-action': !disabled
    }, restProps['data-test']);

    const content: ReactNode = (typeof template === 'function')
      ? template(this.props as ListDataItemProps<T>)
      : template;
    const TagName: keyof JSX.IntrinsicElements = tagName || 'span';

    return (
      <TagName
        role={role || 'button'}
        tabIndex={tabIndex}
        onClick={onClick}
        onKeyPress={this.handleKeyPress}
        onMouseOver={onMouseOver}
        onFocus={onMouseOver}
        onMouseUp={onMouseUp}
        className={classes}
        data-test={dataTest}
      >
        {content}
      </TagName>
    );
  }
}
