import React, {PropTypes} from 'react';
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

ListCustom.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  template: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
    PropTypes.string
  ])
};

ListCustom.defaultProps = {
  active: false
};
