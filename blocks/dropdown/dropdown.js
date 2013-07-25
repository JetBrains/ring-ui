define(['jquery', 'global/global__views', 'global/global__modules'], function($, View, Module) {
  'use strict';

  var COMPONENT_SELECTOR = '.ring-js-dropdown';
  var EDGE_OFFSET = 8;

  var $global = $(window);
  var $body;
  var $dropdown;
  var target;

  var create = function(data, $target) {
    var currentTarget = $target[0];
    var sameTarget = (currentTarget && target === currentTarget);

    if (!data) {
      data = $target.data('ring-dropdown');
    }

    remove();

    if (data && !sameTarget) {
      target = currentTarget;

      if (typeof data === 'object' && !data.html) {
        data = {items: data};
      }

      if (typeof data === 'string') {
        data = {html: data};
      }

      if (data instanceof $) {
        data = {html: $('<div></div>').wrapInner(data.clone()).html()};
      }

      if (!$body) {
        $body = $('body');
      }

      $dropdown = $(View.render('dropdown', data));
      $dropdown.appendTo($body);

      var pos = $target.offset();
      var targetCenter = pos.left + $target.outerWidth() / 2;

      var dropdownWidth = $dropdown.width();
      var dropdownCenter = dropdownWidth / 2;

      if (targetCenter < dropdownCenter) {
        $dropdown.addClass('ring-dropdown_left');
        pos.left -= EDGE_OFFSET;
      } else if (targetCenter + dropdownCenter > $global.width()) {
        $dropdown.addClass('ring-dropdown_right');
        pos.left += $target.width() - dropdownWidth + EDGE_OFFSET;
      } else {
        pos.left = targetCenter - dropdownCenter;
      }

      pos.top += $target.outerHeight() + 15;

      $dropdown.css(pos);

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

      return true;
    } else {
      return false;
    }
  };

  // Using delegate because of compatibility with YouTrack's jQuery 1.5.1
  $(document).delegate('*','click.ring.dropdown', function(e) {
    return create(null, $(e.currentTarget).closest(COMPONENT_SELECTOR));
  });

  // Remove on resize
  $global.resize(remove);

  // Public methods
  Module.add('dropdown', {
    show: create,
    hide: remove
  });
});