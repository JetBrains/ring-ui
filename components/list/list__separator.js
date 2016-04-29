import React from 'react';
import classnames from 'classnames';

export default function ListSeparator({description}) {
  const classes = classnames({
    'ring-list__separator': true,
    'ring-list__separator_empty': !description
  });

  return (
    <span className={classes}>{description}</span>
  );
}
