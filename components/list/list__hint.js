import React, {PropTypes} from 'react';

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default function ListHint({label}) {
  return (
    <span className="ring-list__item ring-list__item_hint">{label}</span>
  );
}

ListHint.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ])
};
