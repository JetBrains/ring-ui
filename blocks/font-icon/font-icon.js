define(['jquery'], function($) {
  // Windows non-webkit png sprite fallback
  var computedStyles = window.getComputedStyle && window.getComputedStyle(document.documentElement, '');
  var webkitFontSmoothing = computedStyles && 'webkitFontSmoothing' in computedStyles;
  var windows = !!window.navigator.platform.match(/win/i);

  if (windows && !webkitFontSmoothing) {
    $('html').addClass('no-font-antialiasing');
  }
});