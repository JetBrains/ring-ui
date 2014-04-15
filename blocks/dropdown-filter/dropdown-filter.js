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
    ITEM_ACTION_SELECTOR = DROPDOWN_ITEM_SELECTOR + '_action',
    DROPDOWN_ITEM_CONTROLS_SELECTOR = DROPDOWN_ITEM_SELECTOR + '__controls',
    ACTIVE_CLASS = 'active',
    ACTIVE_SELECTOR = '.' + ACTIVE_CLASS;

  var popup = Module.get('popup'),
    shortcuts = Module.get('shortcuts'),
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

        shortcuts('pushScope', MODULE);
      });
    };

    var renderItems = function (data, action) {
      var actionList = Module.get('action-list');

      var $items = $('<div class="' + SCROLL__WRAPPER + '"></div>').append(actionList('init', {
        overrideNavigation: true,
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

              $container.
                find(SCROLL__WRAPPER_SELECTOR).
                remove();
              $container.
                find(DROPDOWN_ITEM_CONTROLS_SELECTOR).
                after($items);
            });
          }
        });
        $el.focus();
      }
    };

    var navigate_ = function (e, key) {
      var $el = wrapper.el.find(ACTION_CONTAINER_SELECTOR + ACTIVE_SELECTOR + ' ' + SCROLL__WRAPPER_SELECTOR).children();

      if ($el === null) {
        return false;
      }
      var up = (key === 'up'),
        $active = $el.parent().find(ITEM_ACTION_SELECTOR + ACTIVE_SELECTOR),
        $next = $active[up ? 'prev' : 'next'](ITEM_ACTION_SELECTOR);
      $active.removeClass(ACTIVE_CLASS);


      if ($next.length) {
        $next.addClass(ACTIVE_CLASS);
      } else {
        $el.parent().find(ITEM_ACTION_SELECTOR)[up ? 'last' : 'first']().addClass(ACTIVE_CLASS);
      }
      e.preventDefault();
    };

    shortcuts('bindList', {
      scope: MODULE
    }, {
      'esc': function (e) {
        remove(wrapper);
        e.preventDefault();
      },
      'tab': function (e) {
        var $active = wrapper.el.find(ACTION_CONTAINER_SELECTOR + ACTIVE_SELECTOR),
          $next = $active['next'](ACTION_CONTAINER_SELECTOR);

        $active.removeClass(ACTIVE_CLASS);

        if ($next.length) {
          $next.
            addClass(ACTIVE_CLASS).
            find(POPUP_INPUT_SELECTOR).
            focus();
        } else {
          wrapper.el.find(ACTION_CONTAINER_SELECTOR)['first']().
            addClass(ACTIVE_CLASS).
            find(POPUP_INPUT_SELECTOR).
            focus();
        }
        e.preventDefault();
      },
      'up': navigate_,
      'down': navigate_,
      'enter': function () {
        var container = wrapper.el.find(ACTION_CONTAINER_SELECTOR + ACTIVE_SELECTOR),
          index = container.index();
        var $el = container.find(SCROLL__WRAPPER_SELECTOR).children();

        var $active = $el.parent().find(ACTIVE_SELECTOR);

        if ($active.length) {
          var data = $active.data(events.EVENT_DATA_ATTR);
          
          if (config.actions[index] &&
            config.actions[index].change
            ) {
            config.actions[index].change(data[0].data);
          }

          return false;
        } else {
          return true;
        }

      }
    });

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

  var remove = function (wrapper) {
    shortcuts('popScope', MODULE);
    wrapper.el.unbind();
    popup('remove');
    preventRender = true;
  };

  var _bindRemoveEvent = function (wrapper) {
    $(document).one('click', function () {
      remove(wrapper);
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
