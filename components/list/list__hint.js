import React from 'react';

/**
 * @constructor
 * @extends {ReactComponent}
 */
export default function ListHint({label}) {
  return (
    <span className="ring-list__item ring-list__item_hint">{label}</span>
  );
}
