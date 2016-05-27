import React, {PropTypes} from 'react';
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

ListSeparator.propTypes = {
  description: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ])
};
