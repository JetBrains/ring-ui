/**
 * Resolve url for svg icons
 */
var browser = require('browser-sniffer/browser-sniffer');

module.exports = {

  /**
   * @return {string} The base url for current page
   */
  getBaseUrl: function() {

    /**
     * Fix problem with xlink:href attribute and base tag in
     * Firefox and Blink
     * @see https://bugzilla.mozilla.org/show_bug.cgi?id=652991
     * https://github.com/angular/angular.js/issues/8934
     */
    return browser.isFirefox() ? location.href : '';
  },

  /**
   * @param {string} relUrl The value of xlink:href
   * @return {string} The url relative to base url for current page
   */
  resolve: function(relUrl) {

    /**
     * @param {string} url
     * @return {string} url without url fragment
     */
    var removeUrlFragment = function(url) {
      return url.replace(/#.*/, '');
    };

    /**
     * @param {string} url
     * @param {string} urlFragment
     * @return {string} url with url fragment
     */
    var addUrlFragment = function(url, urlFragment) {
      return removeUrlFragment(url) + urlFragment;
    };

    return addUrlFragment(this.getBaseUrl(), relUrl);
  }
};
