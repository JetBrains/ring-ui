import {PureComponent, SyntheticEvent, ComponentType} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import Avatar, {Size as AvatarSize} from '../avatar/avatar';
import Checkbox from '../checkbox/checkbox';
import Icon from '../icon/icon';

import getUID from '../global/get-uid';
import globalStyles from '../global/global.css';

import styles from './list.css';

import {ListDataItemProps} from './consts';

/**
 * @constructor
 * @extends {ReactComponent}
 */

const RING_UNIT = 8;
const DEFAULT_PADDING = 16;
const CHECKBOX_WIDTH = 28;

export default class ListItem<T> extends PureComponent<ListDataItemProps<T>> {
  id = getUID('list-item-');

  stopBubbling = (e: SyntheticEvent) => e.stopPropagation();

  private _isString = (val: unknown): val is string =>
    typeof val === 'string' || val instanceof String;

  render() {
    const {
      scrolling,
      className,
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
      rgItemType,
      level,
      tabIndex,
      compact,
      onClick,
      onCheckboxChange,
      onMouseOver,
      onMouseDown,
      onMouseUp,
      rightNodes,
      leftNodes,
      showGeneratedAvatar,
      username,
      labelWrapper,
      ...restProps
    } = this.props;

    const checkable = checkbox !== undefined;
    const shouldShowGeneratedAvatar = showGeneratedAvatar && username != null;
    const hasLeftNodes = leftNodes || glyph || avatar || shouldShowGeneratedAvatar;
    const showCheckbox = checkable && (checkbox || !hasLeftNodes || (hover && !disabled));

    const classes = classNames(styles.item, globalStyles.resetButton, className, {
      [styles.action]: !disabled,
      [styles.hover]: hover && !disabled,
      [styles.compact]: compact,
      [styles.scrolling]: scrolling,
      [styles.disabled]: disabled
    });

    const detailsClasses = classNames({
      [styles.details]: details,
      [styles.padded]: icon !== undefined ||
        checkbox !== undefined ||
        glyph !== undefined
    });

    const style = {
      paddingLeft: `${(Number(level) || 0) * RING_UNIT + DEFAULT_PADDING + (showCheckbox ? CHECKBOX_WIDTH : 0)}px`
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

    const dataTest = dataTests({
      'ring-list-item': ((restProps['data-test'] || '') as string).indexOf('ring-list-item') === -1,
      'ring-list-item-action': !disabled,
      'ring-list-item-selected': checkbox
    }, restProps['data-test']);

    const labelElement = (
      <span
        className={styles.label}
        title={computedTitle}
        data-test="ring-list-item-label"
      >{label}</span>
    );

    return (
      <div className={styles.itemContainer} data-test={dataTest}>
        {showCheckbox && (
          <div
            className={styles.checkboxContainer}
          >
            <Checkbox
              aria-labelledby={this.id}
              checked={checkbox}
              disabled={disabled}
              onChange={onCheckboxChange}
              onClick={this.stopBubbling}
            />
          </div>
        )}
        <button
          id={this.id}
          type="button"
          tabIndex={tabIndex}
          onClick={onClick}
          onMouseOver={onMouseOver}
          onMouseDown={onMouseDown}
          onFocus={onMouseOver}
          onMouseUp={onMouseUp}
          className={classes}
          style={style}
          disabled={disabled}
        >
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
              <span
                className={styles.description}
                data-test="ring-list-item-description"
              >{description}</span>
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
              {icon && (
                <div
                  className={styles.icon}
                  style={{backgroundImage: `url("${icon}")`}}
                />
              )}
              {rightNodes}
            </div>
          </div>

          {details && <div className={detailsClasses}>{details}</div>}
        </button>
      </div>
    );
  }
}

(ListItem as ComponentType<unknown>).propTypes = {
  scrolling: PropTypes.bool,
  hover: PropTypes.bool,
  details: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  tabIndex: PropTypes.number,
  checkbox: PropTypes.bool,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.array
  ]),
  showGeneratedAvatar: PropTypes.bool,
  username: PropTypes.string,
  avatar: PropTypes.string,
  subavatar: PropTypes.string,
  glyph: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  icon: PropTypes.string,
  iconSize: PropTypes.number,
  rightNodes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.array
  ]),
  leftNodes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.array
  ]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  title: PropTypes.string,
  level: PropTypes.number,
  rgItemType: PropTypes.number,
  rightGlyph: PropTypes.oneOfType([PropTypes.string, PropTypes.elementType]),
  compact: PropTypes.bool,
  onClick: PropTypes.func,
  onCheckboxChange: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  'data-test': PropTypes.string
};
