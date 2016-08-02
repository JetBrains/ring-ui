import React, {PropTypes} from 'react';
import classnames from 'classnames';
import Icon from '../icon/icon';

/**
 * @constructor
 * @extends {ReactComponent}
 */

const RING_UNIT = 8;
const DEFAULT_PADDING = 16;

export default function ListItem(props) {
  const {checkbox, glyph, icon, rightGlyph, description, label, details, active, rgItemType, ...restProps} = props; // eslint-disable-line no-unused-vars
  const classes = classnames({
    'ring-list__item': true,
    'ring-list__item_action': !props.disabled,
    'ring-list__item_active': props.active && !props.disabled
  }, props.className);
  const detailsClasses = classnames({
    'ring-list__details': props.details,
    'ring-list__details_padded': props.icon !== undefined || props.checkbox !== undefined || props.glyph !== undefined
  });

  const style = {
    paddingLeft: `${(+props.level || 0) * RING_UNIT + DEFAULT_PADDING}px`
  };


  return (
    <span
      {...restProps}
      className={classes}
      style={style}
    >
      {checkbox !== undefined && (
        <Icon
          className={classnames({
            'ring-list__glyph': true,
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
      {icon && (
        <div
          className="ring-list__icon"
          style={{backgroundImage: `url("${icon}")`}}
        />
      )}
      {rightGlyph && (
        <Icon
          className="ring-list__glyph ring-list__glyph_right"
          glyph={rightGlyph}
          size={Icon.Size.Size18}
        />
      )}
      {description && (
        <div className="ring-list__description">{description}</div>
      )}
      {label && <div className="ring-list__label">{label}</div>}
      {details && (
        <div className={detailsClasses}>{details}</div>
      )}
      </span>
  );
}

ListItem.defaultProps = {
  active: false
};

ListItem.propTypes = {
  active: PropTypes.bool,
  details: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  checkbox: PropTypes.bool,
  description: PropTypes.string,
  glyph: PropTypes.string,
  icon: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  level: PropTypes.number,
  rgItemType: PropTypes.number,
  rightGlyph: PropTypes.string
};
