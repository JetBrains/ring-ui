define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils',
  'dropdown/dropdown',
  'shortcuts/shortcuts',
  'popup/popup',
  'delayed-listener/delayed-listener'
], function ($, View, Module, events, utils) {
  'use strict';

  var DROPDOWN__SELECTOR = '.ring-dropdown',
    ITEMS_CONTAINER__SELECTOR = '.ring-dropdown__items',
    SEARCH_FIELD__SELECTOR = '.ring-js-dropdown-input',
    THROTTLE_INTERVAL = 250,
    INFINITE_SCROLL_TOP = 20;

  var dropdown = Module.get('dropdown'),
    popup = Module.get('popup'),
    MODULE = 'dropdown-select';

  var $target,
    dataSource,
    resourceTop = INFINITE_SCROLL_TOP,
    Config,
    wrapper,
    state = 'add';


  var init = function (config) {
    if (!config || !config.target || !config.dataSource) {
      utils.log('dropdown-select init params missing');
      return false;
    }

    dataSource = config.dataSource;
    $target = $(config.target);

    $target.on('click', function (e) {
      wrapper = popup('init', config);
      _bindRemoveEvent(wrapper);

      dataSource(null, resourceTop).then(function (items) {
        renderDropdown(wrapper, $target, items);
        loadMoreEventBind();
      });

      $(document).on('keyup', SEARCH_FIELD__SELECTOR, utils.throttle(function (e) {
        var query = $(e.currentTarget).val();
        renderItems(query, resourceTop);
      }, THROTTLE_INTERVAL));

      e.stopPropagation();
    });
  };

  var renderDropdown = function (wrapper, $target, items) {
    if (!$target.length || !items.length) {
      utils.log('dropdown-select renderDropdown params missing');
      return false;
    }

//    var actionList = Module.get(MODULE);
    var title = $(View.render('popup-control', {title: ''}));

    wrapper.appendHTML(title);

//    dropdown('hide');
//    return dropdown('show', {
//      'type': 'dropdown-select',
//      'header-title': 'Add to',
//      'footer-title': 'Remove from',
//      'items': items
//    }, {
//      preventRemove: true,
//      target: $target
//    });
  };

  var renderItems = function (query, top) {
    dataSource(query, top).then(function (items) {
      var $items = $(View.render('dropdown__items', {
        'items': items
      }));
      /**
       * @todo refactor
       */
      $(DROPDOWN__SELECTOR).find(ITEMS_CONTAINER__SELECTOR).html($items);
    });
  };

  var loadMoreEventBind = function () {
    $(ITEMS_CONTAINER__SELECTOR).on('scroll', utils.throttle(function () {
      loadMoreItems(this);
    }, THROTTLE_INTERVAL));
  };

  var loadMoreItems = function (context) {
    if ($(context).outerHeight() + $(context).scrollTop() === $(context).prop('scrollHeight')) {
      resourceTop = resourceTop + INFINITE_SCROLL_TOP;
      renderItems(null, resourceTop);
      loadMoreEventBind();
    }
  };

  var configureUrl = function (config, query, resourceTop) {
    var auth = Module.get('auth'),
      url;

    if (state === 'add') {
      url = config.add.url +
        (resourceTop ? '&$top=' + resourceTop : '' ) +
        (query ? '&query=name:' + query + ' or ' + query + '*' : '');
    } else if (state === 'remove') {
      auth('getUser').then(function (user) {
        url = config.remove.url.replace('#{userId}', user.id);
      });
    }

    return url;
  };

  var remoteDataSource = function (config) {
    var auth = Module.get('auth'),
      dropdownData = [];
    Config = config;

    return function (query, resourceTop) {
      var dfd = $.Deferred(),
        restUrl = configureUrl(config, query, resourceTop);

      auth('get', restUrl).then(function (data) {
        var groups;

        if (data.groups) {
          groups = data.groups;
        } else if (data.total && data.usergroups) {
          groups = data.usergroups;
        } else {
          dfd.resolve([
            {
              action: true,
              label: 'No results'
            }
          ]);
        }

        groups.forEach(function (group) {
          dropdownData.push({
            label: group.name,
            url: group.url,
            event: {
              name: 'dropdown:select',
              data: {
                id: group.id
              }
            }
          });
        });

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
    });

    $(wrapper.el).one('click', function (event) {
      event.stopPropagation();
    });

  };

  dropdown.on('select', function (data) {
    Config[state].callback.call(this, data);
    dropdown('hide');
  });

  dropdown.on('toggle', function () {
    console.log(arguments);
    /**
     * @ToDo Toggle func exec
     */
  });

  dropdown.on('hide:done', function () {
    $(ITEMS_CONTAINER__SELECTOR).unbind();
  });

  Module.add(MODULE, {
    init: init,
    remoteDataSource: {
      method: remoteDataSource,
      override: true
    }
  });
});
