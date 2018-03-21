/* global ConicGradient */
import 'conic-gradient';

import memoize from './memoize';

const needsFallback = memoize(() => {
  const div = document.createElement('div');
  div.style.backgroundImage = 'conic-gradient(white, black)';
  return !div.style.backgroundImage;
});

const conicGradient = memoize(stops => (
  needsFallback()
    ? new ConicGradient({stops}).toString()
    : `conic-gradient(${stops})`
));

export default stops => conicGradient(stops.join(','));
