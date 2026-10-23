import {PureComponent, type ReactNode} from 'react';
import * as React from 'react';

import dataTests from '../global/data-tests';
import getEventKey from '../global/get-event-key';
import {type ListDataItemProps} from './consts';
import {getListClasses} from './list.classes';

// Events from portals rendered by the template (e.g. a nested Dropdown) bubble through the React tree
// but originate outside the item's DOM, so they must not activate the item
function isFromPortal(event: React.SyntheticEvent) {
  return !event.currentTarget.contains(event.target as Node);
}

export default class ListCustom<T> extends PureComponent<ListDataItemProps<T>> {
  handleKeyPress = (event: React.KeyboardEvent) => {
    const key = getEventKey(event);
    if (key === 'Enter' || key === ' ') {
      this.props.onClick(event);
    }
  };

  handleClick = (event: React.MouseEvent) => {
    if (isFromPortal(event)) {
      return;
    }

    // In useMouseUp mode List doesn't pass onClick
    this.props.onClick?.(event);
  };

  handleMouseUp = (event: React.MouseEvent) => {
    if (isFromPortal(event)) {
      return;
    }

    this.props.onMouseUp?.(event);
  };

  render() {
    const {disabled, template, tabIndex, onMouseOver, role, tagName} = this.props;
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
        onClick={this.handleClick}
        onKeyPress={this.handleKeyPress}
        onMouseOver={onMouseOver}
        onFocus={onMouseOver}
        onMouseUp={this.handleMouseUp}
        className={classes}
        data-test={dataTest}
      >
        {content}
      </TagName>
    );
  }
}
