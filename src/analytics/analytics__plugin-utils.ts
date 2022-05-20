import sniffer from '../global/sniffer';

const SECOND = 1000;
const HOUR = 3600;

const AnalyticsPluginUtils = {
  /**
   * Statistics server does not accept undefined values and strings containing certain symbols
   * @param value
   * @param isCategory
   * @returns string, where forbidden symbols are replaced with '_'
   */
  reformatString: (value: unknown, isCategory?: boolean) => {
    const str = String(value);
    /**
     * Category also cannot contain the '/' character (but an action can)
     */
    const regexp = isCategory ? /[.:;!@#^&*(){}\[\]?,%=+\\\/]+/g : /[.:;!@#^&*(){}\[\]?,%=+\\]+/g;
    return str.replace(regexp, '_');
  },

  getPageViewDurationPresentation: (durationMs?: number) => {
    if (durationMs == null) {
      return 'less-than-1-sec';
    }

    const duration = durationMs / SECOND;
    if (duration > HOUR) {
      return 'more-than-hour';
    }

    /**
     * rounded duration possible values:
     * less than 1 second: [0, 1)
     * less than 2 seconds: [1, 2)
     * less than 4 seconds: [2, 4)
     * less than 16 seconds: [4, 16)
     * ....
     * n - less than 2^(n + 1) seconds
     */
    let roundedDuration = Math.floor(Math.pow(2, Math.floor(Math.log2(duration)) + 1));
    roundedDuration = (roundedDuration > 0) ? roundedDuration : 1;

    return `less-than-${roundedDuration}-sec`;
  },

  getScreenWidthPresentation: () => {
    /**
     * Sizes were taken from bootstrap's grid (xs, sm, md, lg)
     */
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const sizes = [0, 768, 992, 1200];
    for (let i = 1; i < sizes.length; ++i) {
      if (window.innerWidth < sizes[i]) {
        return `[${sizes[i - 1]}px;${sizes[i]}px)`;
      }
    }
    return '[1200px;inf)';
  },

  npeSaveLowerCase: (val: string | null | undefined) => (val || 'unknown').toLowerCase(),

  getUserAgentPresentation: () => {
    const name = AnalyticsPluginUtils.npeSaveLowerCase(sniffer.browser.name || 'unknown');
    const majorVersion = sniffer.browser.version[0];
    const version = majorVersion || 'unknown';

    return `${name}$${version}`;
  },

  getDevicePixelRatioPresentation: () => {
    if (!window.devicePixelRatio || !window.devicePixelRatio.toFixed) {
      return 'unknown';
    }
    return String(window.devicePixelRatio.toFixed(1));
  }
};

export default AnalyticsPluginUtils;
