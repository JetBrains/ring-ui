define(['jquery', 'handlebars'], function($, Handlebars) {
  'use strict';

  var views = {};
//  var SELECTOR_PREFIX = '.ring-';

  var View = function(view) {
    views[view] = view;
  };

  View.render = function(template, data) {
    return Handlebars.partials[template](data);
  };

  View.update = function(name, data) {
    var $html = $(View.render(name, data));
//    if (views[name]) {
//
//    } else {
//      views[name] = new View(name, data);
//    }
    $html.prependTo($('body'));
  };

  return View;

});