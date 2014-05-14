define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'delayed-listener/delayed-listener',
  'action-list/action-list',
  'shortcuts/shortcuts'
], function ($, View, Module) {
  'use strict';

  var MODULE = 'dropdown-select',
    LOADING_CLASS = 'ring-input_loading',
    RESULT_COUNT = 10;

  var
    actionList = Module.get('action-list'),
    shortcuts = Module.get('shortcuts'),
    delayedListener = Module.get('delayed-listener'),
    uid = 0;

//  config = {
//    target: DOM,
//    type: string
//    $top: number
//    onChange: function(data),
//    onSelect: function(data),
//    onSubmit: function(data),
//    onShow: function()
//    onHide: function()
//    dataSource: {return promise with action-list compatible data},
//  }
  var init = function (config) {
    uid += 1;
    var dirty = false;
    var open = false;
    var select = Module.get(MODULE);
    var $top;
    var $target;
    var instance = {
      uid: uid,
      remove: remove
    };

    if (!config && (!config.target || !config.dataSource)) {
      select.trigger('init:fail');
      return false;
    }

    $target = $(config.target);

    if (config.$top && !isNaN(config.$top)) {
      $top = config.$top;
    }

    ring().on('dialog:hide', function () {
      remove();
    });

    actionList.on('show', function (data) {
      if (typeof config.onShow === 'function' && data) {
        config.onShow(data);
      }
    });

    actionList.on('hide', function (data) {
      if (typeof config.onHide === 'function' && data) {
        config.onHide(data);
      }
    });

    var initActionList = function (data, preventEvent) {
      var type = ['bound'];
      if (config.type) {
        type = type.concat(config.type);
      }

      actionList('init', {
        target: $target,
        type: type,
        description: config.description || '',
        limitWidth: config.limitWidth,
        items: data
      });

      if (!preventEvent) {
        actionList.on('change_' + actionList('getUID'), function (data) {
          if (typeof config.onSelect === 'function') {
            config.onSelect(data);
          }
        });
      }
    };

    var _renderSuggest = function (query) {
      $target.addClass(LOADING_CLASS);
      config.dataSource(query, $top).then(function (data) {
        if (!data.length) {
          if (config.noErrors) {
            remove();
            return;
          }

          var emptyItem = {
            action: false,
            error: true,
            label: 'No results'
          };

          if (config.type === 'typed') {
            emptyItem.type = 'error';
          }

          data = [emptyItem];
        }

        $target.removeClass(LOADING_CLASS);
        initActionList(data);

      }, function (error) {
        if (config.noErrors) {
          remove();
          return;
        }

        $target.removeClass(LOADING_CLASS);

        var emptyItem = {
          action: false,
          error: true,
          label: (error || 'Can\'t load options')
        };

        if (config.type === 'typed') {
          emptyItem.type = 'error';
        }

        initActionList([emptyItem], true);
      });
    };

    shortcuts('bindList', {
      scope: MODULE
    }, {
      'esc': function (e) {
        remove();
        e.preventDefault();
      }
    });

    $target
      .on('input', function () {
        dirty = true;
      })
      .on('keyup', function (e) {
        if (e.keyCode === 13) {
          var value = ($(this).val() || $(this).text());

          if (!dirty) {
            dirty = true;
            _renderSuggest(value);
          } else if (typeof config.onSubmit === 'function') {
            remove();
            config.onSubmit(value);
          }
        }
      })
      .on('blur', function () {
        open = false;
        dirty = false;
      })
      .on('focus', function() {
        shortcuts('pushScope', MODULE);
      });

    var renderProccess = function (data) {
      open = true;

      if (dirty) {
        _renderSuggest(data.value);
      } else {
        _renderSuggest('');
        $target.select();
      }
    };
    delayedListener('init', {
      target: $target,
      onDelayedChange: function (data) {
        if ($target.is(':focus')) {
          if (typeof config.onChange === 'function') {
            config.onChange(data.value);
          }
          renderProccess(data);
        }
      },
      onDelayedCaretMove: function (data) {
        if (open !== true && $target.is(':focus')) {
          renderProccess(data);
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
      select.trigger('init:fail');
      return false;
    }

    return function (query, $top) {
      var defer = $.Deferred(),
        restUrl = remoteDataSourceConfig.url,
        substr = ['query', '$top'],
        suggestArgs = [encodeURI(query)];

      substr.forEach(function (item, index) {
        restUrl = restUrl.replace('#{' + item  + '}', suggestArgs[index] ? suggestArgs[index] : '');
      });

      restUrl = restUrl + '&$top=' + (($top || RESULT_COUNT) + 1);

      auth('get', restUrl).then(function (data, state, jqXHR) {
        var items = [];
        if (data[remoteDataSourceConfig.hubResource]) {
          items = data[remoteDataSourceConfig.hubResource].map(function (val) {
            return {
              label: val.name
            };
          });
        }

        if (items.length >= $top) {
          items.splice(items.length - 1, items.length);
          items.push({
            event: false,
            label: '...'
          });
        }

        defer.resolve(items, state, jqXHR);
      }, function () {
        defer.reject(arguments[2]);
      });

      return defer.promise();
    };
  };

  var remove = function () {
    var select = Module.get(MODULE);
    actionList('remove');
    shortcuts('popScope', MODULE);
    select.trigger('remove:done');
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