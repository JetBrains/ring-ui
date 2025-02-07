import {HTMLAttributes, PureComponent, SyntheticEvent} from 'react';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import Avatar, {Size as AvatarSize} from '../avatar/avatar';
import Checkbox from '../checkbox/checkbox';
import Icon from '../icon/icon';

import getUID from '../global/get-uid';

import Link, {linkHOC} from '../link/link';

import styles from './list.css';

import {ListDataItemProps, Type} from './consts';
import {getListClasses} from './list__classes';

/**
 * @constructor
 * @extends {ReactComponent}
 */

const RING_UNIT = 8;
const DEFAULT_PADDING = 8;
const CHECKBOX_WIDTH = 28;

export default class ListItem<T> extends PureComponent<ListDataItemProps<T>> {
  id = getUID('list-item-');

  stopBubbling = (e: SyntheticEvent) => e.stopPropagation();

  private _isString = (val: unknown): val is string => typeof val === 'string' || val instanceof String;

  render() {
    const {
      disabled,
      checkbox,
      avatar,
      subavatar,
      glyph,
      icon,
      rightGlyph,
      description,
      label,
      title,
      details,
      hover,
      level,
      onCheckboxChange,
      rightNodes,
      leftNodes,
      showGeneratedAvatar,
      username,
      labelWrapper,
      rgItemType,
      scrolling,
      'data-test': dataTest,
      className,
      url,
      LinkComponent,
      compact,
      hoverClassName,
      children,
      ...restProps
    } = this.props;

    const checkable = checkbox !== undefined;
    const shouldShowGeneratedAvatar = showGeneratedAvatar && username != null;
    const hasLeftNodes = leftNodes || glyph || avatar || shouldShowGeneratedAvatar;
    const showCheckbox = checkable && (checkbox || !hasLeftNodes || (hover && !disabled));

    const classes = getListClasses(this.props);

    const detailsClasses = classNames({
      [styles.details]: details,
      [styles.padded]: icon !== undefined || checkbox !== undefined || glyph !== undefined,
    });

    const style = {
      paddingLeft: `${(Number(level) || 0) * RING_UNIT + DEFAULT_PADDING + (showCheckbox ? CHECKBOX_WIDTH : 0)}px`,
    };

    let computedTitle = null;
    if (this._isString(title)) {
      // if title is specified and is a string then use it
      computedTitle = title;
    } else {
      // otherwise use label if it is a string;
      // label can also be an element, use empty string in this case
      computedTitle = this._isString(label) ? label : '';
    }

    const isLink = rgItemType === Type.LINK;
    const combinedDataTest = dataTests(
      {
        'ring-list-item': ((dataTest || '') as string).indexOf('ring-list-item') === -1,
        'ring-list-item-action': !disabled,
        'ring-list-item-selected': checkbox,
        'ring-list-link': isLink,
      },
      dataTest,
    );

    const labelElement = (
      <span className={styles.label} title={computedTitle} data-test="ring-list-item-label">
        {label ?? children}
      </span>
    );

    const commonProps = {
      ...restProps,
      id: this.id,
      className: classes,
      style,
      disabled,
      children: (
        <>
          <div className={styles.top} onMouseOut={this.stopBubbling} onBlur={this.stopBubbling}>
            {!showCheckbox && (
              <div className={styles.left}>
                {leftNodes}
                {glyph && (
                  <Icon
                    className={styles.glyph}
                    glyph={glyph}
                    size={this.props.iconSize}
                    suppressSizeWarning={this.props.suppressSizeWarning}
                  />
                )}
                {(avatar || shouldShowGeneratedAvatar) && (
                  <Avatar
                    className={styles.avatar}
                    url={avatar}
                    size={AvatarSize.Size20}
                    subavatar={subavatar}
                    username={username}
                  />
                )}
              </div>
            )}

            {labelWrapper ? labelWrapper(labelElement) : labelElement}

            {description && (
              <span className={styles.description} data-test="ring-list-item-description">
                {description}
              </span>
            )}

            <div className={styles.right}>
              {rightGlyph && (
                <Icon
                  className={styles.rightGlyph}
                  glyph={rightGlyph}
                  suppressSizeWarning={this.props.suppressSizeWarning}
                  size={this.props.iconSize}
                />
              )}
              {icon && <div className={styles.icon} style={{backgroundImage: `url("${icon}")`}} />}
              {rightNodes}
            </div>
          </div>

          {details && <div className={detailsClasses}>{details}</div>}
        </>
      ),
    };
    const LinkComponentToUse = LinkComponent ? linkHOC(LinkComponent) : Link;

    return (
      <div className={styles.itemContainer} data-test={combinedDataTest}>
        {showCheckbox && (
          <div className={styles.checkboxContainer}>
            <Checkbox
              aria-labelledby={this.id}
              checked={checkbox}
              disabled={disabled}
              onChange={onCheckboxChange}
              onClick={this.stopBubbling}
            />
          </div>
        )}
        {isLink ? (
          <LinkComponentToUse pseudo={!restProps.href} {...commonProps} />
        ) : (
          <button type="button" {...(commonProps as HTMLAttributes<HTMLElement>)} />
        )}
      </div>
    );
  }
}
