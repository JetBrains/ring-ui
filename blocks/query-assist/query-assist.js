define(['jquery', 'global/global__views', 'global/global__modules', 'global/global__utils', 'dropdown/dropdown', 'auth/auth', 'shortcuts/shortcuts', 'jquery-caret'], function ($, View, Module, utils) {
  'use strict';

  var $el,
    $target,
    dataSource,
    timeoutId,
    lastPolledCaretPosition,
    lastTriggeredCaretPosition,
    lastPolledValue,
    lastTriggeredValue;

  var QUERY_ASSIST_SELECTOR = '.ring-query-assist';
  var CONTAINER_SELECTOR = '.ring-dropdown';
  var WRAPPER_SELECTOR = '.ring-dropdown__i';
  var ITEM_CONTENT_SELECTOR = '.ring-dropdown__item__content';
  var ITEM_CONTENT_SELECTOR_PADDING = 8;
  var MIN_LEFT_PADDING = 32;
  var MIN_RIGHT_PADDING = 32;
  var CONTAINER_TOP_PADDING = 21;

  var POLL_INTERVAL = 250; // 250 ms

  var dropdown = Module.get('dropdown');
  var shortcuts = Module.get('shortcuts');

  var MODULE = 'query-assist';
  var $global = $(document);

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

    var dfd = View.init(MODULE, $target, config.method || 'prepend', {}, config);

    dfd.done(function($view) {
      $el = $view;

      updateQuery();
    });

    return dfd;
  };

  var updateQuery = function(query) {
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

  var apply = function() {
    queryAssist.trigger('apply', $el.text().replace(/\s/g, ' '));
    dropdown('hide');

    return false;
  };

  var _startListen = function () {
    if (!timeoutId) {
      shortcuts('pushScope', MODULE);

      lastTriggeredCaretPosition = undefined;
      lastPolledCaretPosition = undefined;
      timeoutId = setTimeout(_pollCaretPosition, POLL_INTERVAL);
    }
  };

  var _stopListen = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      shortcuts('popScope', MODULE);
    }
  };

  /**
   * polling caret position
   */
  var _pollCaretPosition = function () {
    if (!$el.is(':focus')) {
      _stopListen();
    }

    var caret = $el.caret();
    var value = $el.text().replace(/\s/g, ' ');

    if (lastPolledCaretPosition !== caret || lastPolledValue !== value) {
      lastPolledCaretPosition = caret;
      lastPolledValue = value;
    } else if (value !== lastTriggeredValue) {
      lastTriggeredCaretPosition = caret;
      lastTriggeredValue = value;
      // Trigger event if value changed
      queryAssist.trigger('delayedChange:done', {value: value, caret: caret});
      _doAssist(value, caret, true);
    } else if (caret !== lastTriggeredCaretPosition) {
      lastTriggeredCaretPosition = caret;
      lastTriggeredValue = value;
      // trigger event if just caret position changed
      queryAssist.trigger('delayedCaretMove:done', {value: value, caret: caret});
      _doAssist(value, caret, false);
    }

    timeoutId = setTimeout(_pollCaretPosition, POLL_INTERVAL);
  };

  /**
   * init suggest handle
   * @param {string} query Text for handle suggestion
   * @param {number} caret Caret position
   * @param {bool} requestHighlighting Is highlight required
   */
  var _doAssist = function (query, caret, requestHighlighting, highlightOnly) {
    if (query && caret) {
      dataSource(query, caret, requestHighlighting).then(function (data /* status, jqXHR*/) {
        /**
         * #{String}.replace(/\s+/g, ' ') needs for trim any whitespaces.
         */
        if (data && data.styleRanges && ($el.text().replace(/\s+/g, ' ') === query.replace(/\s+/g, ' '))) {
          $el.html(_getHighlightedHtml(data.styleRanges, query));
          _placeCaret($el.find('span').eq(data.caret - 1));
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

          dropdown('hide');
          dropdown('show', dropdownData, {
            width: 'auto',
            target: $el
          });
          var coords = __getCoords(dropdownTextPosition);

          $(CONTAINER_SELECTOR).css(coords);

          queryAssist.trigger('doAssist:done');
        } else {
          queryAssist.trigger('hide:done');
          dropdown('hide');
        }

      });
    } else {
      dropdown('hide');
    }
  };

  /**
   * Handle caret position in nested contenteditable element
   * @param jQuery element
   */
  var _placeCaret = function (el) {
    el.focus();
    if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
      var range = document.createRange();
      range.selectNodeContents(el[0]);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange !== 'undefined') {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el[0]);
      textRange.collapse(false);
      textRange.select();
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
    function appendItemClass(currentClasses, item) {
      if (item) {
        return (currentClasses ? currentClasses + ' ' : '') + 'ring-query-assist__' + item.replace('_', '-');
      } else {
        return currentClasses;
      }
    }

    function appendLetter(currentHtml, letter, index) {
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
    var caretPos = $el.find('span').eq(textPos  -1).offset();

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
        queryAssist.trigger('ajax:done', data);
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
        event: {
          name: 'dropdown:complete',
          data: {
            assistData: assistData,
            suggestion: suggestion
          }
        }
      };
    }) || [];
  };

  /**
   * autocomplete current text field
   */
  var _handleComplete = function (data) {
    var input = data.assistData.query || '';
    var insText = (data.suggestion.prefix || '') + data.suggestion.option + (data.suggestion.suffix || '');
    var output = input.substr(0, data.suggestion.completionStart) + insText + input.substr(data.suggestion.completionEnd);

    $el.text(output);
    _doAssist(output, data.suggestion.caret, true);
    queryAssist.trigger('complete:done', data);
  };

  dropdown.on('complete', _handleComplete);
  shortcuts('bindList', {scope: MODULE}, {
    'enter': apply,
    'ctrl+space': _doAssist
  });

  $global.on('focusin', QUERY_ASSIST_SELECTOR, _startListen);
  $global.on('focusout', QUERY_ASSIST_SELECTOR, _stopListen);

  Module.add(MODULE, {
    init: init,
    updateQuery: updateQuery,
    remoteDataSource: {
      method: remoteDataSource,
      override: true
    }
  });

  var queryAssist = Module.get(MODULE);
});