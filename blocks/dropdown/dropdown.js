define(['jquery', 'handlebars'], function($, Handlebars) {
  'use strict';

  var COMPONENT_SELECTOR = '.component-dropdown';

  var $doc = $(document);
  var $body;
  var $dropdown;
  var target;

  var remove = function() {
    if ($dropdown) {
      $dropdown.remove();
      $dropdown = null;

      target = null;

      // Rare case with opening dropdown from component's descendants nodes while closing another dropdown
      var $thisDropdown = $(this).closest(COMPONENT_SELECTOR);
      if ($thisDropdown[0] !== this) {
        $thisDropdown.click();
      }

      return false;
    }

    return true;
  };

  // Using delegate because of compatibility with YouTrack's jQuery 1.5.1

  $doc.delegate(':not(.component-dropdown)', 'click.close-dropdown', remove);

  $doc.delegate('.component-dropdown', 'click.open-dropdown', function() {
    var $this = $(this);
    var sameTarget = (target === this || target === $this.closest(COMPONENT_SELECTOR)[0]);

    remove();

    if (sameTarget) {
      return false;
    }

    target = this;
    var data = $this.data('component');

    if (!$body) {
      $body = $('body');
    }

    if (data) {
      $dropdown = $(Handlebars.partials.dropdown(data));
      $dropdown.appendTo($body);

      var pos = $this.offset();
      pos.top += $this.outerHeight() + 15;
      pos.left += $this.outerWidth() / 2 - $dropdown.width() / 2;

      $dropdown.css(pos);
    }

    return false;
  });
});