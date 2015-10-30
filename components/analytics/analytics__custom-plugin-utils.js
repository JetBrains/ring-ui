import Sniffr from 'sniffr';

const AnalyticsCustomPluginUtils = {};

/**
 * Statistics server does not accept strings with some symbols and undefined values
 * @param value
 * @param isCategory
 * @returns string, where prohibitted symbols are replaced with '_'
 */
AnalyticsCustomPluginUtils.reformatString = function (value, isCategory) {
  const str = String(value);
  /**
   * Category also cannot contain symbol '/' (but action can)
   */
  const regexp = isCategory ? /[\.:;!@#^&*()\{}\[\]?,%=+\\\/]+/g : /[\.:;!@#^&*()\{}\[\]?,%=+\\]+/g;
  return str.replace(regexp, '_');
};

AnalyticsCustomPluginUtils.getPageViewDurationPresentation = function (durationMs) {
  const duration = durationMs / 1000;
  if (duration > 3600) {
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

  return 'less-than-' + roundedDuration + '-sec';
};

AnalyticsCustomPluginUtils.getScreenWidthPresentation = function () {
  /**
   * Sizes were taken from bootstrap's grid (xs, sm, md, lg)
   */
  const sizes = [0, 768, 992, 1200];
  for (let i = 1; i < sizes.length; ++i) {
    if (window.innerWidth < sizes[i]) {
      return '[' + sizes[i - 1] + 'px;' + sizes[i] + 'px)';
    }
  }
  return '[1200px;inf)';
};

AnalyticsCustomPluginUtils.npeSaveLowerCase = function (val) {
  return (val || 'unknown').toLowerCase();
};

AnalyticsCustomPluginUtils.getUserAgentPresentation = function () {
  const sniffr = new Sniffr();
  sniffr.sniff();

  const name = AnalyticsCustomPluginUtils.npeSaveLowerCase(sniffr.browser.name || 'unknown');
  const majorVersion = sniffr.browser.version[0];
  const version = majorVersion || 'unknown';

  return name + '$' + version;
};

AnalyticsCustomPluginUtils.getDevicePixelRatioPresentation = function () {
  if (!window.devicePixelRatio || !window.devicePixelRatio.toFixed) {
    return 'unknown';
  }
  return String(window.devicePixelRatio.toFixed(1));
};

module.exports = AnalyticsCustomPluginUtils;
