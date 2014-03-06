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

  var MODULE = 'dropdown-select',
    RESULT_COUNT = 10;

  var
    actionList = Module.get('action-list'),
    delayedListener = Module.get('delayed-listener'),
    uid = 0;

//  config = {
//    target: DOM,
//    onChange: function(data),
//    onListShow: function()
//    onListHide: function()
//    dataSource: {return promise with action-list compatible data},
//  }
  var init = function (config) {
    uid += 1;
    var select = Module.get(MODULE);
    var instance = {
      uid: uid,
      remove: remove
    };

    if (!config && (!config.target || !config.dataSource)) {
      utils.log('select: init params missing');
      select.trigger('init:fail');
      return false;
    }


    var _renderSuggest = function (query) {
      config.dataSource(query).then(function (data) {
        if (data.length) {


          var actionList = actionList('init', {
            target: $(config.target),
            type: ['bound'],
            width: 'auto',
            items: data
          });

          actionList.on('change_' + actionList('getUID'), function (data) {
            if (typeof config.change === 'function') {
              config.change(data);
            }
          });
        }
      });
    };

    delayedListener('init', {
      target: $(config.target),
      onDelayedChange: function (data) {
        if ($(config.target).is(':focus')) {
          _renderSuggest(data.value);
        }
      },
      onDelayedCaretMove: function (data) {
        if ($(config.target).is(':focus')) {
          _renderSuggest(data.value);
        }
      }
    });

    select.trigger('init:done', {});
    return instance;
  };

  var remoteDataSource = function (remoteDataSourceConfig) {
    var select = Module.get(MODULE);
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
              action: true,
              label: val.name
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
    var select = Module.get(MODULE);
    var $el = this.$el;
    if ($el) {
      $el.remove();
      $el = null;
      actionList('remove');
      select.trigger('remove:done');
    }
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
});