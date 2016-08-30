import React, {PropTypes} from 'react';

export default function ListTitle({description, label}) {
  return (
    <span className="ring-list__title ring-list__text">
      <span className="ring-list__text__label ring-list__title-text">{label}</span>
      <div className="ring-list__text__description">{description}</div>
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
