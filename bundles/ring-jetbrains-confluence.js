define([
  'jquery',
  'global/global',
  'menu/menu',
  'header/header',
  'header/header__internal'
], function($, ring) {
  // Remove all jQuery variables from the global scope
  $.noConflict();

  var header = ring('header');
  header('init');

  // Render header
  $(function(){
    var $username = $('#user-menu-link');

    $username
      .hide()
      .next('.ajs-drop-down').css('top', 0);

    header.one('init:done', function() {
      header('update', 'user.name', $username.text());
    });

    $(document).on('click.ring.personal', '.ring-header__personal', function() {
      $username.click();
    });
  });

  return ring;
});