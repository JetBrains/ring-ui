define(['jquery', 'global/global__views', 'global/global__modules', 'global/global__utils', 'dropdown/dropdown', 'auth/auth', 'jquery-caret'], function ($, View, Module, utils) {
  'use strict';

  var $el,
    $query,
    dataSource,
    $global,
    timeoutHandler,
    lastPolledCaretPosition,
    lastTriggeredCaretPosition,
    lastPolledValue,
    lastTriggeredValue,
    COMPONENT_SELECTOR,
    ITEM_SELECTOR,
    MIN_LEFT_PADDING,
    MIN_RIGHT_PADDING;

  var dropdown = Module.get('dropdown');

//*************************************
// Config wrapper for QueryAssist
//*************************************
  var QueryConfig = function (config) {
    if (!config) {
      throw new Error('QueryConfig: config is empty');
    }
    // default value && contants
    this.config = {
      COMPONENT_SELECTOR: '.ring-query',
      ITEM_SELECTOR: '.ring-query-el',
      MIN_LEFT_PADDING: 24,
      MIN_RIGHT_PADDING: 16,
      global: window
    };

    for(var item in config) {
      this.config[item] = config[item];
    }
  };
  QueryConfig.prototype.get = function (name) {
    if (!this.config.hasOwnProperty(name)) {
      throw new Error('QueryConfig: prop isn\'t exist');
    }
    return this.config[name];
  };

  QueryConfig.prototype.getDom = function (name) {
    $el = $(this.get(name));
    return $el;
  };

  QueryConfig.prototype.set = function (name, prop) {
    this.config[name] = prop;
    return this.config[name];
  };

  QueryConfig.prototype.getAll = function () {
    return this.config;
  };

//*************************************
// Init method
//*************************************
  var init = function (config) {
    var queryModule = Module.get('query'),
      queryConfig = new QueryConfig(config);

    $global = queryConfig.getDom('global');
    $el = queryConfig.getDom('el');

    dataSource = queryConfig.get('dataSource');
    COMPONENT_SELECTOR = queryConfig.get('COMPONENT_SELECTOR');
    ITEM_SELECTOR = queryConfig.get('ITEM_SELECTOR');
    MIN_LEFT_PADDING = queryConfig.get('MIN_LEFT_PADDING');
    MIN_RIGHT_PADDING = queryConfig.get('MIN_RIGHT_PADDING');

    _bindEvents($el);
    queryModule.trigger('init:done');
  };
//*************************************
// Destroy query container && trigger events
//*************************************
  var destroy = function () {
    var queryModule = Module.get('query');

    if (/*$queryContainer && */$query) {
      $query.remove();
      $query = null;
      queryModule.trigger('destroy:done');
      return true;
    } else {
      queryModule.trigger('destroy:fail');
      return false;
    }
  };
  var _startListen = function () {
    var queryModule = Module.get('query');

    lastTriggeredCaretPosition = undefined;
    lastPolledCaretPosition = undefined;
    timeoutHandler = setInterval(_pollCaretPosition, 250);
    queryModule.trigger('startListen:done');
  };
  var _stopListen = function () {
    var queryModule = Module.get('query');

    if (timeoutHandler) {
      clearInterval(timeoutHandler);
    }
    queryModule.trigger('stopListen:done');
  };

  var _bindEvents = function ($el) {
    var queryModule = Module.get('query');

    $el.bind('keypress', function (e) {
      if (e.which === 13) {
        e.preventDefault();
        queryModule.trigger('suggest:done');
        dropdown('hide');
      }
    });

    $el.bind('focus',function () {
      _startListen();
    }).bind('blur', function () {
        _stopListen();
      });
    $global.on('click', function (ev) {
      var target = $(ev.target);
      if (!target.is($el) && !target.closest().length) {
        destroy();
      }
    });
    if ($el.is(':focus')) {
      _stopListen();
    }
    $global.resize(destroy);
    queryModule.trigger('bindEvents:done');
  };
//*************************************
// polling caret position
//*************************************
  var _pollCaretPosition = function () {
    var queryModule = Module.get('query');

    var caret = $el.caret();
    var value = $el.text().replace(/\s/g, ' ');

    if (lastPolledCaretPosition !== caret || lastPolledValue !== value) {
      lastPolledCaretPosition = caret;
      lastPolledValue = value;
    } else if (value !== lastTriggeredValue) {
      lastTriggeredCaretPosition = caret;
      lastTriggeredValue = value;
      // Trigger event if value changed
      queryModule.trigger('delayedChange:done', {value: value, caret: caret});
      _doAssist(value, caret, true);
    } else if (caret !== lastTriggeredCaretPosition) {
      lastTriggeredCaretPosition = caret;
      lastTriggeredValue = value;
      // trigger event if just caret position changed
      queryModule.trigger('delayedCaretMove:done', {value: value, caret: caret});
      _doAssist(value, caret, false);
    }
  };
//*************************************
// init suggest handle
// @ToDo
// * render styleRanges
//*************************************
  var _doAssist = function (query, caret, requestHighlighting) {
    var queryModule = Module.get('query');
    if (query && caret) {
      dataSource(query, caret, requestHighlighting).then(function (data /* status, jqXHR*/) {
        // if data isn't exist hide a suggest container
        if (data.suggestions) {
          var dropdownData = {
            type: ['typed', 'bound']
          };
          dropdownData.items = _getHighlightText(data.suggestions);

          var coords = 0;
          dropdown('hide');
          dropdown('show', dropdownData, {
            left: coords.left - 98,
            width: 'auto',
            target: $el
          });

          queryModule.trigger('doAssist:done');
        } else {
          queryModule.trigger('hide:done');
          dropdown('hide');
        }
        // DEBUG CODE
        if (data.styleRanges) {
          $el.html(_getHighlightedHtml(data.styleRanges, query));
          _placeCaret($el.find('span').eq(data.caret - 1));
        }
      });
    } else {
//      _setContainerCoords(true);
    }
  };
//**************************************************************************
// Handle caret position in nested contenteditable element
// @param jQuery element
//**************************************************************************
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
//*************************************
// Return highlighted html
//*************************************
  var _getHighlightedHtml = function (styleRanges, text) {
    var result = '',
      i;
    var concatClasses = function (item) {
      var className = item ? 'ring-query-style_' + item : '';
      res = res + className + ' ';
    };

    for(i = 0; i < text.length; i += 1) {
      var res = '',
        data = _getClassname(styleRanges, text, i);

      data.forEach(concatClasses);
      result = result + '<span class="' + res.trim() + '">' + text[i] + '</span>';
    }
    return result;
  };
//*************************************
// get caret coords in abs value
// @ToDo
// * fix left rare error
//*************************************
//  var __getCoords = function () {
//    var sel = document.selection, range;
//    var x = 0, y = 0;
//    if (sel) {
//      if (sel.type !== 'Control') {
//        range = sel.createRange();
//        range.collapse(true);
//        x = range.boundingLeft;
//        y = range.boundingTop;
//      }
//    } else if (window.getSelection) {
//      sel = window.getSelection();
//      if (sel.rangeCount) {
//        range = sel.getRangeAt(0).cloneRange();
//        if (range.getClientRects) {
//          range.collapse(true);
//          var rect = range.getClientRects()[0];
//          x = rect.left;
//          y = rect.top;
//        }
//      }
//    }
//    return { left: x, top: y };
//  };
//*************************************
// Ajax get suggestion
//*************************************
  var remoteDataSource = function (remoteDataSourceConfig) {
    return function (query, caret, requestHighlighting) {

      var queryModule = Module.get('query'),
        defer = $.Deferred(),
        restUrl = remoteDataSourceConfig.url || '/rest/users/queryAssist?caret=#{caret}&fields=query,caret,suggestions#{styleRanges}&query=#{query}',
        substr = ['query', 'caret', 'styleRanges'],
        suggestArgs = [encodeURI(query), caret, (requestHighlighting ? ',styleRanges' : '')];

      substr.forEach(function (item, index) {
        restUrl = restUrl.replace('#{' + item  + '}', suggestArgs[index] ? suggestArgs[index] : '');
      });

      Module.get('auth')('ajax', restUrl).then(function (data, state, jqXHR) {
        queryModule.trigger('ajax:done', data);
        defer.resolve(data, state, jqXHR);
      }).fail(function () {
          defer.reject.apply(defer, arguments);
        });
      return defer.promise();
    };
  };
//*************************************
// get highlight text using suggest.matching{Start|End}
//*************************************
  var _getHighlightText = function (suggestions) {
    return $.isArray(suggestions) && suggestions.map(function (item) {
      var label = [];

      if (utils.isEmptyString(item.prefix)) {
        label.push(item.prefix);
      } else {
        label.push({
          label: item.prefix,
          type: 'service'
        });
      }

      if (item.option && item.matchingStart !== item.matchingEnd) {
        label.push(item.option.substring(0, item.matchingStart));
        label.push({
          label: item.option.substring(item.matchingStart, item.matchingEnd),
          type: 'highlight'
        });
        label.push(item.option.substring(item.matchingEnd));
      } else {
        label.push(item.option);
      }

      if (utils.isEmptyString(item.suffix)) {
        label.push(item.suffix);
      } else {
        label.push({
          label: item.suffix,
          type: 'service'
        });
      }

      return {
        label: label,
        type: item.description,
        event: {
          name: 'dropdown:assist',
          data: item
        }
      };
    }) || [];
  };
//*************************************
// autocomplete current text field
//*************************************
  var _handleSuggest = function (suggest) {
    var queryModule = Module.get('query'),
      text = $el.text(),
      str,
      prefix = text.substr(text.length - 1) === ' ' ? '' : suggest.prefix,
      subStr = prefix + suggest.option + suggest.suffix;

    if (suggest.matchingStart !== suggest.matchingEnd) {
      str = text.substr(0, suggest.completionStart) + subStr + text.substr(suggest.completionStart + subStr.length);
    } else {

      str = text + subStr;
    }
    _doAssist(str, str.length, true);
    queryModule.trigger('suggest:done');
  };

  dropdown.on('assist', _handleSuggest);

  Module.add('query', {
    init: {
      method: init,
      override: true
    },
    remoteDataSource: {
      method: remoteDataSource,
      override: true
    },
    destroy: {
      method: destroy,
      override: true
    }
  });
})
;