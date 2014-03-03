define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils',
  'shortcuts/shortcuts',
  'action-list/action-list',
  'delayed-listener/delayed-listener'
], function ($, View, Module, events, utils) {
  'use strict';

  var RESULT_COUNT = 5,
    POPUP_INPUT_SELECTOR = '.ring-js-popup-input';

  var popup = Module.get('popup'),
    MODULE = 'dropdown-filter',
    preventRender = false;

  var init = function (config) {
    var $target,
      wrapper;

    if (!config || !config.target || !config.actions) {
      utils.log('dropdown-filter: init params missing');
      return false;
    }

    $target = $(config.target);
    preventRender = false;

    $target.
      on('click', function (e) {
        wrapper = popup('init', config);
        _bindRemoveEvent(wrapper);
        preventRender = false;

        for (var i = 0; i < config.actions.length; i++) {
          var obj = config.actions[i];
          _render(obj);
        }
        e.stopPropagation();
      });

    var _render = function (action) {
      var title = $(View.render('popup-control', {
        title: action.title,
        type: action.type,
        input: true
      }));

      return action.dataSource('').done(function (data) {
        if (preventRender) {
          return false;
        }
        var actionList = Module.get('action-list');

        var items = actionList('init', {
          items: data
        });
        wrapper.appendHTML(title);
        wrapper.appendHTML(items);
        _bindDelayedListener(title.find(POPUP_INPUT_SELECTOR), action, items);
      });
    };

    var _bindDelayedListener = function ($el, action) {
      var delayedListener = Module.get('delayed-listener');
      if ($el) {
        delayedListener('init', {
          target: $el,
          onDelayedChange: function (data) {
            action.dataSource(data.value).then(function (data) {
              var actionList = Module.get('action-list');
              var items = actionList('init', {
                items: data
              });
              console.log(items);
            });
          }
        });
      }
    };
  };

  var configureUrl = function (config, query) {
    /**
     * @TODO add field expression for "users"
     */
    var url,
      auth = Module.get('auth');

    if (config.url.indexOf('#{userId}') !== -1) {
      auth('getUser').then(function (user) {
        config.url = config.url.replace('#{userId}', user.id);
      });
    }
    url = config.url +
      ('&$top=' + RESULT_COUNT) +
      (query ? '&query=name:' + query + ' or ' + query + '*' : '');

    return url;
  };

  var remoteDataSource = function (config) {
    var auth = Module.get('auth'),
      dropdownData = [];

    return function (query) {
      var dfd = $.Deferred(),
        restUrl = configureUrl(config, query);

      auth('get', restUrl).then(function (data) {
        var items;

        if (data[config.hubResource]) {
          items = data[config.hubResource];
        } else {
          dfd.resolve([
            {
              action: true,
              label: 'No results'
            }
          ]);
        }

        if (items) {
          items.forEach(function (item) {
            dropdownData.push({
              action: true,
              label: item.name,
              url: item.url || '',
              event: {
                data: {
                  id: item.id,
                  name: item.name
                }
              }
            });
          });
        }

        dfd.resolve(dropdownData);
        dropdownData = [];
      });

      return dfd.promise();
    };
  };

  var _bindRemoveEvent = function (wrapper) {

    $(document).one('click', function () {
      wrapper.el.unbind();
      popup('remove');
      preventRender = true;
    });

    $(wrapper.el).on('click', function (event) {
      event.stopPropagation();
    });

  };

  Module.add(MODULE, {
    init: init,
    remoteDataSource: {
      method: remoteDataSource,
      override: true
    }
  });
});
