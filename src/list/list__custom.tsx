import {PureComponent, ReactNode, ComponentType} from 'react';
import * as React from 'react';
import PropTypes from 'prop-types';
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

(ListCustom as ComponentType<unknown>).propTypes = {
  scrolling: PropTypes.bool.isRequired,
  hover: PropTypes.bool.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  rgItemType: PropTypes.number,
  tabIndex: PropTypes.number.isRequired,
  template: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
    PropTypes.string
  ]),
  onClick: PropTypes.func.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseUp: PropTypes.func,
  onCheckboxChange: PropTypes.func.isRequired,
  role: PropTypes.string,
  tagName: PropTypes.string,
  'data-test': PropTypes.string
};
