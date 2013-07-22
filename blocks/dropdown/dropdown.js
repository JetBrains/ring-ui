define(['jquery', 'global/global__templates', 'global/global__modules'], function($, Template, Module) {
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
    var dfd = $.Deferred;

    if (!data) {
      data = $target.data('ring-dropdown');
    }

    remove();

    if (data && !sameTarget) {
      target = currentTarget;

      if (typeof data === 'string') {
        data = {html: data};
      }

      if (data instanceof $) {
        data = {html: $('<div></div>').wrapInner(data.clone()).html()};
      }

      if (!$body) {
        $body = $('body');
      }

      $dropdown = $(Template.render('dropdown', data));
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

      dfd.resolve();
    } else {
      dfd.reject();
    }
  };

  var remove = function() {
    var dfd = $.Deferred;

    if ($dropdown) {
      $dropdown.remove();
      $dropdown = null;

      target = null;

      dfd.resolve();
    } else {
      dfd.reject();
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