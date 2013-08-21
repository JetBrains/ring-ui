define(['jquery', 'handlebars', 'global/global__modules', 'global/global__utils'], function($, Handlebars, Module, utils) {
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

    if (!utils.isEmptyString(html)) {
      return html;
    } else {
      utils.log('Empty template for module "' + template + '"');
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
    replace: 'replaceWith',
    'default': 'appendTo'
  };

  var addElement = function addElement($html, $element, method, dfd, counter) {
    counter = counter || 0;
    var $target;

    if (typeof $element === 'string' || utils.isNode($element )) {
      $target = $($element);
    } else if (!($element instanceof $)) {
      // TODO Lazy DOM cache
      $target = $body && $body[0] ? $body : ($body = $('body'));
    } else {
      $target = $element;
    }

    if (!$target[0] && counter < 300) {
      setTimeout(addElement.bind(null, $html, $element, method, dfd, ++counter), 10);
      return;
    } else if (!$target[0] && counter >= 300) {
      // give up
      dfd.reject();
      return;
    }

    method = methods[method] || methods['default'];
    var ret;

    if (method === 'replaceWith')  {
      $target[method]($html);
      ret = $html;
    } else {
      ret = $html[method]($target);
    }

    dfd.resolve(ret);
  };

  View.update = function(name, path, data) {
    var view = views[name];

    if (!view) {
      utils.log('There is no view for module "' + name + '"');
      return null;
    }

    var module = Module.get(name);
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift('view');
    data = module.update.apply(module, args);

    var html = View.render(name, pipe(module.get('process'), data));

    if (html) {
      view.update(html);
      return(view.$element);
    } else {
      return null;
    }
  };

  View.init = function(name, $element, method, process, data) {
    var dfd = $.Deferred();
    var module = Module.get(name);
    module.set({
      view: data,
      process: process
    });

    var html = View.render(name, pipe(process, data));

    if (html) {
      var $html = $(html);

      addElement($html, $element, method, dfd);

      dfd.done(function(view) {
        views[name] = new View(view);
      });

      dfd.fail(function() {
        utils.log('Element for view "' + name + '" not for 3 seconds, aborting.');
      });

    } else {
      utils.log('Empty template for module "' + module + '"');
      dfd.reject();
    }

    return dfd;
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