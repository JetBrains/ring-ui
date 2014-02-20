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

  var $el,
    $target,
    dataSource,
    lastTriggeredCaretPositionPers,
    uid = 0;

  var QUERY_ASSIST_SELECTOR = '.ring-query-assist',
    CONTAINER_SELECTOR = '.ring-dropdown',
    WRAPPER_SELECTOR = '.ring-dropdown__i',
    ITEM_CONTENT_SELECTOR = '.ring-dropdown__item__content',
    ITEM_CONTENT_SELECTOR_PADDING = 8,
    MIN_LEFT_PADDING = 32,
    MIN_RIGHT_PADDING = 32,
    CONTAINER_TOP_PADDING = 21;

  var shortcuts = Module.get('shortcuts'),
    actionList = Module.get('action-list'),
    delayedListener = Module.get('delayed-listener');

  var MODULE = 'query-assist',
    COMPLETE_ACTION = 'replace',
    $global = $(document);

  /**
   * Init method
   */
  var init = function (config) {
    if (!config || !config.targetElem || !config.dataSource) {
      utils.log('query-assist init params missing');
      return $.Deferred().fail();
    }

    $target = $(config.targetElem);
    dataSource = config.dataSource;
    shortcuts('pushScope', MODULE);
    uid += 1;

    var dfd = View.init(MODULE, $target, config.method || 'prepend', {}, config);

    dfd.done(function ($view) {
      $el = $view;
      updateQuery();

      delayedListener('init', {
        target: $target.find(QUERY_ASSIST_SELECTOR),
        onDelayedChange: function (data) {
          lastTriggeredCaretPositionPers = data.caret;
          _doAssist(data.value, data.caret, true);
        },
        onDelayedCaretMove: function (data) {
          lastTriggeredCaretPositionPers = data.caret;
          _doAssist(data.value, data.caret, false);
        }
      });

    });

    return dfd;
  };

  var remove = function () {
    if ($el) {
      $el.remove();
      $el = null;
      actionList('remove');
    }
  };

  var updateQuery = function (query) {
    if ($el) {
      if (query) {
        $el.text(query);
      } else {
        query = $el.text();
      }
    }

    if (query && query.length) {
      _doAssist(query, query.length, true, true);
    }
  };

  var apply = function () {
    queryAssist.trigger('apply', $el.text().replace(/\s/g, ' '));
    actionList('remove');

    return false;
  };

  /**
   * init suggest handle
   * @param {string} query Text for handle suggestion
   * @param {number} caret Caret position
   * @param {bool} requestHighlighting Is highlight required
   */
  var _doAssist = function (query, caret, requestHighlighting, highlightOnly) {
    if (query && caret) {
      dataSource(query.replace(/\s/g, ' '), caret, requestHighlighting).then(function (data /* status, jqXHR*/) {
        /**
         * #{String}.replace(/\s+/g, ' ') needs for trim any whitespaces.
         */
        if (data && data.styleRanges && ($el.text().replace(/\s+/g, ' ') === query.replace(/\s+/g, ' '))) {
          $el.html(_getHighlightedHtml(data.styleRanges, query));
          delayedListener('placeCaret', $el.find('span').eq(data.caret - 1));
        }

        // if data isn't exist hide a suggest container
        if (!highlightOnly && data && data.suggestions) {
          var dropdownData = {
            type: ['typed', 'bound']
          };

          var dropdownTextPosition = data.caret;
          if (data.suggestions[0]) {
            dropdownTextPosition -= data.suggestions[0].matchingEnd - data.suggestions[0].matchingStart;
          }
          dropdownData.items = _getHighlightText(data);

          actionList('create', dropdownData, {
            width: 'auto',
            target: $el
          });
          var coords = __getCoords(dropdownTextPosition);

          $(CONTAINER_SELECTOR).css(coords);
        } else {
          actionList('hide');
        }

      });
    } else {
      actionList('remove');
    }
  };

  var _getClassname = function (obj, text, pos) {
    var res = [];
    obj.forEach(function (item) {
      if (item.start <= pos && item.start + item.length > pos) {
        res.push(item.style);
      }
    });
    return res;
  };

  /**
   * Return highlighted html
   */
  var _getHighlightedHtml = function (styleRanges, text) {
    function appendItemClass (currentClasses, item) {
      if (item) {
        return (currentClasses ? currentClasses + ' ' : '') + 'ring-query-assist__' + item.replace('_', '-');
      } else {
        return currentClasses;
      }
    }

    function appendLetter (currentHtml, letter, index) {
      var classes = _getClassname(styleRanges, text, index).reduce(appendItemClass, '');
      return currentHtml + '<span class="' + classes + '">' + (letter !== ' ' ? letter : '&nbsp;') + '</span>';
    }

    return text.split('').reduce(appendLetter, '');
  };

  /**
   * get caret coords in abs value
   */
  var __getCoords = function (textPos) {
    textPos = textPos || 1;
    var caretPos = $el.find('span').eq(textPos - 1).offset();

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
   * Ajax get suggestion
   */
  var remoteDataSource = function (remoteDataSourceConfig) {
    var auth = Module.get('auth');

    return function (query, caret, requestHighlighting) {
      var defer = $.Deferred();
      var restUrl = remoteDataSourceConfig.url || '/api/rest/users/queryAssist?caret=#{caret}&fields=query,caret,suggestions#{styleRanges}&query=#{query}';
      var substr = ['query', 'caret', 'styleRanges'];
      var suggestArgs = [encodeURI(query), caret, (requestHighlighting ? ',styleRanges' : '')];

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
   * get highlight text using suggest.matching{Start|End}
   */
  var _getHighlightText = function (assistData) {
    return $.isArray(assistData.suggestions) && assistData.suggestions.map(function (suggestion) {
      var label = [];

      if (utils.isEmptyString(suggestion.prefix)) {
        label.push(suggestion.prefix);
      } else {
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

      if (utils.isEmptyString(suggestion.suffix)) {
        label.push(suggestion.suffix);
      } else {
        label.push({
          label: suggestion.suffix,
          type: 'service'
        });
      }

      return {
        label: label,
        type: suggestion.description,
        event: [
          {
            name: 'action-list:complete',
            data: {
              action: COMPLETE_ACTION,
              query: assistData.query,
              suggestion: suggestion
            }
          },
          {
            name: 'action-list:replace',
            type: 'replace',
            data: {
              query: assistData.query,
              suggestion: suggestion
            }
          }
        ]
      };
    }) || [];
  };

  /**
   * autocomplete current text field
   */
  var _handleComplete = function (data) {
    var input = data.query || '';
    var prefix = data.suggestion.prefix || '';
    var suffix = data.suggestion.suffix || '';
    var output = input.substr(0, data.suggestion.completionStart) + prefix + data.suggestion.option + suffix;

    if (data.action === COMPLETE_ACTION) {
      output += input.substr(lastTriggeredCaretPositionPers);
    } else {
      output += input.substr(data.suggestion.completionEnd + suffix.length);
    }

    $el.text(output);
    _doAssist(output, data.suggestion.caret, true, true);
    queryAssist.trigger('change caret-move complete', {
      value: output,
      caret: data.suggestion.caret
    });
  };

  actionList.on('action', function (data) {
    _handleComplete(data.event[0].data);
  });
  actionList.on('replace', function () {
    console.log('replace');
    _handleComplete(arguments[0]);
  });
  actionList.on('complete', function () {
    console.log('complete');
    _handleComplete(arguments[0]);
  });

  var showAssist = function () {
    _doAssist($el.text().replace(/\s/g, ' '), $el.caret(), false, false);
    return false;
  };

  shortcuts('bindList', {scope: MODULE}, {
    'enter': apply,
    'ctrl+space': showAssist
  });

  Module.add(MODULE, {
    init: init,
    remove: remove,
    updateQuery: updateQuery,
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

  var queryAssist = Module.get(MODULE);

  queryAssist.on('focus', function (focus) {
    if ($el) {
      if (focus) {
        var offset = $el.offset();

        // TODO More robust scroll
        if ($global.scrollTop() > offset.top) {
          window.scrollTo(offset.left, Math.max(offset.top - 100, 0));
        }
        $el.focus();
      } else {
        $el.blur();
      }
    }
  });
});