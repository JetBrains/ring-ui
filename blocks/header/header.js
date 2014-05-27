define([
  'jquery',
  'global/global__modules',
  'global/global__views',
  'dropdown-menu/dropdown-menu',
  'font-icon/font-icon',
  'header/_header.hbs',
  'dropdown-menu/_dropdown-menu__component.hbs'
], function($, Module, View) {
  'use strict';

  var SERVICES_COUNT = 20,
    HEADER_ITEM_SELECTOR = '.ring-header__item',
    HEADER_RIGHT_MARGIN = 200;

  var process = function (data) {
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
        username: data.user.name
      };

      if (links.length) {
        data.personal.items = links;
      }
    }

    if (data.services && data.services.length > SERVICES_COUNT) {
      data.items = data.services.splice(SERVICES_COUNT);
    }

    return data;
  };

  var module = 'header';

  Module.add(module, {
    init: function (data, element, method) {
      return View.init(module, element || null, method || 'prepend', process, data || {});
    },
    update: function (name, data) {
      var $el = View.update('header', name, data),
        documentWidth = $(document).width(),
        itemsWidth = 0,
        $items = $el.find(HEADER_ITEM_SELECTOR);

      $.each($items, function (index) {
        if ((documentWidth - HEADER_RIGHT_MARGIN) < itemsWidth) {
          SERVICES_COUNT = index - 1;
          View.update(module, name, data.slice(0, SERVICES_COUNT));
          View.update(module, 'items', data.slice(SERVICES_COUNT));
          return false;
        }

        itemsWidth += $(this).outerWidth();
      });


    }
  });

});
