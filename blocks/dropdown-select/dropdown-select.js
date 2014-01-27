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

  var MODULE = 'dropdown-select';
  var SEARCH_FIELD = '.ring-js-dropdown-input';

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

      $(document).on('keyup', SEARCH_FIELD, function (e) {
        var query = $(e.currentTarget).val();
        dataSource(query).then(function (items) {
          console.log(items);
        });
        /**
         * @ToDo trigger query change event
         * @ToDo fix memory leak
         */
      });

      e.stopPropagation();
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

  var updateQuery = function (query) {
    if (query && query.length) {
      /**
       * @ToDo dataSource exec
       */
      console.log(query);
    }
  };

  var remoteDataSource = function (config) {
    var auth = Module.get('auth'),
      dropdownData = [];

    return function (query) {
      var dfd = $.Deferred(),
        restUrl = config.restUrl || 'api/rest/usergroups?fields=id,name,iconUrl,total&skip=100' + (query ? '&query=name:' + query + ' or ' + query + '*': '');

      console.log(restUrl);

      auth('get', restUrl).then(function (data) {
        if (data.total) {
          data.usergroups.forEach(function (group) {
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
        }
      });

      return dfd.promise();
    };
  };

  dropdown.on('complete', function (e) {
    console.log(e);
    return;
  });

  dropdown.on('toggle', function (e) {
    console.log(arguments, e);
    return false;
  });

  dropdown.on('keypress', function () {
    updateQuery($(SEARCH_FIELD).val());
    return false;
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
