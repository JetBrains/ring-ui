/**
 * Detecting browsers
 */
export default class browserSniffer {
  static navigator =  window.navigator;

  static isFirefox() {
    return browserSniffer.navigator
        .userAgent.toLowerCase().indexOf('firefox') > -1;
  }

  static isIE() {
    return typeof document.documentMode === 'number';
  }
}
