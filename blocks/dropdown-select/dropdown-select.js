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

  var MODULE = 'dropdown-select';
  var LOADING_CLASS = 'ring-input_loading';
  var SELECT_ARROW_CLASS = 'ring-input_icon__span';
  var RESULT_COUNT = 10;
  var MODULE_SHORTCUTS = 'dropdown-select';
  var CONTAINER_CLASS = 'ring-dropdown-select__container';
  var ITEM_ACTION_SELECTOR = '.ring-dropdown__item_action';
  var ACTIVE_CLASS = 'active';

  var popup = Module.get('popup');
  var actionList = Module.get('action-list');
  var shortcuts = Module.get('shortcuts');
  var delayedListener = Module.get('delayed-listener');
  var uid = 0;


//  config = {
//    target: DOM,
//    type: string
//    $top: number
//    onSelect: function(data),
//    onShow: function()
//    onHide: function()
//    dataSource: {return promise with action-list compatible data},
//  }
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
    this.containerHeight = this.top * 24;
    this.top += 1;
    this.itemsCount_ = this.top;
    this.currentQuery_ = '';
    this.$body_ = $('body');
    this.activeItemIndex = 0;

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
      on('keyup', $.proxy(this, 'submitHandler'));

    this.$target.next('.' + SELECT_ARROW_CLASS).on('click', function () {
      self.$target.focus();
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
      },
      'up': $.proxy(this, 'navigate'),
      'down': $.proxy(this, 'navigate')
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
    if (!$.contains(this.$body_[0], this.$wrapper_.el[0])) {
      this.$body_.append(this.$wrapper_.el);
      this.onShow(true);
    }

    $(document).on('click', $.proxy(this, 'destroy'));

    if (!this.$container_) {
      this.$container_ = $('<div class="' + CONTAINER_CLASS + '"></div>').
        css('max-height', this.containerHeight).
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

    if (data.length === 0) {
      data = [
        {
          action: false,
          error: true,
          label: 'No results'
        }
      ];
      this.$container_.
        off('click').
        on('click', function (e) {
          e.stopPropagation();
          e.preventDefault();
        });
    }

    var actionListElem = this.createActionList(data);

    actionListElem.on('mouseover', this.hoverHandler);

    this.$container_.append(actionListElem);
    $(actionListElem).siblings().eq(this.activeItemIndex).addClass(ACTIVE_CLASS);
  };

  Select.prototype.scrollHandler = function (e) {
    var $activeItem = this.$container_.find(ITEM_ACTION_SELECTOR + '.' + ACTIVE_CLASS);

    this.activeItemIndex = $activeItem.index();

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

  Select.prototype.submitHandler = function (e) {
    if (e.keyCode === 13) {
      var activeItem = this.getActiveItem();

      if (!activeItem) {
        this.onSelect(this.$target.val() || this.$target.text());
        this.destroy();
        return false;
      }

      this.$target.val(activeItem.label);
      this.isDirty_ = true;
      this.onSelect(activeItem);

      this.destroy();
    }
  };

  Select.prototype.navigate = function (e, key) {
    if (this.$container_ === null) {
      return false;
    }
    var up = (key === 'up'),
      $active = this.$container_.parent().find(ITEM_ACTION_SELECTOR + '.' + ACTIVE_CLASS),
      $next = $active[up ? 'prev' : 'next'](ITEM_ACTION_SELECTOR);

    $active.removeClass(ACTIVE_CLASS);

    if ($next.length) {
      if (($next.position().top >= this.$container_.height()) || $next.position().top < 0) {
        this.$container_.scrollTo($next);
      }
      $next.addClass(ACTIVE_CLASS);
    } else {
      this.$container_.parent().find(ITEM_ACTION_SELECTOR)[up ? 'last' : 'first']().addClass(ACTIVE_CLASS);
    }

    e.preventDefault();
  };

  Select.prototype.createActionList = function (data) {
    return actionList('init', {
      overrideNavigation: true,
      limitWidth: this.limitWidth,
      items: data
    });
  };

  Select.prototype.hoverHandler = function () {
    $(this).siblings().each(function () {
      $(this).removeClass(ACTIVE_CLASS);
    });

    $(this).addClass(ACTIVE_CLASS);
  };

  Select.prototype.getActiveItem = function () {
    if (!this.$container_) {
      return false;
    }

    var itemData = this.$container_.
      find('.' + ACTIVE_CLASS).
      data('ring-event');

    if (itemData && itemData.length && itemData[0] && itemData[0].data) {
      return itemData[0].data;
    }
  };

  Select.prototype.destroy = function () {
    if (this.$wrapper_) {
      this.$wrapper_.el.detach();
      this.onHide();
    }

    $(document).off('click', this.destroy);

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
//
//  var remove = function () {
//    var select = Module.get(MODULE);
//    actionList('remove');
//    shortcuts('popScope', MODULE);
//    select.trigger('remove:done');
//  };

  Module.add(MODULE, {
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