import 'conic-gradient';

import {RadialGradientMask} from './radial-gradient-mask';

import memoize from './memoize';
import supportsCss from './supports-css';


export interface ConicGradientConfig {
  stops: string
  size?: number | null | undefined
}

declare class ConicGradient {
  constructor(config: ConicGradientConfig)
  svg: string;
}

const conicGradient = memoize(({stops, size}: ConicGradientConfig) => (
  supportsCss('background-image: conic-gradient(white, black)')
    ? `conic-gradient(${stops})`
    : new ConicGradient({stops, size})
));

export default (stops: ConicGradientConfig) => conicGradient(stops).toString();

export const conicGradientWithMask = (mask: RadialGradientMask, stops: string, size?: number) => {
  const gradient = conicGradient({stops, size});

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

