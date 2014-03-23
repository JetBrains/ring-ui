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
    ACTION_CONTAINER = 'ring-dropdown-filter__container',
    ACTION_CONTAINER_SELECTOR = '.' + ACTION_CONTAINER,
    POPUP_INPUT_SELECTOR = '.ring-js-popup-input',
    DROPDOWN_ITEM_SELECTOR = '.ring-dropdown__item',
    DROPDOWN_ITEM_CONTROLS_SELECTOR = DROPDOWN_ITEM_SELECTOR + '__controls';

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
        var $actions = [];
        preventRender = false;

        wrapper = popup('init', config);

        _bindRemoveEvent(wrapper);

        config.actions.forEach(function (obj, index, arr) {
          _render(obj, index, arr).done(function ($el) {
            _bindToggleEvent(wrapper, $el);
            $actions.push($el);
            if ((index + 1) === arr.length) {
              wrapper.appendHTML($actions);
            }
          });
        });
        e.stopPropagation();
      }
    );

    var _render = function (action, index, arr) {
      var title = $(View.render('popup-control', {
          title: action.title,
          type: action.type,
          input: true
        })),
        dfd = $.Deferred(),
        $el,
        $top;

      if (action.$top && !isNaN(action.$top)) {
        $top = action.$top;
      }

      action.dataSource('', $top).done(function (data) {
        if (preventRender) {
          return false;
        }
        var actionList = Module.get('action-list');

        if ((index + 1) < arr.length) {
          data.push({
            separator: true
          });
        }
        var items = actionList('init', {
          items: data
        });

        actionList.on('change_'+ actionList('getUID'), function(data) {
          if(action.change && typeof action.change === 'function') {
            action.change(data);
          }
        });

        $el = $('<div class="' + ACTION_CONTAINER + ' ' + ((index === 0) ? 'active' : '') + '"></div>').append([title, items]);
        dfd.resolve($el);
        _bindDelayedListener(title.find(POPUP_INPUT_SELECTOR), action, $el);
      });

      return dfd.promise();
    };

    var _bindDelayedListener = function ($el, action, $container) {
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
              actionList.on('change_'+ actionList('getUID'), function(data) {
                if(action.change && typeof action.change === 'function') {
                  action.change(data);
                }
              });
              $container.find(DROPDOWN_ITEM_SELECTOR).not(DROPDOWN_ITEM_CONTROLS_SELECTOR).remove();
              $container.find(DROPDOWN_ITEM_CONTROLS_SELECTOR).after(items);
            });
          }
        });
      }
    };
  };

  var _bindToggleEvent = function (wrapper, $el) {
    $el.on('click', function () {
      wrapper.el.find(ACTION_CONTAINER_SELECTOR).removeClass('active');
      $(this).addClass('active');
    });
  };

  var configureUrl = function (config, query, $top) {
    var url,
      auth = Module.get('auth');

    if (config.url.indexOf('#{userId}') !== -1) {
      auth('getUser').then(function (user) {
        config.url = config.url.replace('#{userId}', user.id);
      });
    }

    url = config.url +
      ('&$top=' + ($top || RESULT_COUNT)) +
      (query ? '&query=name:' + query + ' or ' + query + '*' : '');

    return url;
  };

  var remoteDataSource = function (config) {
    var auth = Module.get('auth'),
      dropdownData = [];

    return function (query, $top) {
      var dfd = $.Deferred(),
        restUrl = configureUrl(config, query, $top);

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
              label: item.name,
              action: false,
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


    $(document).on('click', function () {
      wrapper.el.unbind();
      popup('remove');
      preventRender = true;
    });

    $(wrapper.el).on('click', function (e) {
      if(!$(e.target).hasClass('ring-js-event') || $(e.target).is(':input')) {
        event.stopPropagation();
      }
    });

  };

  Module.add(MODULE, {
    init: init,
    remoteDataSource: {
      method: remoteDataSource,
      override: true
    }
  });
})
;
