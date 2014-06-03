define([
  'jquery',
  'global/global__modules',
  'global/global__utils',
  'global/global__views',
  'delayed-listener/delayed-listener',
  'action-list/action-list',
  'shortcuts/shortcuts'
], function ($, Module, utils, View) {
  'use strict';

  var MODULE = 'dropdown-select',
    LOADING_CLASS = 'ring-input_loading',
    SELECT_ARROW_CLASS = 'ring-input_icon__span',
    RESULT_COUNT = 10;

  var popup = Module.get('popup'),
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
    var actionListInstance;

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

      actionListInstance = actionList('init', {
        target: $target,
        type: type,
        description: config.description || '',
        limitWidth: config.limitWidth,
        items: data
      });

      actionListInstance.setActiveItem(0);

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
        $target.removeClass(LOADING_CLASS);
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
        initActionList(data);

      }, function (error) {
        $target.removeClass(LOADING_CLASS);
        if (config.noErrors) {
          remove();
          return;
        }

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
      },
      'tab': function (e) {
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
      .on('click', function (e) {
        $target.select();
        e.preventDefault();
      })
      .on('blur', function () {
        open = false;
        dirty = false;
      })
      .on('focus', function () {
        $target.addClass(LOADING_CLASS);
        shortcuts('pushScope', MODULE);
      });

    if ($target.next().hasClass(SELECT_ARROW_CLASS)) {
      $target.next()
        .on('click', function () {
          $target.focus();
        });
    }

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

      restUrl = restUrl + '&$top=' + ($top || RESULT_COUNT);

      auth('get', restUrl).then(function (data, state, jqXHR) {
        var items = [];
        if (data[remoteDataSourceConfig.hubResource]) {
          items = data[remoteDataSourceConfig.hubResource].map(function (val) {
            return {
              label: val.name
            };
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

  var MODULE_SHORTCUTS = 'dropdown-select';
  var CONTAINER_CLASS = 'ring-dropdown-select__container';

  var Select = function (config) {
    if (!(this instanceof Select)) {
      return new Select(config);
    }
    var self = this;

    this.$target = $(config.target);
    this.top = config.top || config.$top || RESULT_COUNT;
    this.skip_ = 0;
    this.description = config.description;
    this.dataSource = config.dataSource;
    this.onShow = config.onShow || $.noop;
    this.onHide = config.onHide || $.noop;
    this.onSelect = config.onSelect || $.noop;

    this.shortcutsUID_ = MODULE_SHORTCUTS + uid++;
    this.isDirty_ = false;
    this.$wrapper_ = popup('init', {
      target: self.$target,
      type: [
        'bound'
      ]
    });
    this.$container_ = null;
    this.itemsCount_ = this.top;
    this.currentQuery_ = '';
    this.$body_ = $('body');

    this.$target.
      on('click', function (e) {
        e.preventDefault();
        self.$target.select();
      }).
      on('focus', function () {
        self.$target.addClass(LOADING_CLASS);
        shortcuts('pushScope', self.shortcutsUID_);
      }).
      on('blur', function () {
        shortcuts('spliceScope', this.shortcutsUID_);
      }).
      on('input', function () {
        self.isDirty_ = true;
      }).
      on('keyup', function (e) {
        if (e.keyCode === 13) {
          var activeItem = self.getActiveItem();

          if (!activeItem) {
            self.onSelect(self.$target.val() || self.$target.text());
            self.destroy();
            return false;
          }

          self.$target.val(activeItem.label);
          self.isDirty_ = true;
          self.onSelect(activeItem);

          self.destroy();
        }
      });

    shortcuts('bindList', {
      scope: self.shortcutsUID_
    }, {
      'esc': function (e) {
        self.destroy();
        e.preventDefault();
      },
      'tab': function (e) {
        e.preventDefault();
      }
    });

    delayedListener('init', {
      target: self.$target,
      onDelayedChange: function (data) {
        self.configureRequest(data.value);
      },
      onDelayedCaretMove: function (data) {
        self.configureRequest(data.value);
      }
    });

  };

  Select.prototype.configureRequest = function (query) {
    if (!this.isDirty_) {
      query = '';
      this.isDirty_ = true;
    }

    this.$target.removeClass(LOADING_CLASS);
    this.requestData(query, this.top, this.skip_);

  };

  Select.prototype.requestData = function (query, top, skip) {
    var that = this;
    this.currentQuery_ = query;
    this.dataSource(query, top, skip).then(function (data) {
      that.renderComponent(data);
    }, function (error) {
      that.renderComponent(error);
    });
  };

  Select.prototype.renderComponent = function (data) {
    if (data.length === 0) {
      this.destroy();
      return false;
    }
    if (!$.contains(this.$body_[0], this.$wrapper_.el[0])) {
      this.$body_.append(this.$wrapper_.el);
    }

    $(document).on('click', $.proxy(this, 'destroy'));

    if (!this.$container_) {
      this.$container_ = $('<div class="' + CONTAINER_CLASS + '"></div>');
      this.$container_.
        on('click', $.proxy(this, 'clickHandler')).
        on('scroll', utils.throttle($.proxy(this, 'scrollHandler')));

      this.$wrapper_.appendHTML(this.$container_);

      if (this.description) {
        var $description = $(View.render('dropdown__description', {
          description: this.description
        }));
        this.$container_.after($description);

      }
    }

    this.$container_.empty();

    var $el = this.createActionList(data);
    $el.on('mouseover', this.hoverHandler);
    this.$container_.append($el);
  };

  Select.prototype.scrollHandler = function (e) {
    if ((this.$container_.get(0).scrollHeight - this.$container_.height()) - $(e.currentTarget).scrollTop() < 50) {
      this.itemsCount_ += this.top;
      this.requestData(this.currentQuery_, this.itemsCount_, this.skip_);
    }
  };


  Select.prototype.clickHandler = function (e) {
    e.stopPropagation();

    var data = $(e.target).data('ring-event');

    if (data && data[0].data) {
      this.onSelect(data[0].data);
      this.$target.val(data[0].data.label);
      this.$target.focus();
    }

    this.destroy();

  };

  Select.prototype.createActionList = function (data) {
    return actionList('init', {
//      overrideNavigation: true,
      limitWidth: this.limitWidth,
      items: data
    });
  };

  Select.prototype.hoverHandler = function () {
    $(this).siblings().each(function () {
      $(this).removeClass('active');
    });

    $(this).addClass('active');
  };

  Select.prototype.getActiveItem = function () {
    if (!this.$container_) {
      return false;
    }

    var itemData = this.$container_.
      find('.active').
      data('ring-event');

    if (itemData && itemData.length && itemData[0] && itemData[0].data) {
      return itemData[0].data;
    }
  };

  Select.prototype.destroy = function () {
    if (this.$wrapper_) {
      this.$wrapper_.el.detach();
    }

    $(document).off('click', this.destroy);

  };

  Module.add(MODULE, {
    init: {
      method: init,
      override: true
    },
    remoteDataSource: {
      method: remoteDataSource,
      override: true
    },
    init2: {
      method: Select,
      override: true
    },
    remoteDataSource2: {
      method: remoteDataSource,
      override: true
    }
  });
});