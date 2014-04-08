define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'shortcuts/shortcuts',
  'action-list/action-list',
  'delayed-listener/delayed-listener'
], function ($, View, Module, events) {
  'use strict';

  var RESULT_COUNT = 5,
    ACTION_CONTAINER = 'ring-dropdown-filter__container',
    SCROLL__WRAPPER = 'ring-dropdown__scroll',
    SCROLL__WRAPPER_SELECTOR = '.' + SCROLL__WRAPPER,
    ACTION_CONTAINER_SELECTOR = '.' + ACTION_CONTAINER,
    POPUP_INPUT_SELECTOR = '.ring-js-popup-input',
    DROPDOWN_ITEM_SELECTOR = '.ring-dropdown__item',
    DROPDOWN_ITEM_CONTROLS_SELECTOR = DROPDOWN_ITEM_SELECTOR + '__controls',
    ACTIVE_CLASS = 'active';

  var popup = Module.get('popup'),
    MODULE = 'dropdown-filter',
    preventRender = false;

  var init = function (config) {
    var $target,
      wrapper;

    if (!config || !config.target || !config.actions) {
      return false;
    }

    $target = $(config.target);
    preventRender = false;

    var showDropdown = function () {
      var $actions = [];
      preventRender = false;

      wrapper = popup('init', config);
      wrapper.showLoader();

      var renders = config.actions.map(function (obj, index, arr) {
        return _render(obj, index, arr).done(function ($el) {
          _bindToggleEvent(wrapper, $el);
          $actions[index] = $el;
        });
      });

      $.when.apply($, renders).done(function () {
        wrapper.appendHTML($actions);
        _bindRemoveEvent(wrapper);
        wrapper.el.
          find(POPUP_INPUT_SELECTOR).
          eq(0).
          focus();
      });
    };

    var renderItems = function (data, action, $el) {
      var actionList = Module.get('action-list');

      var $items = $('<div class="' + SCROLL__WRAPPER + '"></div>').append(actionList('init', {
        focusTarget: $el,
        items: data
      }));

      $items.on('mouseenter', DROPDOWN_ITEM_SELECTOR, function (e) {
        events.domEventHandler(e);

        $(e.currentTarget)
          .addClass(ACTIVE_CLASS)
          .siblings()
          .removeClass(ACTIVE_CLASS);
      });

      actionList.on('change_' + actionList('getUID'), function (data) {
        if (action.change && typeof action.change === 'function') {
          action.change(data);
        }
      });

      $items.scroll(function (e) {
        e.stopPropagation();
      });

      return $items;
    };
    var _render = function (action, index, arr) {
      var $title = $(View.render('popup-control', {
          title: action.title,
          type: action.type,
          input: true
        })),
        dfd = $.Deferred(),
        $el,
        $top,
        renderElements = [];

      if (action.$top && !isNaN(action.$top)) {
        $top = action.$top;
      }

      renderElements.push($title);

      action.dataSource('', $top).then(function (data) {
        if (preventRender) {
          return false;
        }
        var $items = renderItems(data, action, $title.find(POPUP_INPUT_SELECTOR));
        renderElements.push($items);
        if ((index + 1) < arr.length) {
          var $separator = $(View.render('dropdown__separator', null));
          renderElements.push($separator);
        }


        $el = $('<div class="' + ACTION_CONTAINER + ' ' + ((index === 0) ? 'active' : '') + '"></div>').append(renderElements);
        dfd.resolve($el);
        _bindDelayedListener($title.find(POPUP_INPUT_SELECTOR), action, $el);
      });

      return dfd.promise();
    };

    var _bindDelayedListener = function ($el, action, $container) {
      var delayedListener = Module.get('delayed-listener');
      if ($el) {
        delayedListener('init', {
          target: $el,
          onDelayedChange: function (data) {
            action.dataSource(data.value, (action.$top || RESULT_COUNT)).then(function (data) {
              var $items = renderItems(data, action, $el);

              $container.find(SCROLL__WRAPPER_SELECTOR).remove();
              $container.find(DROPDOWN_ITEM_CONTROLS_SELECTOR).after($items);
            });
          }
        });
      }
    };

    if (config.autoOpen) {
      showDropdown();
    } else {
      $target
        .on('click', function (e) {
          showDropdown();
          e.stopPropagation();
        }
      );
    }

    return true;
  };

  var _bindToggleEvent = function (wrapper, $el) {
    $el.on('click', function () {
      wrapper.el.find(ACTION_CONTAINER_SELECTOR).removeClass('active');
      $(this).addClass('active').find(POPUP_INPUT_SELECTOR).focus();
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
      ('&$top=' + (($top || RESULT_COUNT) + 1) +
        (query ? '&query=name:' + query + ' or ' + query + '*' : ''));

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
//              action: false,
              event: {
                data: {
                  id: item.id,
                  name: item.name
                }
              }
            });
          });
        }

        if (dropdownData.length >= ($top || RESULT_COUNT)) {
          dropdownData.splice(items.length - 1, dropdownData.length);
          dropdownData.push({
            event: false,
            label: '...'
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

    $(wrapper.el).on('click', function (e) {
      if (!$(e.target).hasClass('ring-js-event') || $(e.target).is(':input')) {
        event.stopPropagation();
      }
    });

  };

  Module.add(MODULE, {
    init: {
      method: init,
      override: true
    },
    remoteDataSource: {
      method: remoteDataSource,
      override: true
    }
  });
})
;
