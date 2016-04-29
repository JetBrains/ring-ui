import React from 'react';
import classnames from 'classnames';

import '../link/link.scss';

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default function ListLink(props) {
  const classes = classnames({
    'ring-list__item': true,
    'ring-link': true,
    'ring-link_focus': props.active && props.scrolling
  });

  if (props.href) {
    return (
      <a
        {...props}
        className={classes}
      >{props.label}</a>
    );
  }

  return (
    <span
      {...props}
      className={classes}
    >{props.label}</span>
  );
}
