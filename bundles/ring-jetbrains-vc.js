define([
  'jquery',
  'global/global',
  'menu/menu',
  'header/header',
  'header/header__internal'
], function($, ring) {
  // Remove all jQuery variables from the global scope
  $.noConflict(true);

  var header = ring('header');
  var init = header('init', null, 'td:eq(0):not([class^=dialog])', 'prepend');
  var PERSONAL_SELECTOR = '.ring-header__personal';

  init.done(function() {
    var $username = $('button:eq(3)').parents('div:eq(2)').hide();

    var adapt = function($header) {
      $header.after('<div style="height: 5px;"></div>');

      var $personal = $(PERSONAL_SELECTOR);
      var offset = $personal.offset();

      offset.right = $header.width() - offset.left - $personal.width();
      offset.left = '';
      offset.top = 26;

      $(document).on('click.ring.personal', PERSONAL_SELECTOR, function() {
        $username.find('div:eq(1)').click();

        $('.gwt-PopupPanel').css(offset);
      });
    };

    header('update', 'user.name', $username.text()).done(adapt);
  });

  return ring;
});