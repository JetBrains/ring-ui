import React from 'react';
import classnames from 'classnames';
import Icon from '../icon/icon';

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default function ListItem(props) {
  const classes = classnames({
    'ring-list__item': true,
    'ring-list__item_action': !props.disabled,
    'ring-list__item_active': props.active && !props.disabled
  }, props.className);

  const style = {
    paddingLeft: ((+props.level || 0) * 8 + 16) + 'px'
  };

  return (
    <span
      {...props}
      className={classes}
      style={style}
    >
        {props.checkbox !== undefined && (
          <Icon
            className={classnames({
              'ring-list__checkbox': true,
              'ring-list__checkbox_hidden': props.checkbox
            })}
            glyph={require('jetbrains-icons/check.svg')}
            size={Icon.Size.Size18}
          />
        )}
      {props.icon &&
      <div
        className="ring-list__icon"
        style={{backgroundImage: 'url("' + props.icon + '")'}}
      />}
      {props.description &&
      <div className="ring-list__description">{props.description}</div>}
      {props.label}
      </span>
  );
}

ListItem.defaultProps = {
  active: false
};
