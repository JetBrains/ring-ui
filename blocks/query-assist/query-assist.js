define(['jquery', 'global/global__views', 'global/global__modules', 'dropdown/dropdown', 'auth/auth', 'jquery-caret'], function ($, View, Module) {
  'use strict';

  var $el,
    $query,
//    $queryContainer,
    url,
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

    for (var item in config) {
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
    url = queryConfig.get('url');
    COMPONENT_SELECTOR = queryConfig.get('COMPONENT_SELECTOR');
    ITEM_SELECTOR = queryConfig.get('ITEM_SELECTOR');
    MIN_LEFT_PADDING = queryConfig.get('MIN_LEFT_PADDING');
    MIN_RIGHT_PADDING = queryConfig.get('MIN_RIGHT_PADDING');

//    $queryContainer = $(View.render('query-containter'));
//    $queryContainer.appendTo('body');

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
        destroy();
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
// @ToDo
// * styleRanges (requestHighlighting arg)
//*************************************
  var _pollCaretPosition = function () {
    var queryModule = Module.get('query');

    var caret = $el.caret();
    var value = $el.text();

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
      _getSuggestion.call(null, query, caret, requestHighlighting).then(function (data /* status, jqXHR*/) {
        // Reset previously suggestions
        if ($query) {
          $query.remove();
        }
        // do js little bit more consistent
        if (data.query === $el.text()) {
          // if data isn't exist hide a suggest container
          if (data.suggestions) {
            data.suggestions = _getHighlightText(data.suggestions);

            $query = $(View.render('query-assist', data));
//            $queryContainer.html($query).show();
            var coords = __getCoords();
            dropdown('hide');
            dropdown('show', $query.html(), {
              left: coords.left - 98,
              width: 'auto',
              target: $el
            });

            queryModule.trigger('doAssist:done');

            _bindItemEvents($query, data);
//            _setContainerCoords();
          } else {
            queryModule.trigger('hide:done');
//            $query.remove();
            dropdown('hide');
//            $queryContainer.hide();
          }
          // DEBUG CODE FOR WEEKEND WORK
          if (data.styleRanges) {
            var text = $el.text(),
              res = '';

            data.styleRanges.forEach(function (str) {

              res = res + '<span class="' +
                str.style +
                '">' + text.substr(str.start, str.length + 1) +
                '</span>';


            });
            console.log(res);
          }
        }

      });
    } else {
//      _setContainerCoords(true);
    }
  };
//*************************************
// Event binding for ITEM in COMPONENT
//*************************************
  var _bindItemEvents = function ($query, data) {
    $query.on('click', ITEM_SELECTOR, function (ev) {
      var target = $(ev.currentTarget),
        suggestIndex = target.data('suggestIndex');
      // reset current suggestion
      $query.remove();
      // add new suggestion
      _handleSuggest(data.suggestions[suggestIndex]);
    });
  };
//*************************************
// Position the suggestion for ring-query__container.
// @ToDo
// * detect && fix rare error "left isn't exist"
// * comment && refactor code
//*************************************
// init - set position for el "by default"
//  var _setContainerCoords = function (init) {
//    // get caret coords in abs value
//    var coords = __getCoords(),
//      top,
//      left;
//    if (!init && (coords.left - 98 > MIN_LEFT_PADDING)) {
//      top = coords.top + 18;
//      left = coords.left - 98;
//
//      if (left + $queryContainer.width() > $global.width() - MIN_RIGHT_PADDING) {
//        left = $global.width() - MIN_RIGHT_PADDING - $queryContainer.width();
//      }
//    } else {
//      top = $el.offset().top + 21;
//      left = $el.offset().left;
//    }
//    $queryContainer.css({
//      top: parseInt(top, 10),
//      left: left
//    });
//  };
//*************************************
// get caret coords in abs value
// @ToDo
// * fix left rare error
//*************************************
  var __getCoords = function () {
    var sel = document.selection, range;
    var x = 0, y = 0;
    if (sel) {
      if (sel.type !== 'Control') {
        range = sel.createRange();
        range.collapse(true);
        x = range.boundingLeft;
        y = range.boundingTop;
      }
    } else if (window.getSelection) {
      sel = window.getSelection();
      if (sel.rangeCount) {
        range = sel.getRangeAt(0).cloneRange();
        if (range.getClientRects) {
          range.collapse(true);
          var rect = range.getClientRects()[0];
          x = rect.left;
          y = rect.top;
        }
      }
    }
    return { left: x, top: y };
  };
//*************************************
// Ajax get suggestion
//*************************************
  var _getSuggestion = function (query, caret, requestHighlighting) {
    var queryModule = Module.get('query'),
      defer = $.Deferred(),
      restUrl = url;

    if (url) {
      var substr = ['query', 'caret', 'styleRanges'],
        suggestArgs = [encodeURI(query), caret, (requestHighlighting ? ',styleRanges' : '')];

      substr.forEach(function (item, index) {
        restUrl = restUrl.replace('#{' + item  + '}', suggestArgs[index] ? suggestArgs[index] : '');
      });
    } else {
      restUrl = '/rest/users/queryAssist?caret=' + caret + '&fields=query,caret,suggestions' + (requestHighlighting ? ',styleRanges' : '') + '&query=' + encodeURI(query);
    }
    Module.get('auth')('ajax', restUrl).then(function (data, state, jqXHR) {
      queryModule.trigger('ajax:done');
      defer.resolve(data, state, jqXHR);
    });
    return defer.promise();
  };
//*************************************
// get highlight text using suggest.matching{Start|End}
//*************************************
  var _getHighlightText = function (suggestions) {
    suggestions.forEach(function (item, index) {
      var val = item.option + item.suffix,
        res = val;

      if (item.matchingStart !== item.matchingEnd) {
        res = '<span class="selection">' + val.substr(item.matchingStart, item.matchingEnd) + '</span>' +
          '<span>' + val.substr(item.matchingEnd, val.length) + '</span>';
      }
      suggestions[index].text = res;
    });
    return suggestions;
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
    $el.text(str).focus().caret(suggest.caret);
    queryModule.trigger('suggest:done');
  };

  Module.add('query', {
    init: {
      method: init,
      override: true
    },
    destroy: {
      method: destroy,
      override: true
    }
  });
})
;