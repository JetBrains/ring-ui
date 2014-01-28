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
    dataSource;

  var dropdown = Module.get('dropdown');
  var state = 'add';

  var MODULE = 'dropdown-select';
  var DROPDOWN__SELECTOR = '.ring-dropdown';
  var ITEMS_CONTAINER__SELECTOR = '.ring-dropdown__items';
  var SEARCH_FIELD__SELECTOR = '.ring-js-dropdown-input';

  var init = function (config) {
    if (!config || !config.targetElem || !config.dataSource) {
      utils.log('dropdown-select init params missing');
      return false;
    }

    dataSource = config.dataSource;

    $target = $(config.targetElem);

    $target.on('click', function (e) {
        /**
         * @ToDo add config configuraion func
         */
        dataSource().then(function (items) {
          renderDropdown($target, items);
        });

        $(document).on('keyup', SEARCH_FIELD__SELECTOR, function (e) {
          var query = $(e.currentTarget).val();

          dataSource(query).then(function (items) {
            var $items = $(View.render('dropdown__items', {
              'items': items
            }));

            /**
             * @ToDo Refactor with Dastky help
             */
            $(DROPDOWN__SELECTOR).find(ITEMS_CONTAINER__SELECTOR).html($items);
          });
          /**
           * @ToDo trigger query change event
           * @ToDo fix memory leak
           */
        });

        e.stopPropagation();
      }
    )
    ;
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

  var remoteDataSource = function (config) {
    var auth = Module.get('auth'),
      dropdownData = [];


    return function (query) {
      var dfd = $.Deferred(),
        /**
         * @todo correct get state url
         */
        restUrl = (config[state + 'Url'] || 'api/rest/usergroups?fields=id,name,iconUrl,total&$top=20') + (query ? '&query=name:' + query + ' or ' + query + '*' : '');

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

    console.log(arguments);
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
