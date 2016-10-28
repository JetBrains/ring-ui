import React, {PropTypes} from 'react';
import classnames from 'classnames';

export default function ListCustom(props) {
  const {active, className, disabled, template, rgItemType, tabIndex, onClick, onMouseOver, ...restProps} = props; // eslint-disable-line no-unused-vars
  const classes = classnames({
    'ring-list__item': true,
    'ring-list__item_action': !disabled,
    'ring-list__item_active': active && !disabled
  }, className);

  const content = (typeof template === 'function') ? template(props) : template;
  return (
    <span
      tabIndex={tabIndex}
      onClick={onClick}
      onMouseOver={onMouseOver}
      className={classes}
    >
      {content}
    </span>
  );
}

ListCustom.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  rgItemType: PropTypes.number,
  tabIndex: PropTypes.number,
  template: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.element,
    PropTypes.string
  ]),
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func
};

ListCustom.defaultProps = {
  active: false
};
