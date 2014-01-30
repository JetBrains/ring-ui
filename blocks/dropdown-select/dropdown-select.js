define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils',
  'dropdown/dropdown',
  'shortcuts/shortcuts'
], function ($, View, Module, events, utils) {
  'use strict';

  var $target,
    dataSource,
    resourceTop;

  var dropdown = Module.get('dropdown');
//  var state = 'add';

  var MODULE = 'dropdown-select';
  var DROPDOWN__SELECTOR = '.ring-dropdown';
  var ITEMS_CONTAINER__SELECTOR = '.ring-dropdown__items';
  var SEARCH_FIELD__SELECTOR = '.ring-js-dropdown-input';
  var THROTTLE_INTERVAL = 250;
  var INFINITE_SCROLL_TOP = 20;

  var init = function (config) {
    if (!config || !config.targetElem || !config.dataSource) {
      utils.log('dropdown-select init params missing');
      return false;
    }

    dataSource = config.dataSource;
    $target = $(config.targetElem);
    resourceTop = INFINITE_SCROLL_TOP;


    $target.on('click', function (e) {
      e.stopPropagation();

      dataSource(null, resourceTop).then(function (items) {
        renderDropdown($target, items);
        loadMoreEventBind();
      });

      $(document).on('keyup', SEARCH_FIELD__SELECTOR, utils.throttle(function (e) {
        var query = $(e.currentTarget).val();
        renderItems(query, resourceTop);
      }, THROTTLE_INTERVAL));
    });
  };

  var renderDropdown = function ($target, items) {
    if (!$target.length || !items.length) {
      utils.log('dropdown-select renderDropdown params missing');
      return false;
    }

    dropdown('hide');
    return dropdown('show', {
      'type': 'prop-manager',
      'items': items
    }, {
      preventRemove: true,
      target: $target
    });
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

  var remoteDataSource = function () {
    var auth = Module.get('auth'),
      dropdownData = [];

    return function (query, resourceTop) {
      var dfd = $.Deferred(),
        /**
         * @todo top replacement
         */
          restUrl = ('api/rest/usergroups?fields=id,name,iconUrl,total&$top=' + resourceTop ) + (query ? '&query=name:' + query + ' or ' + query + '*' : '');

      auth('get', restUrl).then(function (data) {
        var groups;

        if (data.groups) {
          groups = data.groups;
        } else if (data.total && data.usergroups) {
          groups = data.usergroups;
        } else {
          dfd.resolve([
            {
              'action': true,
              'label': 'No results'
            }
          ]);
        }

        groups.forEach(function (group) {
          dropdownData.push({
            'label': group.name,
            'url': group.url,
            'event': {
              'name': 'dropdown:complete'
            }
          });
        });

        dfd.resolve(dropdownData);
        dropdownData = [];
      });

      return dfd.promise();
    };
  };

  dropdown.on('complete', function (e) {
    console.log(e);
    return;
  });

  dropdown.on('toggle', function () {
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
})
;
