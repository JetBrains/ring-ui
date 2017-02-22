import React, {PropTypes} from 'react';
import classnames from 'classnames';

export default function ListCustom(props) {
  const {hover, className, disabled, template, rgItemType, tabIndex, onClick, onMouseOver, onMouseUp, ...restProps} = props; // eslint-disable-line no-unused-vars
  const classes = classnames({
    'ring-list__item': true,
    'ring-list__item_action': !disabled,
    'ring-list__item_hover': hover && !disabled
  }, className);

  const content = (typeof template === 'function') ? template(props) : template;
  return (
    <span
      tabIndex={tabIndex}
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseUp={onMouseUp}
      className={classes}
    >
      {content}
    </span>
  );
}

ListCustom.propTypes = {
  hover: PropTypes.bool,
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
  onMouseOver: PropTypes.func,
  onMouseUp: PropTypes.func
};

ListCustom.defaultProps = {
  hover: false
};
