/**
 * Detecting browsers
 */
var browserSniffer = {
  navigator: window.navigator,
  isFirefox: function() {
    return browserSniffer.navigator
      .userAgent.toLowerCase().indexOf('firefox') > -1;
  }
};

module.exports = browserSniffer;
