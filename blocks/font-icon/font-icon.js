define(function(require) {
  var $ = require('jquery');

  // Windows non-webkit png sprite fallback
  var computedStyles = window.getComputedStyle && window.getComputedStyle(document.documentElement, '');
  var webkitFontSmoothing = computedStyles && 'webkitFontSmoothing' in computedStyles;
  var windows = !!window.navigator.platform.match(/win/i);

  if (windows && !webkitFontSmoothing) {
    $('html').addClass('no-font-antialiasing');
  }

  // IE7- generated content fallback
  var ie = (function(){
    var v = 3;
    var div = document.createElement('div');
    var all = div.getElementsByTagName('i');

    while (
      div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
      all[0]
    ){}

    return v > 4 ? v : undefined;
  }());

  if (!ie || ie > 7) {
    return;
  }

  // Icons w/ png fallback commented out
  var icons = {
    'ring-font-icon_modified' : '&#xe002;',
    'ring-font-icon_removed' : '&#xe003;',
    'ring-font-icon_renamed' : '&#xe004;',
    'ring-font-icon_plus' : '&#xe000;',
//    'ring-font-icon_search' : '&#xf002;',
    'ring-font-icon_cog' : '&#xf013;',
    'ring-font-icon_remove' : '&#xf00d;',
    'ring-font-icon_pencil' : '&#xf040;',
    'ring-font-icon_chevron-right' : '&#xf054;',
//    'ring-font-icon_ban-circle' : '&#xf05e;',
    'ring-font-icon_caret-down' : '&#xf0d7;',
    'ring-font-icon_caret-up' : '&#xf0d8;',
//    'ring-font-icon_help' : '&#xe001;',
    'ring-font-icon_added' : '&#xe006;',
    'ring-font-icon_check' : '&#xe005;'
  };

  var Module = require('global/global__modules');

  Module.get(Module.GLOBAL).on('menu:init:done', function() {
    $('.ring-font-icon').each(function(index, el) {
      var $el = $(el);
      var cls = $el.attr('class').match(/ring-font-icon_[^\s'"]+/);
      var icon = cls && icons[cls[0]];

      if (cls && icons[cls[0]]) {
        $el.prepend('<span style="font-family: \'font-icon\'">' + icon + '</span>');
      }
    });
  });
});