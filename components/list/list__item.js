import React, {PureComponent, PropTypes} from 'react';
import classnames from 'classnames';
import Icon from '../icon/icon';

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
    glyph: PropTypes.string,
    icon: PropTypes.string,
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
    rightGlyph: PropTypes.string,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseUp: PropTypes.func
  };

  render() {
    const {props} = this;
    const {
      checkbox, glyph, icon, rightGlyph, description, label,
      details, hover, rgItemType, tabIndex, onClick, onMouseOver, onMouseUp, rightNodes, leftNodes, ...restProps} = props; // eslint-disable-line no-unused-vars
    const classes = classnames({
      'ring-list__item': true,
      'ring-list__item_action': !props.disabled,
      'ring-list__item_hover': props.hover && !props.disabled
    }, props.className);
    const detailsClasses = classnames({
      'ring-list__item__details': props.details,
      'ring-list__item__details_padded': props.icon !== undefined || props.checkbox !== undefined || props.glyph !== undefined
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
              <Icon
                className={classnames({
                  'ring-list__glyph': true,
                  'ring-list__glyph_checkbox': true,
                  'ring-list__glyph_hidden': !checkbox
                })}
                glyph={require('jetbrains-icons/check.svg')}
                size={Icon.Size.Size18}
              />
            )}
            {glyph && (
              <Icon
                className="ring-list__glyph"
                glyph={glyph}
                size={Icon.Size.Size18}
              />
            )}
          </div>

          <div className="ring-list__item__label">{label}</div>
          <div className="ring-list__item__description">{description}</div>

          <div className="ring-list__item__right">
            {rightGlyph && (
              <Icon
                className="ring-list__glyph ring-list__glyph_right"
                glyph={rightGlyph}
                size={Icon.Size.Size18}
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
