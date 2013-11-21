define(['jquery',  'global/global__modules', 'global/global__views', 'dropdown/dropdown', 'query-assist/query-assist' , 'font-icon/font-icon'], function($, Module, View) {
  'use strict';

  var SERVICES_LIMIT = 10;

  var process = function(data) {
    if (data.user) {
      var links = data.personalLinks && data.personalLinks.length ? [].concat(data.personalLinks) : [];

      for (var link in data.authLinks) {
        if (link !== 'login') {
          links.push(data.authLinks[link]);
        }
      }

      data.personal = {
        username: data.user.name,
        items: links
      };
    }

    if (data.services && data.services.length > SERVICES_LIMIT) {
      data.items = data.services.splice(SERVICES_LIMIT);
    }

    return data;
  };

  var module = 'header';

  Module.add(module, {
    init: function(data, element, method) {
      return View.init(module, element || null, method || 'prepend', process, data || {});
    },
    update: View.update.bind(View, module)
  });

});
