define(['jquery', 'handlebars'], function($, Handlebars) {
  'use strict';

  var COMPONENT_SELECTOR = '.component-dropdown';

  var $global = $(window);
  var $body;
  var $dropdown;
  var target;

  var create = function(data, $target, dontClean) {
    if (data) {
      if (!dontClean) {
        remove();
      }

      if (!($target instanceof $)) {
        $target = $($target);
      }

      if (!$body) {
        $body = $('body');
      }

      $dropdown = $(Handlebars.partials.dropdown(data));
      $dropdown.appendTo($body);

      var pos   = $target.offset();
      pos.top  += $target.outerHeight() + 15;
      pos.left += $target.outerWidth() / 2 - $dropdown.width() / 2;

      $dropdown.css(pos);

      $global.trigger('ring:dropdown:created');

      return true;
    } else {
      return false;
    }
  };

  var remove = function() {
    if ($dropdown) {
      $dropdown.remove();
      $dropdown = null;

      target = null;

      $global.trigger('ring:dropdown:removed');
    }
  };

  // Using delegate because of compatibility with YouTrack's jQuery 1.5.1
  $(document).delegate('*','click.ring.dropdown', function(e) {
    var $currentTarget = $(this).closest(COMPONENT_SELECTOR);
    var currentTarget = $currentTarget[0];
    var sameTarget = (target === currentTarget);

    remove();

    if (currentTarget && !sameTarget) {
      target = currentTarget;
      var data = $currentTarget.data('component');

      return !create(data, $currentTarget, true);
    }
  });

  // Public methods
  return {
    create: create,
    remove: remove
  };
});