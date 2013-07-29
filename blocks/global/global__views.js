define(['jquery', 'handlebars', 'global/global__modules'], function($, Handlebars, Module) {
  'use strict';

  var views = {};

  // TODO Refactor
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

  var $body;
  var methods = {
    append: 'appendTo',
    prepend: 'prependTo',
    before: 'insertBefore',
    after: 'insertAfter',
    'default': 'appendTo'
  };

  var addElement = function addElement($html, $element, method, counter) {
    counter = counter || 0;
    var $elem;
    if (typeof $element === 'string' || $element instanceof Node) {
      $elem = $($element);
    } else if (!($element instanceof $)) {
      $elem = $body || ($body = $('body'));
    }

    if (!$elem[0] && counter < 300) {
      setTimeout(addElement.bind(null, $html, $element, method, ++counter), 10);
      return;
    } else if (counter >= 300) {
      // give up
      // TODO logging
    }

    method = methods[method] || methods['default'];

    return $html[method]($elem);
  };

  View.update = function(name, process, path, data) {
    var view = views[name];

    if (!view) {
      Module.util.log('There is no view for module "' + name + '"');
      return null;
    }

    var module = Module.get(name);
    var args = Array.prototype.slice.call(arguments, 2, 'view');
    data = module.update.apply(module, args);

    var html = View.render(name, pipe(process, data));

    if (html) {
      view.update(html);
      return(view.$element);
    } else {
      return null;
    }
  };

  View.init = function(name, $element, method, process, data) {
    var module = Module.get(name);
    module.set({
      view: data
    });

    var html = View.render(name, pipe(process, data));

    if (html) {
      var $html = $(html);
      views[name] = new View($html);
      return addElement($html, $element, method);
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