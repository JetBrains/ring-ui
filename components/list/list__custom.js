import React from 'react';
import classnames from 'classnames';

export default function ListCustom(props) {
  const classes = classnames({
    'ring-list__item': true,
    'ring-list__item_action': !props.disabled,
    'ring-list__item_active': props.active && !props.disabled
  }, props.className);

  const template = (typeof props.template === 'function') ? props.template(props) : props.template;
  return (
    <span
      {...props}
      className={classes}
    >
        {template}
      </span>
  );
}

ListCustom.defaultProps = {
  active: false
};
