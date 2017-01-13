import React, {PropTypes} from 'react';
import classnames from 'classnames';
import styles from './list.css';

export default function ListCustom(props) {
  const {active, className, disabled, template, rgItemType, tabIndex, onClick, onMouseOver, onMouseUp, ...restProps} = props; // eslint-disable-line no-unused-vars
  const classes = classnames(styles.item, className, {
    [styles.action]: !disabled,
    [styles.active]: active && !disabled
  });

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
  onMouseOver: PropTypes.func,
  onMouseUp: PropTypes.func
};

ListCustom.defaultProps = {
  active: false
};
