import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import dataTests from '../global/data-tests';
import Avatar, {Size as AvatarSize} from '../avatar/avatar';
import Icon, {CheckmarkIcon} from '../icon';

import styles from './list.css';

/**
 * @constructor
 * @extends {ReactComponent}
 */

const RING_UNIT = 8;
const DEFAULT_PADDING = 16;

export default class ListItem extends PureComponent {
  static defaultProps = {
    hover: false
  };

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
    level: PropTypes.number,
    rgItemType: PropTypes.number,
    rightGlyph: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    compact: PropTypes.bool,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseUp: PropTypes.func
  };

  static defaultProps = {
    iconSize: Icon.Size.Size18
  };

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
      details,
      hover,
      rgItemType,
      level,
      tabIndex,
      compact,
      onClick,
      onMouseOver,
      onMouseUp,
      rightNodes,
      leftNodes,
      ...restProps
    } = this.props;
    /* eslint-enable */

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
      paddingLeft: `${(+level || 0) * RING_UNIT + DEFAULT_PADDING}px`
    };

    const labelIsString = typeof label === 'string' || label instanceof String;
    const dataTest = dataTests('ring-list-item', {
      'ring-list-item-action': !disabled,
      'ring-list-item-selected': checkbox
    });

    return (
      <div
        tabIndex={tabIndex}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
        className={classes}
        data-test={dataTest}
        style={style}
      >
        <div className={styles.top}>
          <div className={styles.left}>
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

          <span
            className={styles.label}
            title={labelIsString ? label : ''}
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
            {checkbox !== undefined && (
              <CheckmarkIcon
                data-test="ring-list-item-checkmark"
                className={classNames(styles.checkbox, {
                  [styles.hidden]: !checkbox
                })}
                size={CheckmarkIcon.Size.Size14}
              />
            )}
          </div>
        </div>

        {details && <div className={detailsClasses}>{details}</div>}
      </div>
    );
  }
}
