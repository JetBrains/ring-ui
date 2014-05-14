define([
  'jquery',
  'global/global__views',
  'global/global__modules',
  'global/global__utils',
  'global/global__events',
  'auth/auth',
  'shortcuts/shortcuts',
  'action-list/action-list',
  'delayed-listener/delayed-listener'
], function ($, View, Module, utils) {
  'use strict';

  var lastInstance;
  var uid = 0;

  var INPUT_SELECTOR = '.ring-query-assist__input';
  var GLASS_SELECTOR = '.ring-js-query-assist__glass';
  var LETTER_CLASS = 'ring-query-assist__letter';
  var LETTER_ELEMENT = 'span';

  // TODO Move logic with these selectors to popup
  var WRAPPER_SELECTOR = '.ring-dropdown__i';
  var ITEM_CONTENT_SELECTOR = '.ring-dropdown__item__content';

  var ITEM_CONTENT_SELECTOR_PADDING = 8;
  var MIN_LEFT_PADDING = 32;
  var MIN_RIGHT_PADDING = 32;
  var CONTAINER_TOP_PADDING = 21;

  var shortcuts = Module.get('shortcuts');
  var actionList = Module.get('action-list');
  var delayedListener = Module.get('delayed-listener');

  var MODULE = 'query-assist';
  var MODULE_SHORTCUTS = 'ring-query-assist';
  var $global = $(document);

  /**
   * Creates QueryAssist on config.target element
   * @param {Object} config
   * @constructor
   */
  var QueryAssist = function(config) {
    if (!(this instanceof QueryAssist)) {
      return new QueryAssist(config);
    }

    var self = this;
    var apply_ = $.proxy(this, 'apply_');
    this.shortcutsUID_ = MODULE_SHORTCUTS + uid++;
    this.$target_ = $(config.targetElem);
    this.dataSource_ = config.dataSource;
    this.onApply_ = config.onApply || $.noop;
    this.onChange_ = config.onChange || $.noop;
    this.onFocusChange_ = config.onFocusChange || $.noop;

    View.init(MODULE, this.$target_, config.method || 'prepend', {}, config).then(function($view) {
      self.$view_ = $view;
      self.$input_ = $view.find(INPUT_SELECTOR);
      self.updateQuery_({
        query: config.query || '',
        caret: config.caret
      });
      self.request_({highlight: !!self.query_, show: false, focus: !!config.autofocus});

      if (config.autofocus) {
        self.setFocus(true);
      }

      if (config.glass) {
        $view.find(GLASS_SELECTOR).on('click', apply_);
      }

      shortcuts('bindList', {scope: self.shortcutsUID_}, {
        'enter': apply_,
        'shift+enter': apply_,
        'ctrl+enter': apply_,
        'alt+enter': apply_,
        'tab': $.proxy(self, 'handleReplace_'),
        'ctrl+space': function(e) {
          self.request_({highlight: false});
          e.preventDefault();
        },
        'esc':function() {
          // Hide dropdown and fall to next shortcut scope if there was none
          if (!actionList('remove')) {
            return true;
          }
        }
      });

      self.$input_.
        on('focus.' + MODULE, function () {
          shortcuts('pushScope', self.shortcutsUID_);
          self.prevCaret_ = null;
          self.onFocusChange_(true);

          // Backward compatibility
          queryAssist.trigger('focus-change', true);
        }).
        on('blur.' + MODULE, function () {
          shortcuts('spliceScope', self.shortcutsUID_);
          self.onFocusChange_(false);

          // Save caret to use in handleComplete_
          self.prevCaret_ = self.caret_;
          self.caret_ = null;

          // Backward compatibility
          queryAssist.trigger('focus-change', false);
        });

      self.listener = delayedListener('init', {
        target: self.$input_,
        listenDelay: config.listenDelay,
        onDelayedChange: function (data) {
          var query = data.value.replace(/\s/g, ' ');

          if (query === self.query_) {
            return;
          }

          self.updateQuery_({
            query: query,
            caret: data.caret
          });
          self.setFocus(true);
          self.request_();
          self.onChange_(query, data.caret);

          // Backward compatibility
          triggerChange_(data);
        },
        onDelayedCaretMove: function (data) {
          self.updateQuery_({
            caret: data.caret
          });
          self.request_({highlight: false});

          // Backward compatibility
          triggerChange_(data);
        }
      });
    });

    lastInstance = this;
  };

  /**
   * Triggers legacy change event
   * @param {Object} data
   * @private
   */
  function triggerChange_ (data) {
    queryAssist.trigger('change', {value: data.value.replace(/\s/g, ' '), caret: data.caret});
  }

  /**
   * Destroys bindings
   */
  QueryAssist.prototype.destroy = function() {
    // this.listener is destroyed automatically along with this.$view_
    this.$view_.remove();
    shortcuts('unBindList', this.shortcutsUID_);
    if (this.actionList_) {
      actionList('remove');
    }

    // Clean in single-instance environments
    if (lastInstance === this) {
      lastInstance = null;
    }
  };

  /**
   * Destroys last instance; backward compatibility
   */
  var remove = function () {
    if (lastInstance) {
      lastInstance.destroy();
    }
  };

  /**
   * Set new query
   * @param params.query {string=}
   * @param params.caret {number=}
   * @param params.styleRanges {array=}
   * @private
   */
  QueryAssist.prototype.updateQuery_ = function(params) {
    var queryUpdated;

    if (typeof params.query === 'string' && params.query !== this.query_) {
      queryUpdated = true;
      this.query_ = params.query;
    }

    if (typeof params.caret === 'number' && params.caret !== this.caret_) {
      this.caret_ = params.caret;
    } else if (queryUpdated) {
      this.caret_ = params.query.length;
    }

    if (params.styleRanges) {
      this.styleRanges = params.styleRanges;
    }

    if (queryUpdated || params.styleRanges) {
      this.renderQuery_();
    }
  };

  /**
   * Updates last instance; backward compatibility
   */
  var updateQuery = function (query, caret) {
    if (lastInstance && query) {
      lastInstance.updateQuery_({
        query: query,
        caret: caret
      });
    }
  };

  /**
   * Set new query and update highlighting
   * @param params.query {string=}
   * @param params.caret {number=}
   * @param params.styleRanges {array=}
   */
  QueryAssist.prototype.updateQuery = function(params) {
    this.updateQuery_(params);
    this.request_({show: false});
  };

  /**
   * Applies search
   * @param {jQuery.Event=} e
   * @private
   */
  QueryAssist.prototype.apply_ = function(e) {
    this.onApply_(this.query_);
    actionList('remove');
    if (e) {
      e.preventDefault();
    }
    // Backward compatibility
    queryAssist.trigger('apply', this.query_);
  };

  /**
   * Changes focus state
   * @param {boolean} focus New focus state
   */
  QueryAssist.prototype.setFocus = function(focus) {
    if (focus) {
      var offset = this.$input_.offset();

      // TODO More robust scroll
      if ($global.scrollTop() > offset.top) {
        window.scrollTo(offset.left, Math.max(offset.top - 100, 0));
      }

      // Always trigger focus on input to start delayed-listener
      this.$input_.focus();
      if (this.query_ && this.query_.length) {
        delayedListener('placeCaret', this.getLetterElement_(this.caret_));
      }
    } else {
      this.$input_.blur();
    }
  };

  /**
   * Returns letter span by position
   * @param {number} position
   * @returns {jQuery}
   * @private
   */
  QueryAssist.prototype.getLetterElement_ = function(position) {
    return this.$input_.find(LETTER_ELEMENT).eq(position - 1);
  };

  /**
   * Requests and applies highlighting and/or suggetions
   * @param {boolean=true} params.highlight Highlight query
   * @param {boolean=true} params.show Show suggestions
   * @param {boolean=true} params.focus Focus on field after query update
   */
  QueryAssist.prototype.request_ = function(params) {
    params = params || {};

    var self = this;
    var highlight = params.highlight !== false;

    this.dataSource_(this.query_, this.caret_, highlight).then(function (data) {
      if (!data || self.query_ !== data.query) {
        return;
      }

      if (highlight && data.styleRanges) {
        self.updateQuery_({
          query: data.query,
          caret: data.caret,
          styleRanges: data.styleRanges
        });

        if (params.focus !== false) {
          self.setFocus(true);
        }
      }

      // if data doesn't exist, hide suggest container
      if (params.show !== false && data.suggestions) {
        self.showDropdown_(data);
      } else {
        actionList('remove');
      }
    });
  };

  /**
   * Renders query
   * @private
   */
  QueryAssist.prototype.renderQuery_ = function () {
    var text = this.query_;
    var styleRanges = this.styleRanges;

    this.$input_.empty();

    if (text === '') {
      return;
    }

    function createLetter(letter, index) {
      var element = document.createElement(LETTER_ELEMENT);
      var text = document.createTextNode(letter !== ' ' ? letter : '\u00a0');

      var classes = styleRanges && $.map(styleRanges, function(item) {
        if (item.start <= index && item.start + item.length > index) {
          return LETTER_CLASS + '_' + item.style.replace('_', '-');
        } else {
          return null;
        }
      }).concat(LETTER_CLASS).join(' ');

      if (classes) {
        element.className = classes;
      }

      element.appendChild(text);

      return element;
    }

    this.$input_.append($.map(text.split(''), createLetter));
  };

  /**
   * Return caret coords as an absolute value
   * TODO move positioning logic to popup
   * @param {number} textPos
   * @returns {Object}
   * @private
   */
  QueryAssist.prototype.getCoords_ = function (textPos) {
    textPos = textPos || 1;
    var caretPos = this.getLetterElement_(textPos).offset();

    if (!caretPos) {
      return {};
    }

    var itemWidth = $(ITEM_CONTENT_SELECTOR).outerWidth();
    var globalWidth = $global.width();
    var wrapper = $(WRAPPER_SELECTOR);
    var widthItemType = (wrapper.outerWidth() - itemWidth) + ITEM_CONTENT_SELECTOR_PADDING;

    // Omit under $el
    caretPos.top += CONTAINER_TOP_PADDING;
    // Follow caret position
    caretPos.left -= widthItemType;

    // Left edge
    if ((caretPos.left) < MIN_LEFT_PADDING) {
      caretPos.left = MIN_LEFT_PADDING;
    }
    // Right edge
    if (wrapper.length && caretPos.left > globalWidth - (wrapper.offset().left + wrapper.outerWidth())) {
      caretPos.left = globalWidth - MIN_RIGHT_PADDING - wrapper.outerWidth() - 2;
    }
    return caretPos;
  };

  /**
   * Default datasource
   * @param {Object} remoteDataSourceConfig
   * @returns {Function}
   */
  var remoteDataSource = function (remoteDataSourceConfig) {
    var auth = Module.get('auth');

    return function (query, caret, requestHighlighting) {
      var defer = $.Deferred();
      // URL example
      // '/api/rest/users/queryAssist?caret=#{caret}&fields=query,caret,suggestions#{styleRanges}&query=#{query}'
      var restUrl = remoteDataSourceConfig.url;

      if (!restUrl) {
        return $.Deferred().fail();
      }

      var substr = ['query', 'caret', 'styleRanges'];
      var suggestArgs = [encodeURI(query), caret.toString(), (requestHighlighting ? ',styleRanges' : '')];

      substr.forEach(function (item, index) {
        restUrl = restUrl.replace('#{' + item  + '}', suggestArgs[index] ? suggestArgs[index] : '');
      });

      auth('get', restUrl).then(function (data, state, jqXHR) {
        defer.resolve(data, state, jqXHR);
      }).fail(function () {
        defer.reject.apply(defer, arguments);
      });
      return defer.promise();
    };
  };

  /**
   * Renders actionlist dropdown
   * TODO move positioning logic to popup
   * @param {Object} data
   * @private
   */
  QueryAssist.prototype.showDropdown_ = function (data) {
    var self = this;
    var dropdownTextPosition = data.caret;

    if (data.suggestions[0]) {
      dropdownTextPosition -= data.suggestions[0].matchingEnd - data.suggestions[0].matchingStart;
    }
    var items = $.isArray(data.suggestions) && $.map(data.suggestions, function (suggestion) {
      var label = [];

      if (suggestion.prefix && !utils.isEmptyString(suggestion.prefix)) {
        label.push({
          label: suggestion.prefix,
          type: 'service'
        });
      }

      if (suggestion.option && suggestion.matchingStart !== suggestion.matchingEnd) {
        label.push(suggestion.option.substring(0, suggestion.matchingStart));
        label.push({
          label: suggestion.option.substring(suggestion.matchingStart, suggestion.matchingEnd),
          type: 'highlight'
        });
        label.push(suggestion.option.substring(suggestion.matchingEnd));
      } else {
        label.push(suggestion.option);
      }

      if (suggestion.suffix && !utils.isEmptyString(suggestion.suffix)) {
        label.push({
          label: suggestion.suffix,
          type: 'service'
        });
      }

      return {
        label: label,
        type: suggestion.description,
        data: {
          query: data.query,
          suggestion: suggestion
        },
        event: []
      };
    }) || [];

    /**
     * @private
     */
    this.lastSuggestion_ = {
      query: data.query,
      suggestion: data.suggestions[0]
    };

    /**
     * Bound actionList instance
     * @private
     */
    this.actionList_ = actionList('init', {
      target: this.$input_,
      type: ['typed', 'bound'],
      width: 'auto',
      description: 'Use ↩ to complete selected item',
      items: items
    });

    // TODO Get rid of events here
    actionList.on('change_' + actionList('getUID'), function (data) {
      if (self.caret_ === null && typeof self.prevCaret_ != null) {
        self.caret_ = self.prevCaret_;
      }
      self.handleComplete_(data.data);
    });

    this.actionList_.popup.el.css(this.getCoords_(dropdownTextPosition));
  };

  /**
   * Handles complete
   * @param {Object} data Suggestions
   * @param {boolean=} replace Replace part or not
   * @private
   */
  QueryAssist.prototype.handleComplete_ = function (data, replace) {
    var input = this.query_ || '';
    var prefix = data.suggestion.prefix || '';
    var suffix = data.suggestion.suffix || '';
    var output = input.substr(0, data.suggestion.completionStart) + prefix + data.suggestion.option + suffix;

    if (!replace) {
      output += input.substr(this.caret_);
    } else {
      output += input.substr(data.suggestion.completionEnd + suffix.length);
    }

    this.updateQuery_({
      query: output,
      caret: data.suggestion.caret
    });
    this.request_();
    this.setFocus(true);

    // Backward compatibility
    queryAssist.trigger('change', {
      value: output,
      caret: data.suggestion.caret
    });
  };

  /**
   * Handles replace
   * @returns {boolean}
   * @private
   */
  QueryAssist.prototype.handleReplace_ = function () {
    // Replace result with selected item
    var selectedItemData = this.actionList_ && this.actionList_.getSelectedItemData();

    if (selectedItemData) {
      this.handleComplete_(selectedItemData, true);
      return false;
    }

    // Insert first result when nothing selected
    if (this.lastSuggestion_) {
      this.handleComplete_(this.lastSuggestion_);
    }

    return false;
  };

  Module.add(MODULE, {
    init: QueryAssist,
    getQueryAssist: {
      method: function() {
        return QueryAssist;
      },
      override: true
    },
    remove: remove,
    updateQuery: updateQuery,
    remoteDataSource: {
      method: remoteDataSource,
      override: true
    }
  });

  var queryAssist = Module.get(MODULE);

  queryAssist.on('focus', function (focus) {
    if (lastInstance) {
      lastInstance.setFocus(focus);
    }
  });
});