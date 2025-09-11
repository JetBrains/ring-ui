import {PureComponent, type ReactNode} from 'react';
import * as React from 'react';

import dataTests from '../global/data-tests';
import getEventKey from '../global/get-event-key';
import {type ListDataItemProps} from './consts';
import {getListClasses} from './list.classes';

export default class ListCustom<T> extends PureComponent<ListDataItemProps<T>> {
  handleKeyPress = (event: React.KeyboardEvent) => {
    const key = getEventKey(event);
    if (key === 'Enter' || key === ' ') {
      this.props.onClick(event);
    }
  };

  render() {
    const {disabled, template, tabIndex, onClick, onMouseOver, onMouseUp, role, tagName} = this.props;
    const classes = getListClasses(this.props);

    const dataTest = dataTests(
      'ring-list-item-custom',
      {
        'ring-list-item-action': !disabled,
      },
      this.props['data-test'],
    );

    const content: ReactNode = typeof template === 'function' ? template(this.props as ListDataItemProps<T>) : template;
    const TagName: keyof React.JSX.IntrinsicElements = tagName || 'span';

    return (
      <TagName
        role={role || 'button'}
        aria-disabled={disabled}
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
