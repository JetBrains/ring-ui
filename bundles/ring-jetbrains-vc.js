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
  var init = header('init', null, '.GM2S2EEBHN table:eq(0)', 'prepend');

  init.done(function() {
    var $username = $('button:eq(3)').parents('div:eq(2)').hide();
    console.log($username);

    header('update', 'user.name', $username.text()).done(function($header) {
      $header.after('<div style="height: 5px;"></div>');
    });

    $(document).on('click.ring.personal', '.ring-header__personal', function() {
      $username.find('div:eq(1)').click();

      $('.gwt-PopupPanel').css({
        top: 26,
        right: -62,
        left: ''
      });
    });
  });

  return ring;
});