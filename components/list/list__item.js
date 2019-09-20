import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import Avatar, {Size as AvatarSize} from '../avatar/avatar';
import Checkbox from '../checkbox/checkbox';
import Icon from '../icon';

import styles from './list.css';

/**
 * @constructor
 * @extends {ReactComponent}
 */

const RING_UNIT = 8;
const DEFAULT_PADDING = 16;
const CHECKBOX_WIDTH = 28;

export default class ListItem extends PureComponent {
  static propTypes = {
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
    avatar: PropTypes.string,
    glyph: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
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
    rightGlyph: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    compact: PropTypes.bool,
    onClick: PropTypes.func,
    onCheckboxChange: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseUp: PropTypes.func,
    'data-test': PropTypes.string
  };

  stopBubbling = e => e.stopPropagation();

  _isString = val => typeof val === 'string' || val instanceof String;

  render() {
    /* eslint-disable no-unused-vars */
    const {
      scrolling,
      className,
      disabled,
      checkbox,
      avatar,
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
      onMouseUp,
      rightNodes,
      leftNodes,
      ...restProps
    } = this.props;
    /* eslint-enable */

    const checkable = checkbox !== undefined;
    const hasLeftNodes = leftNodes || glyph || avatar;
    const showCheckbox = checkable && (checkbox || !hasLeftNodes || (hover && !disabled));

    const classes = classNames(styles.item, className, {
      [styles.action]: !disabled,
      [styles.hover]: hover && !disabled,
      [styles.compact]: compact,
      [styles.scrolling]: scrolling
    });

    const detailsClasses = classNames({
      [styles.details]: details,
      [styles.padded]: icon !== undefined ||
        checkbox !== undefined ||
        glyph !== undefined
    });

    const style = {
      paddingLeft: `${(+level || 0) * RING_UNIT + DEFAULT_PADDING + (showCheckbox ? CHECKBOX_WIDTH : 0)}px`
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
      'ring-list-item': (restProps['data-test'] || '').indexOf('ring-list-item') === -1,
      'ring-list-item-action': !disabled,
      'ring-list-item-selected': checkbox
    }, restProps['data-test']);

    return (
      <div className={styles.itemContainer} data-test={dataTest}>
        {showCheckbox && (
          <div
            className={styles.checkboxContainer}
          >
            <Checkbox
              onClick={this.stopBubbling}
              checked={checkbox}
              onChange={onCheckboxChange}
            />
          </div>
        )}
        <button
          type="button"
          tabIndex={tabIndex}
          onClick={onClick}
          onMouseOver={onMouseOver}
          onFocus={onMouseOver}
          onMouseUp={onMouseUp}
          className={classes}
          style={style}
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
                  />
                )}
                {avatar && (
                  <Avatar
                    className={styles.avatar}
                    url={avatar}
                    size={AvatarSize.Size20}
                  />
                )}
              </div>
            )}

            <span
              className={styles.label}
              title={computedTitle}
              data-test="ring-list-item-label"
            >{label}</span>

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
