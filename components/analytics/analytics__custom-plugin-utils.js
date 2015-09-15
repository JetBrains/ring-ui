import Sniffr from 'sniffr';

var AnalyticsCustomPluginUtils = {};
/**
 * Statistics server does not accept strings with dots and undefined values
 * @param str
 * @returns str, where dots are replaced with '_'
 */
AnalyticsCustomPluginUtils.reformatString = function (str) {
  if (typeof str === 'string') {
    return str.replace(/\./g, '_');
  }
  return String(str);
};

AnalyticsCustomPluginUtils.getPageViewDurationPresentation = function (duration) {
  duration = duration / 1000;
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
  var roundedDuration = Math.floor(Math.pow(2, Math.floor(Math.log2(duration)) + 1));
  roundedDuration = (roundedDuration > 0) ? roundedDuration : 1;
  return 'less-than-' + roundedDuration + '-sec';
};

AnalyticsCustomPluginUtils.getScreenWidthPresentation = function() {
  /**
   * Sizes were taken from bootstrap's grid (xs, sm, md, lg)
   */
  var sizes = [0, 768, 992, 1200];
  for (var i = 1; i < sizes.length; ++i) {
    if (window.innerWidth < sizes[i]) {
      return '[' + sizes[i - 1] + 'px;' + sizes[i] + 'px)';
    }
  }
  return '[1200px;inf)';
};

AnalyticsCustomPluginUtils.getUserAgentPresentation = function () {
  let sniffr = new Sniffr();
  sniffr.sniff();

  var name = (sniffr.browser.name || 'unknown').toLowerCase();
  var version = (sniffr.browser.version[0] || 'unknown').split('.')[0];
  return name + '$' + version;
};

module.exports = AnalyticsCustomPluginUtils;
