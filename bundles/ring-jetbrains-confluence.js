define([
  'jquery',
  'global/global',
  'menu/menu',
  'header/header',
  'header/header__jetbrains-services'
], function($, ring) {
  // Remove all jQuery variables from the global scope
  $.noConflict(true);

  var header = ring('header');
  var init = header('init', null, '.ring-header', 'replace');

  // Render header
  $(function(){
    /* globals AJS */
    var $username = AJS.$('#user-menu-link');

    $username
      .hide()
      .next('.ajs-drop-down').css('top', 0);

    init.done(function() {
      header('update', 'user.name', $username.text());
    });

    $(document).on('click.ring.personal', '.ring-header__personal', function() {
      $username.click();
    });
  });

  return ring;
});