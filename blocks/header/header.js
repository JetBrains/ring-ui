define([
  'jquery',
  'global/global__modules',
  'global/global__views',
  'dropdown-menu/dropdown-menu',
  'header/_header.hbs',
  'dropdown-menu/_dropdown-menu__component.hbs',
  'jquery.actual'
], function ($, Module, View) {
  'use strict';

  var SERVICES_COUNT = 0;
  var inited;
  var HEADER_ITEM_SELECTOR = '.ring-header__item';
  var HEADER_RIGHT_MARGIN = 200;

  var process = function (data) {
    if (data.user) {
      var links = data.personalLinks && data.personalLinks.length ? [].concat(data.personalLinks) : [];

      // Fix duplicate profile links in YouTrack
      // TODO Figure out if they should be always defined in Hub
      var linksLabels = {};
      $.each(links, function (index, link) {
        if (link && link.label) {
          linksLabels[link.label] = true;
        }
      });

      if (data.authLinks) {
        $.each(data.authLinks, function (index, link) {
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

    if (data.services && SERVICES_COUNT && data.services.length > SERVICES_COUNT) {
      data.items = data.services.splice(SERVICES_COUNT);
    }
    return data;
  };

  var update = function (name, data) {
    SERVICES_COUNT = 0;
    var $el = View.update(module, name, data);
    var documentWidth = $(document).width();
    var itemsWidth = 0;
    var $items = $el.find(HEADER_ITEM_SELECTOR);


    $.each($items, function (index) {
      if ((documentWidth - HEADER_RIGHT_MARGIN) < itemsWidth) {
        SERVICES_COUNT = index - 1;
        View.update(module, '.', {
          services: data
        });
        return false;
      }
      itemsWidth += $(this).actual('outerWidth', {
        clone: true
      });
    });

    return $el;
  };

  var module = 'header';

  Module.add(module, {
    init: function (data, element, method) {
      return View.init(module, element || null, method || 'prepend', process, data || {}).done(function() {
        inited = true;
      });
    },
    update: function (name, data) {
      if (inited) {
        update(name, data);
      } else {
        Module.get('header').when('init:done').then(function() {
          update(name, data);
        });
      }
    },
    getServicesCount: function () {
      return SERVICES_COUNT;
    }
  });

});
