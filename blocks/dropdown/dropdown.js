define(['jquery', 'handlebars'], function($, Handlebars) {
  'use strict';

  var COMPONENT_SELECTOR = '.component-dropdown';

  var $global = $(window);
  var $body;
  var $dropdown;
  var target;

  var create = function(data, $target, currentTarget) {
    data = data ||  $target.data('component');

    if (data) {
      if (!($target instanceof $)) {
        currentTarget = currentTarget || $target;
        $target = $($target);
      } else {
        currentTarget = currentTarget || $target[0];
      }

      remove();

      target = currentTarget;

      if (typeof data === 'string') {
        data = {html: data};
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
    var $currentTarget = $(e.currentTarget).closest(COMPONENT_SELECTOR);
    var currentTarget = $currentTarget[0];

    if (currentTarget && target !== currentTarget) {
      return !create(null, $currentTarget, currentTarget);
    } else {
      remove();
      return false;
    }
  });

  // Public methods
  return {
    create: create,
    remove: remove
  };
});