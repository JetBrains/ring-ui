/* global ConicGradient */
import 'conic-gradient';

import memoize from './memoize';
import supportsCss from './supports-css';

const conicGradient = memoize(stops => (
  supportsCss('background-image: conic-gradient(white, black)')
    ? `conic-gradient(${stops})`
    : new ConicGradient({stops})
));

export default stops => conicGradient(stops).toString();

export const conicGradientWithMask = (mask, stops) => {
  const gradient = conicGradient(stops);

  if (!mask.supports && gradient instanceof ConicGradient) {
    Object.defineProperty(gradient, 'svg', {
      value: gradient.svg.replace('<image ', `
        ${mask.svgDefs}    
        <image mask="url(#${mask.maskId})" `)
    });
  }

  return {
    ...mask.css,
    'background-image': gradient.toString()
  };
};

