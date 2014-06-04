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
  var RESULT_COUNT = 10;
  var LOADING_CLASS = 'ring-input_loading';
  var SELECT_ARROW_CLASS = 'ring-input_icon__span';
  var MODULE_SHORTCUTS = 'dropdown-select';
  var CONTAINER_CLASS = 'ring-dropdown-select__container';
  var ITEM_ACTION_SELECTOR = '.ring-dropdown__item_action';
  var ACTIVE_CLASS = 'active';
  var ITEM_ERROR_CLASS = 'ring-dropdown__item_error';
  var POPUP_CONTAINER_CLASS = 'ring-dropdown__i';

  var uid = 0;

  var popup = Module.get('popup');
  var actionList = Module.get('action-list');
  var shortcuts = Module.get('shortcuts');
  var delayedListener = Module.get('delayed-listener');

  /**
   * Creates Select on config.target element
   * @param {Object} config
   * @constructor
   */
  var Select = function (config) {
    if (!(this instanceof Select)) {
      return new Select(config);
    }
    var self = this;

    this.$target = $(config.target);
    this.type = ['bound'].concat(config.type);
    this.top = config.top || config.$top || RESULT_COUNT;
    this.limitWidth = config.limitWidth;
    this.skip_ = 0;
    this.description = config.description;
    this.dataSource = config.dataSource;
    this.onShow = config.onShow || $.noop;
    this.onHide = config.onHide || $.noop;
    this.onSelect = config.onSelect || $.noop;
    this.onChange = config.onChange || $.noop;
    this.onSubmit = config.onSubmit || $.noop;
    this.noErrors = false;

    if (this.type.indexOf('typed') !== -1) {
      this.type.push('typed-select');
    }

    this.shortcutsUID_ = MODULE_SHORTCUTS + uid++;
    this.isDirty_ = false;
    this.wrapper_ = popup('init', {
      target: self.$target,
      type: self.type,
      width: self.limitWidth
    });
    this.$container_ = null;
    this.containerHeight_ = this.top * 24;
    this.top += 1;
    this.itemsCount_ = this.top;
    this.currentQuery_ = '';
    this.$body_ = $('body');
    this.activeItemIndex_ = 0;

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
        shortcuts('spliceScope', self.shortcutsUID_);
      }).
      on('input', function () {
        self.isDirty_ = true;
      }).
      on('keyup', $.proxy(this, 'submitHandler'));

    this.$target.next('.' + SELECT_ARROW_CLASS).on('click', function () {
      self.$target.focus();
      self.$target.select();
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
        self.onChange(data.value);
        self.configureRequest(data.value);
      },
      onDelayedCaretMove: function (data) {
        self.configureRequest(data.value);
      }
    });
  };

  /**
   * Config request. By default should be empty request.
   * @param query {string}
   */
  Select.prototype.configureRequest = function (query) {
    if (!this.isDirty_) {
      query = '';
      this.isDirty_ = true;
    }

    this.$target.removeClass(LOADING_CLASS);
    this.requestData(query, this.top, this.skip_);
  };

  /**
   * Invoke dataSource.
   * @param query {string}
   * @param top {number}
   * @param skip {number}
   */
  Select.prototype.requestData = function (query, top, skip) {
    var that = this;
    this.currentQuery_ = query;

    this.dataSource(query, top, skip).then(function (data) {
      if (data.length === 0) {
        data = [
          {
            action: false,
            error: true,
            label: 'No results'
          }
        ];
      }
      that.renderComponent(data);
    }, $.proxy(that, 'errorHandler'));
  };

  /**
   * Initial render of the component. Also binding events.
   * @param data
   */
  Select.prototype.renderComponent = function (data) {
    if (!$.contains(this.$body_[0], this.wrapper_.el[0])) {
      this.$body_.append(this.wrapper_.el);
      this.onShow(true);
    }

    $(document).on('click', $.proxy(this, 'destroy'));

    if (!this.$container_) {
      this.initContainer();
    }

    this.$container_.empty();

    var actionListElem = this.createActionList(data);

    actionListElem.on('mouseover', this.hoverHandler);

    this.$container_.append(actionListElem);
    $(actionListElem).siblings().eq(this.activeItemIndex_).addClass(ACTIVE_CLASS);
  };

  /**
   * Handle scroll event. Init items re-render.
   * @param e
   */
  Select.prototype.scrollHandler = function (e) {
    var $activeItem = this.$container_.find(ITEM_ACTION_SELECTOR + '.' + ACTIVE_CLASS);

    this.activeItemIndex_ = $activeItem.index();

    if ((this.$container_.get(0).scrollHeight - this.$container_.height()) - $(e.currentTarget).scrollTop() < 50) {
      this.itemsCount_ += this.top;
      this.requestData(this.currentQuery_, this.itemsCount_, this.skip_);
    }
  };


  /**
   * On item click handler. Emit onSelect(String)
   * @param e
   * @returns {boolean}
   */
  Select.prototype.clickHandler = function (e) {
    e.stopPropagation();

    var $el = $(e.target);

    if (this.type.indexOf('typed') !== -1) {
      $el = $el.parent();
    }

    if ($el.hasClass(ITEM_ERROR_CLASS)) {
      return false;
    }

    var item = this.getActiveItem();

    this.onSelect(item);
    this.$target.val(item.label);
    this.$target.focus();

    this.destroy();
  };

  /**
   * Submit handler for $target. Emit onSubmit(String) / onSelect(Object)
   * @param e
   */
  Select.prototype.submitHandler = function (e) {
    if (e.keyCode === 13) {
      var activeItem = this.getActiveItem();

      if (!activeItem) {
        this.onSubmit(this.currentQuery_);
      } else {
        this.$target.val(activeItem.label);
        this.isDirty_ = true;
        this.onSelect(activeItem);
      }

      this.destroy();
    }
  };

  /**
   * Override action-list default shortcuts. Scroll to active element.
   * @param e
   * @param key
   */
  Select.prototype.navigate = function (e, key) {
    if (this.$container_ === null) {
      return false;
    }
    var up = (key === 'up');
    var $active = this.$container_.parent().find(ITEM_ACTION_SELECTOR + '.' + ACTIVE_CLASS);
    var $next = $active[up ? 'prev' : 'next'](ITEM_ACTION_SELECTOR);
    var $container = (this.type.indexOf('typed') === -1)?this.$container_:this.wrapper_.el.find('.' + POPUP_CONTAINER_CLASS);

    $active.removeClass(ACTIVE_CLASS);

    if ($next.length) {
      if (($next.position().top >= $container.height()) || $next.position().top < 0) {
        $container.scrollTo($next);
      }
      $next.addClass(ACTIVE_CLASS);
    } else {
      $next = this.$container_.parent().find(ITEM_ACTION_SELECTOR)[up ? 'last' : 'first']();
      $next.addClass(ACTIVE_CLASS);
      $container.scrollTo($next);
    }

    e.preventDefault();
  };

  /**
   * Render action-list.
   * @param data
   * @returns {*}
   */
  Select.prototype.createActionList = function (data) {
    return actionList('init', {
      overrideNavigation: true,
      items: data
    });
  };

  /**
   * Set active state for items.
   */
  Select.prototype.hoverHandler = function () {
    $(this).siblings().each(function () {
      $(this).removeClass(ACTIVE_CLASS);
    });

    $(this).addClass(ACTIVE_CLASS);
  };

  /**
   * Return data from active item.
   * @returns {Object}
   */
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

  /**
   * Reject handler for data source.
   */
  Select.prototype.errorHandler = function () {
    if (!this.noErrors) {
      var errorItem = [
        {
          action: false,
          error: true,
          label: 'Internal error'
        }
      ];
      errorItem.error = true;

      this.renderComponent(errorItem);
    }
  };

  /**
   * Init $container_ binding events.
   */
  Select.prototype.initContainer = function () {
    this.$container_ = $('<div class="' + CONTAINER_CLASS + '"></div>').
      on('click', $.proxy(this, 'clickHandler')).
      on('scroll', utils.throttle($.proxy(this, 'scrollHandler')));

    if (this.type.indexOf('typed') === -1) {
      this.$container_.css('max-height', this.containerHeight_);
    } else {
      this.wrapper_.el.find('.' + POPUP_CONTAINER_CLASS).css('max-height', this.containerHeight_);
    }

    this.wrapper_.appendHTML(this.$container_);

    if (this.description) {
      var $description = $(View.render('dropdown__description', {
        description: this.description
      }));

      if (this.type.indexOf('typed') === -1) {
        this.$container_.after($description);
      } else {
        this.wrapper_.el.find('.' + POPUP_CONTAINER_CLASS).after($description);
        this.wrapper_.el.find('.' + POPUP_CONTAINER_CLASS).
          on('scroll', utils.throttle($.proxy(this, 'scrollHandler')));
      }
    }
  };

  /**
   * Destroys bindings
   */
  Select.prototype.destroy = function () {
    if (this.wrapper_ && $.contains(this.$body_[0], this.wrapper_.el[0])) {
      this.wrapper_.el.detach();
      this.onHide();
    }

    $(document).off('click', this.destroy);
  };

  /**
   * Data source factory for HUB entities.
   * @param remoteDataSourceConfig {object}
   * @returns {object} promise
   */
  var remoteDataSource = function (remoteDataSourceConfig) {
    var select = Module.get(MODULE);
    var auth = Module.get('auth');

    if (!remoteDataSourceConfig && (!remoteDataSourceConfig.hubResource || !remoteDataSourceConfig.url)) {
      select.trigger('init:fail');
      return false;
    }

    return function (query, $top) {
      var defer = $.Deferred();
      var restUrl = remoteDataSourceConfig.url;
      var substr = ['query', '$top'];
      var suggestArgs = [encodeURI(query)];

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

  Module.add(MODULE, {
    init: {
      method: Select,
      override: true
    },
    remoteDataSource: {
      method: remoteDataSource,
      override: true
    }
  });
});