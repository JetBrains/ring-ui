;(function($, Handlebars) {
  var $body;
  var $doc = $(document);
  var $dropdown;
  var target;

  var remove = function() {
    if ($dropdown) {

      $dropdown.remove();
      $dropdown = null;

      target = null;

      /* Rare case with opening dropdown from component's descendants nodes
       while closing another dropdown */
      var $thisDropdown = $(this).closest('.component-dropdown');
      if ($thisDropdown[0] !== this) {
        $thisDropdown.click();
      }

      return false;
    }
  }

  // Using delegate because of compability with Youtrack's jQuery 1.5.1

  $doc.delegate(':not(.component-dropdown)', 'click.close-dropdown', remove);

  $doc.delegate('.component-dropdown', 'click.open-dropdown', function() {
    var $this = $(this);
    var sameTarget = (target === this || target === $this.closest('.component-dropdown')[0]);

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
      $dropdown = $(Handlebars.partials['dropdown'](data));
      $dropdown.appendTo($body);

      var pos = $this.offset();
      pos.top += $this.outerHeight() + 15;
      pos.left += $this.outerWidth() / 2 - $dropdown.width() / 2;

      $dropdown.css(pos);
    }

    return false;
  });


}(jQuery, Handlebars));

/**
 * jQuery JSON plugin 2.4.0
 *
 * @author Brantley Harris, 2009-2011
 * @author Timo Tijhof, 2011-2012
 * @source This plugin is heavily influenced by MochiKit's serializeJSON, which is
 *         copyrighted 2005 by Bob Ippolito.
 * @source Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
 *         website's http://www.json.org/json2.js, which proclaims:
 *         "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 *         I uphold.
 * @license MIT License <http://www.opensource.org/licenses/mit-license.php>
 */
(function ($) {
  'use strict';

  var escape = /["\\\x00-\x1f\x7f-\x9f]/g,
    meta = {
      '\b': '\\b',
      '\t': '\\t',
      '\n': '\\n',
      '\f': '\\f',
      '\r': '\\r',
      '"' : '\\"',
      '\\': '\\\\'
    },
    hasOwn = Object.prototype.hasOwnProperty;

  /**
   * jQuery.toJSON
   * Converts the given argument into a JSON representation.
   *
   * @param o {Mixed} The json-serializable *thing* to be converted
   *
   * If an object has a toJSON prototype, that will be used to get the representation.
   * Non-integer/string keys are skipped in the object, as are keys that point to a
   * function.
   *
   */
  $.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function (o) {
    if (o === null) {
      return 'null';
    }

    var pairs, k, name, val,
      type = $.type(o);

    if (type === 'undefined') {
      return undefined;
    }

    // Also covers instantiated Number and Boolean objects,
    // which are typeof 'object' but thanks to $.type, we
    // catch them here. I don't know whether it is right
    // or wrong that instantiated primitives are not
    // exported to JSON as an {"object":..}.
    // We choose this path because that's what the browsers did.
    if (type === 'number' || type === 'boolean') {
      return String(o);
    }
    if (type === 'string') {
      return $.quoteString(o);
    }
    if (typeof o.toJSON === 'function') {
      return $.toJSON(o.toJSON());
    }
    if (type === 'date') {
      var month = o.getUTCMonth() + 1,
        day = o.getUTCDate(),
        year = o.getUTCFullYear(),
        hours = o.getUTCHours(),
        minutes = o.getUTCMinutes(),
        seconds = o.getUTCSeconds(),
        milli = o.getUTCMilliseconds();

      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      if (hours < 10) {
        hours = '0' + hours;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      if (milli < 100) {
        milli = '0' + milli;
      }
      if (milli < 10) {
        milli = '0' + milli;
      }
      return '"' + year + '-' + month + '-' + day + 'T' +
        hours + ':' + minutes + ':' + seconds +
        '.' + milli + 'Z"';
    }

    pairs = [];

    if ($.isArray(o)) {
      for (k = 0; k < o.length; k++) {
        pairs.push($.toJSON(o[k]) || 'null');
      }
      return '[' + pairs.join(',') + ']';
    }

    // Any other object (plain object, RegExp, ..)
    // Need to do typeof instead of $.type, because we also
    // want to catch non-plain objects.
    if (typeof o === 'object') {
      for (k in o) {
        // Only include own properties,
        // Filter out inherited prototypes
        if (hasOwn.call(o, k)) {
          // Keys must be numerical or string. Skip others
          type = typeof k;
          if (type === 'number') {
            name = '"' + k + '"';
          } else if (type === 'string') {
            name = $.quoteString(k);
          } else {
            continue;
          }
          type = typeof o[k];

          // Invalid values like these return undefined
          // from toJSON, however those object members
          // shouldn't be included in the JSON string at all.
          if (type !== 'function' && type !== 'undefined') {
            val = $.toJSON(o[k]);
            pairs.push(name + ':' + val);
          }
        }
      }
      return '{' + pairs.join(',') + '}';
    }
  };


  /**
   * jQuery.quoteString
   * Returns a string-repr of a string, escaping quotes intelligently.
   * Mostly a support function for toJSON.
   * Examples:
   * >>> jQuery.quoteString('apple')
   * "apple"
   *
   * >>> jQuery.quoteString('"Where are we going?", she asked.')
   * "\"Where are we going?\", she asked."
   */
  $.quoteString = function (str) {
    if (str.match(escape)) {
      return '"' + str.replace(escape, function (a) {
        var c = meta[a];
        if (typeof c === 'string') {
          return c;
        }
        c = a.charCodeAt();
        return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
      }) + '"';
    }
    return '"' + str + '"';
  };

}(jQuery));

(function($, Handlebars) {
  Handlebars.registerHelper('stringify', function(items) {
    return $.toJSON(items);
  });
}(jQuery, Handlebars))