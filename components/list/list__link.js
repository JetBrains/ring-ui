import React, {PropTypes} from 'react';
import classnames from 'classnames';

import '../link/link.scss';

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default function ListLink(props) {
  const {label, active, description, rgItemType, scrolling, url, ...restProps} = props; // eslint-disable-line no-unused-vars
  const classes = classnames({
    'ring-list__item': true,
    'ring-link': true,
    'ring-link_focus': active && scrolling
  });

  if (props.href) {
    return (
      <a
        {...restProps}
        className={classes}
      >
        {label}
      </a>
    );
  }

  return (
    <span
      {...restProps}
      className={classes}
    >
      {label}
    </span>
  );
}

ListLink.propTypes = {
  active: PropTypes.bool,
  description: PropTypes.string,
  href: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]),
  rgItemType: PropTypes.number,
  scrolling: PropTypes.bool,
  url: PropTypes.string
};
