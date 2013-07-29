define(['jquery', 'handlebars', 'global/global__modules'], function($, Handlebars, Module) {
  'use strict';

  var views = {};

  var View = function($element) {
    this.$element = $element;
  };

  View.prototype.update = function($element) {
    if (!($element instanceof $)) {
      $element = $($element);
    }

    this.$element.replaceWith($element);
    this.$element = $element;
  };

  View.render = function(template, data) {
    var html = Handlebars.partials[template](data);
    if (html.replace(/\s+/, '') !== '') {
      return html;
    } else {
      Module.util.log('Empty template for module "' + module + '"');
      return '';
    }
  };

  var pipe = function(process, data) {
    var newData = $.extend(true, {}, data);

    if (typeof process === 'function') {
      return process(newData);
    } else {
      return newData;
    }
  };

  View.update = function(name, process, path, data) {
    var view = views[name];

    if (!view) {
      Module.util.log('There is no view for module "' + name + '"');
      return null;
    }

    var module = Module.get(name);
    data = module.update('view', path, data);

    var html = View.render(name, pipe(process, data));

    if (html) {
      view.update(html);
      return(view.$element);
    } else {
      return null;
    }
  };

  View.init = function(name, process, data) {
    var module = Module.get(name);
    module.set({
      view: data
    });

    var html = View.render(name, pipe(process, data));

    if (html) {
      var $html = $(html);
      $html.prependTo($('body'));
      views[name] = new View($html);
      return $html;
    } else {
      Module.util.log('Empty template for module "' + module + '"');
      return null;
    }
  };

  // Add render to global module
  Module.add(Module.GLOBAL, {
    render: {
      method: View.render,
      override: true
    }
  });

  return View;
});