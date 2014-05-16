define([
  'jquery',
  'global/global__modules',
  'global/global__views',
  'footer/_footer.hbs',
  'footer/_footer__item.hbs'
], function($, Module, View) {
  'use strict';

  var module = 'footer';

  Module.add(module, {
    init: function(data, element, method) {
      return View.init(module, element || null, method || null, {}, data || {});
    },
    update: View.update.bind(View, module)
  });

});
