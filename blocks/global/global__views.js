define(['jquery', 'handlebars', 'global/global__modules'], function($, Handlebars, Module) {
  'use strict';

  var views = {};

  var View = function($element) {
    this.$element = $element;
  };

  View.prototype.update = function($element) {
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

  View.update = function(module, process, path, data) {
    var dfd = $.Deferred();
    var view = views[module];

    if (!view) {
      Module.util.log('There is no view for module "' + module + '"');
      return dfd.reject().promise();
    }

    data = Module.configUpdate(module, path, data);
    var html = View.render(module, pipe(process, data));

    if (html) {
      view.update($(html));
      dfd.resolve();
    } else {
      dfd.reject();
    }

    return dfd.promise();
  };

  View.init = function(module, process, data) {
    Module.config(module, data);

    var html = View.render(module, pipe(process, data));

    if (html) {
      var $html = $(html);
      $html.prependTo($('body'));
      views[module] = new View($html);
    } else {
      Module.util.log('Empty template for module "' + module + '"');
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