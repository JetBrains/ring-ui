define(['jquery',  'global/global__modules', 'global/global__views', 'dropdown-menu/dropdown-menu', 'font-icon/font-icon'], function($, Module, View) {
  'use strict';

  var SERVICES_LIMIT = 10;

  var process = function(data) {
    if (data.user) {
      var links = data.personalLinks && data.personalLinks.length ? [].concat(data.personalLinks) : [];

      // Fix duplicate profile links in YouTrack
      // TODO Figure out if they should be always defined in Hub
      var linksLabels = {};
      $.each(links, function(index, link) {
        if (link && link.label) {
          linksLabels[link.label] = true;
        }
      });

      if (data.authLinks) {
        $.each(data.authLinks, function(index, link) {
          if (index !== 'login') {
            links.push(link);
          }
        });
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
