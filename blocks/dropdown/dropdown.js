define(['jquery', 'handlebars'], function($, Handlebars) {
  'use strict';

  var COMPONENT_SELECTOR = '.component-dropdown';

  var $global = $(window);
  var $body;
  var $dropdown;
  var target;

  var create = function(data, $target) {
    var currentTarget = $target[0];
    var sameTarget = (currentTarget && target === currentTarget);

    if (!data) {
      data = $target.data('component');
    }

    remove();

    if (data && !sameTarget) {
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

      return false;
    } else {
      return true;
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
    return create(null, $(e.currentTarget).closest(COMPONENT_SELECTOR));
  });

  // Public methods
  return {
    create: create,
    remove: remove
  };
});