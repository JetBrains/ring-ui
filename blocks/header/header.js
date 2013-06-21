define(['jquery', 'handlebars', 'dropdown/dropdown', 'font-icon/font-icon'], function($, Handlebars, dropdown) {
  'use strict';

  var $body;
  var data;
  var html;

  var $global = $(document);
  var SELECTOR_PREFIX = '.ring-';
  var template = 'full-header'; // Default template

  var init = function(initData, component) {
    if (component) {
      template = component;
    }

    data = initData || this.data;

    // Render on DOM ready
    $(updateHtml);
  };

  var render = function(template, data) {
    return Handlebars.partials[template](data);
  };

  var clean = function() {
    $(SELECTOR_PREFIX + template).remove();
  };

  var updateHtml = function(cb) {
    if (!data) {
      return false;
    }

    if (!$body) {
      $body = $('body');
    }

    html = render(template, data);
    if (html) {
      if (typeof cb === 'function') {
        cb();
      }

      $body.prepend(html);
      $global.trigger('ring:header:updated');

      return true;
    }

    return false;
  };

  var update = function(path, value) {
    var part;
    var newData = {};
    var pathParts = path.split('.');

    while ((part = pathParts.pop())) {
      if (isNaN(Number(part))) {
        newData = {};
      } else {
        newData = [];
      }
      newData[part] = value;
      value = newData;
    }

    $.extend(true, data, newData);

    return updateHtml(clean);
  };

  return {
    init: init,
    update: update,
    render: render,
    dropdown: dropdown
  };

});