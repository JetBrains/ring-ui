import type {PropertiesHyphen} from 'csstype';

import getUID from './get-uid';
import supportsCss from './supports-css';

const radialGradient = (length: number, stops: Record<string, string>) =>
  `radial-gradient(${length}, ${Object.entries(stops).map(entry => entry.join(' ')).join(', ')})`;

export interface RadialGradientMask {
  supports: boolean
  css: PropertiesHyphen
  maskId?: string
  svgDefs?: string
}

export default (length: number, stops: Record<string, string>): RadialGradientMask => {
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

  const gradientId = getUID('gradient');
  const maskId = getUID('mask');
  const svgDefs = `
    <svg>
      <defs>
        <radialGradient id="${gradientId}">
          ${Object.entries(stops).map(([color, offset]) => `
            <stop offset="${offset}" stop-color="${color}"/>
          `).join('')}
        </radialGradient>
        <mask id="${maskId}">
          <rect height="100%" width="100%" fill="url(#${gradientId})"/>
        </mask>
      </defs>
    </svg>
  `;
  return {
    supports: false,
    css: {},
    maskId,
    svgDefs
  };
};
