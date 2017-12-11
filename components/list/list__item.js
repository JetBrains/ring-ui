import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Icon, {CheckIcon} from '../icon';

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
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseUp: PropTypes.func
  };

  static defaultProps = {
    iconSize: Icon.Size.Size18
  };

  render() {
    const {props} = this;
    const {scrolling, checkbox, glyph, icon, rightGlyph, description, label,
      details, hover, rgItemType, tabIndex, onClick, onMouseOver, onMouseUp, rightNodes, leftNodes, ...restProps} = props; // eslint-disable-line no-unused-vars, max-len
    const classes = classNames({
      'ring-list__item': true,
      'ring-list__item_action': !props.disabled,
      'ring-list__item_hover': props.hover && !props.disabled,
      'ring-list__item_scrolling': scrolling
    }, props.className);
    const detailsClasses = classNames({
      'ring-list__item__details': props.details,
      'ring-list__item__details_padded': props.icon !== undefined ||
        props.checkbox !== undefined ||
        props.glyph !== undefined
    });

    const style = {
      paddingLeft: `${(+props.level || 0) * RING_UNIT + DEFAULT_PADDING}px`
    };

    return (
      <div
        tabIndex={tabIndex}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
        className={classes}
        style={style}
        data-test="ring-list-item"
      >
        <div className="ring-list__item__top">
          <div className="ring-list__item__left">
            {checkbox !== undefined && (
              <CheckIcon
                className={classNames({
                  'ring-list__glyph': true,
                  'ring-list__glyph_checkbox': true,
                  'ring-list__glyph_hidden': !checkbox
                })}
                size={CheckIcon.Size.Size18}
              />
            )}
            {glyph && (
              <Icon
                className="ring-list__glyph"
                glyph={glyph}
                size={this.props.iconSize}
              />
            )}
          </div>

          <div className="ring-list__item__label" title={label}>{label}</div>
          <div className="ring-list__item__description">{description}</div>

          <div className="ring-list__item__right">
            {rightGlyph && (
              <Icon
                className="ring-list__glyph ring-list__glyph_right"
                glyph={rightGlyph}
                size={this.props.iconSize}
              />
            )}
            {icon && (
              <div
                className="ring-list__icon"
                style={{backgroundImage: `url("${icon}")`}}
              />
            )}
            {rightNodes}
          </div>
        </div>

        {details && <div className={detailsClasses}>{details}</div>}
      </div>
    );
  }
}
