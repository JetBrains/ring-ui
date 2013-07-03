define(['jquery'], function($) {
  var computedStyles = window.getComputedStyle && window.getComputedStyle(document.documentElement, '');
  var webkitFontSmoothing = computedStyles && 'webkitFontSmoothing' in computedStyles;

  var windows = !!window.navigator.platform.match(/win/i);
  var $html = $('html');

  if (windows && !webkitFontSmoothing) {
    $html.addClass('no-font-antialiasing');
  } else {
    $html.addClass('font-antialiasing');
  }
});