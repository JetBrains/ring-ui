/**
 * Resolve url for svg icons
 */
import browser from 'browser-sniffer/browser-sniffer';

export default class IconUrl {

  /**
   * @return {string} The base url for current page
   */
  static getBaseUrl() {

    /**
     * Fix problem with xlink:href attribute and base tag in
     * Firefox and Blink
     * @see https://bugzilla.mozilla.org/show_bug.cgi?id=652991
     * https://github.com/angular/angular.js/issues/8934
     */
    return browser.isFirefox() ? location.href : '';
  }

  /**
   * @param {string} relUrl The value of xlink:href
   * @return {string} The url relative to base url for current page
   */
  static resolve(relUrl) {

    /**
     * @param {string} url
     * @return {string} url without url fragment
     */
    function removeUrlFragment(url) {
      return url.replace(/#.*/, '');
    }

    /**
     * @param {string} url
     * @param {string} urlFragment
     * @return {string} url with url fragment
     */
    function addUrlFragment(url, urlFragment) {
      return removeUrlFragment(url) + urlFragment;
    }

    return addUrlFragment(this.getBaseUrl(), relUrl);
  }
}
