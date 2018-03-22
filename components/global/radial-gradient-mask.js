import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

import getUID from './get-uid';
import supportsCss from './supports-css';

const radialGradient = (length, stops) =>
  `radial-gradient(${length}, ${Object.entries(stops).map(entry => entry.join(' ')).join(', ')})`;

export default (length, stops) => {
  for (const prefix of ['', '-webkit-']) {
    const property = `${prefix}mask-image`;
    const declaration = `${property}: radial-gradient(black, white)`;
    if (supportsCss(declaration)) {
      return {
        supports: true,
        css: {
          [property]: radialGradient(length, stops)
        }
      };
    }
  }

  const svg = document.createElement('svg');
  document.body.appendChild(svg);
  const gradientId = getUID('gradient');
  const maskId = getUID('mask');
  const svgDefs = renderToStaticMarkup(
    <defs>
      <radialGradient id={gradientId}>
        {Object.entries(stops).map(([color, offset]) => (
          <stop key={`${color} ${offset}`} offset={offset} stopColor={color}/>
        ))}
      </radialGradient>
      <mask id={maskId}>
        <rect height="100%" width="100%" fill={`url(#${gradientId})`}/>
      </mask>
    </defs>
  );
  return {
    supports: false,
    css: {},
    maskId,
    svgDefs
  };
};
