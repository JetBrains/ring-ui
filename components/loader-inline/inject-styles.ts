import {conicGradientWithMask} from '../global/conic-gradient';
import {injectRuleSet} from '../global/inject-styles';
import memoize from '../global/memoize';
import radialGradientMask from '../global/radial-gradient-mask';
import Theme from '../global/theme';

import styles from './loader-inline.css';

const IMAGE_SIZE = 32;

export default memoize(() => {
  const mask = radialGradientMask(styles.unit, {
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    transparent: `${23 / 32 * 100}%`,
    white: `${25 / 32 * 100}%`
    /* eslint-enable */
  });

  injectRuleSet(
    `.${styles.loader}_${[Theme.LIGHT]}::after, .ring-loader-inline::after`,
    conicGradientWithMask(mask, '#ff00eb,#bd3bff,#008eff, #58ba00,#f48700,#ff00eb', IMAGE_SIZE)
  );

  injectRuleSet(
    `.${styles.loader}_${[Theme.DARK]}::after, .ring-loader-inline_dark::after`,
    conicGradientWithMask(mask, '#ff2eef,#d178ff,#289fff,#88d444,#ffe000,#ff2eef', IMAGE_SIZE)
  );
});
