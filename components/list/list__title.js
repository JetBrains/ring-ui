import React from 'react';

export default function ListTitle(props) {
  return (
    <span className="ring-list__title">
      <div className="ring-list__description">{props.description}</div>
      <span className="ring-list__title-text">{props.label}</span>
    </span>
  );
}
