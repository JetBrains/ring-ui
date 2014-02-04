define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils',
  'popup/popup'
], function ($, View, Module) {
  'use strict';

  var MODULE = 'link-list';
  var COMPONENT_SELECTOR = '.ring-js-link-list';

  var popup = Module.get('popup');
  var $body = $('body');

  var create = function (data) {
    var linkList = Module.get(MODULE);

    if (!data) {
      linkList.trigger('show:fail');
      return false;
    }

    return $(View.render(MODULE, data));
  };

  $(document).delegate('*', 'click.ring-dropdown', function (e) {
    var $target = $(e.currentTarget).closest(COMPONENT_SELECTOR);

    if ($target.length) {
      var wrapper = popup('create', {
        target: $target
      });
      $body.append(wrapper.el);

      /**
       *
       * @ToDo Add dataSource in create func
       */
      var q = $(View.render('dropdown__items', {items: [
        {label: 'test'},
        {label: 'test2'}
      ]}));

      wrapper.el.
        html(q).
        css(wrapper.getPos());
      return false;
    }

    e.stopPropagation();
  });

  // Public methods
  Module.add(MODULE, {
    create: {
      method: create,
      override: true
    }
  });
});