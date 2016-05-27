import React, {PropTypes} from 'react';

export default function ListTitle({description, label}) {
  return (
    <span className="ring-list__title">
      <div className="ring-list__description">{description}</div>
      <span className="ring-list__title-text">{label}</span>
    </span>
  );
}

ListTitle.propTypes = {
  description: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ]),
  label: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string
  ])
};
