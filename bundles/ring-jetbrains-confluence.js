define([
  'jquery',
  'global/global',
  'menu/menu',
  'header/header',
  'header/header__internal'
], function($, ring) {
  // Remove all jQuery variables from the global scope
  $.noConflict();

  // Figure out CSS location from script location
  var scripts = document.getElementsByTagName('script');
  var ringScript;

  for (var i = scripts.length; i > 0; i--) {
    ringScript = scripts[i];

    if (ringScript && ringScript && ringScript.src.indexOf('ring-jetbrains-confluence.min.js') > -1) {
      break;
    } else {
      ringScript = null;
    }
  }

  // Stop if we could not find ourselves
  if (!ringScript || !ringScript.src) {
    return ring;
  }

  // Append stylesheet to document
  var ringPath = ringScript.src;
  var ringFolder = ringPath.substr(0, ringPath.lastIndexOf('/') + 1);
  $('<link rel="stylesheet" type="text/css" href="' + ringFolder + 'ring.min.css"/>').insertAfter(ringScript);

  // Render header
  $(function(){
    var $username = $('#user-menu-link');

    $username
      .hide()
      .next('.ajs-drop-down').css('top', 0);

    ring('header')('init', {
      user: {
        name: $username.text()
      }
    });

    $(document).on('click.ring.personal', '.ring-header__personal', function() {
      $username.click();
    });
  });

  return ring;
});