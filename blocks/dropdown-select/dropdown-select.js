define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__events',
  'global/global__utils',
  'delayed-listener/delayed-listener',
  'action-list/action-list'
], function ($, View, Module, events, utils) {
  'use strict';

  var $el,
    actionList = Module.get('action-list'),
    delayedListener = Module.get('delayed-listener'),
    select,
    dataSource,
    Config,
    uid = 0;

  var MODULE = 'dropdown-select',
    RESULT_COUNT = 10;

//  config = {
//    target:DOM,
//    dataSource: {return promise with action-list compatible data},
//  }
  var init = function (config) {
    select = Module.get(MODULE);
    Config = config;

    if (!Config && (!Config.target || !Config.dataSource)) {
      utils.log('select: init params missing');
      select.trigger('init:fail');
      return false;
    }

    dataSource = Config.dataSource;

    uid += 1;

    $(Config.target).
      one('focus', function () {
        delayedListener('init', {
          target: $(Config.target),
          onDelayedChange: function (data) {
            _renderSuggest(data.value);
          },
          onDelayedCaretMove: function (data) {
            _renderSuggest(data.value);
          }
        });
        $(Config.target).focus();
      }).
      on('blur', function () {
        delayedListener('remove');
      });

    select.trigger('init:done', {});
    return $el;
  };

  var remoteDataSource = function (remoteDataSourceConfig) {
    var auth = Module.get('auth');

    if (!remoteDataSourceConfig && (!remoteDataSourceConfig.hubResource || !remoteDataSourceConfig.url)) {
      utils.log('Select: remoteDataSource params missing');
      select.trigger('init:fail');
      return false;
    }

    return function (query) {
      var defer = $.Deferred(),
        restUrl = remoteDataSourceConfig.url,
        substr = ['query', '$top'],
        suggestArgs = [encodeURI(query)];

      substr.forEach(function (item, index) {
        restUrl = restUrl.replace('#{' + item  + '}', suggestArgs[index] ? suggestArgs[index] : '');
      });

      restUrl = restUrl + '&$top=' + RESULT_COUNT;

      auth('get', restUrl).then(function (data, state, jqXHR) {
        var items = [];
        if (data[remoteDataSourceConfig.hubResource]) {
          items = data[remoteDataSourceConfig.hubResource].map(function (val) {
            return {
              'action': true,
              'label': val.name
            };
          });
        }
        defer.resolve(items, state, jqXHR);
      }).fail(function () {
        defer.reject.apply(defer, arguments);
      });
      return defer.promise();
    };
  };

  var remove = function () {
    if ($el) {
      $el.remove();
      $el = null;
      actionList('remove');
      select.trigger('remove:done');
    }
  };

  var _renderSuggest = function (query) {
    dataSource(query).then(function (data) {
      if (data.length) {
        actionList('init', {
          target: $(Config.target),
          type: ['bound'],
          width: 'auto',
          items: data
        });
      }
    });
  };

  Module.add(MODULE, {
    init: {
      method: init,
      override: true
    },
    remove: {
      method: remove,
      override: true
    },
    remoteDataSource: {
      method: remoteDataSource,
      override: true
    },
    trigger: {
      method: Module.triggerInstance.bind(null, MODULE, uid),
      override: true
    },
    on: {
      method: Module.onInstance.bind(null, MODULE, uid),
      override: true
    }
  });
});