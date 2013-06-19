(function($, Handlebars, global) {
  var $body;
  var data;
  var html;

  var $global = $(global);
  var SELECTOR_PREFIX = '.ring-';
  var template = 'full-header'; // Default template

  var init = function(initData, component) {
    if (component) {
      template = component;
    }

    data = initData || this.data;

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
      return;
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
      $global.trigger('ring-updated');
    }
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

    updateHtml(clean);
  };

  global.ring = {
    init: init,
    update: update,
    render: render
  };

}(jQuery, Handlebars, this));