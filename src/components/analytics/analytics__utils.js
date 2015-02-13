'use sctrict';

var AnaliticsUtils = {};
/**
 * Statistics server does not accepts strings with dots and undefined-values
 * @param str
 * @returns str, where all dots replaced by '_'
 */
AnaliticsUtils.reformatString = function (str) {
  if (typeof str === 'string') {
    return str.replace(/\./g, '_');
  }
  return String(str);
};

AnaliticsUtils.getPageViewDurationPresentation = function (duration) {
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

AnaliticsUtils.getUserAgentPresentation = function () {
  if (window.opera) {
    return 'opera$' + window.opera.version();
  }
  if (/(MSIE|Firefox|Chrome|Safari|Konqueror)\W*([\w]+)*/i.test(navigator.userAgent)) {
    return RegExp.$1.toLowerCase() + '$' + RegExp.$2;
  }
  return 'unknown';
};

module.exports = AnaliticsUtils;
