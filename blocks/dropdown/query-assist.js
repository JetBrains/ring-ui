define(['jquery', 'global/global__views', 'global/global__modules', 'auth/auth', 'jquery-caret'], function ($, View, Module) {
  'use strict';

  var $el,
    $query,
    $queryContainer,
    url,
    $global,
    timeoutHandler,
    lastPolledCaretPosition,
    lastTriggeredCaretPosition,
    lastPolledValue,
    lastTriggeredValue,
    COMPONENT_SELECTOR,
    MIN_LEFT_PADDING,
    MIN_RIGHT_PADDING;

//*************************************
// Config wrapper for QueryAssist'а
//*************************************
  var QueryConfig = function (config) {
    if (!config) {
      throw new Error('QueryConfig: config is empty');
    }
    // default value && contants
    this.config = {
      COMPONENT_SELECTOR: '.ring-query',
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
// @ToDo
// * trigger method events
//*************************************
  var init = function (config) {
    var queryConfig = new QueryConfig(config);
    $global = queryConfig.getDom('global');
    $el = queryConfig.getDom('el');
    url = queryConfig.get('url');
    COMPONENT_SELECTOR = queryConfig.get('COMPONENT_SELECTOR');
    MIN_LEFT_PADDING = queryConfig.get('MIN_LEFT_PADDING');
    MIN_RIGHT_PADDING = queryConfig.get('MIN_RIGHT_PADDING');

    $queryContainer = $(View.render('query-containter'));
    $queryContainer.appendTo('body');

    _bindEvents($el);
  };
//*************************************
// Destroy query container && trigger events
// @ToDo
// * cache Module
//*************************************
  var destroy = function () {
    if ($queryContainer && $query) {
      $query.remove();
      $query = null;
      Module.get('query').trigger('hide:done');
      return true;
    } else {
      Module.get('query').trigger('hide:fail');
      return false;
    }
  };
  var _startListen = function () {
    lastTriggeredCaretPosition = undefined;
    lastPolledCaretPosition = undefined;
    timeoutHandler = setInterval(pollCaretPosition, 250);
  };
  var _stopListen = function () {
    if (timeoutHandler) {
      clearInterval(timeoutHandler);
    }
  };

  var _bindEvents = function ($el) {
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
  };
//*************************************
// polling caret position
// @ToDo
// * fix _doAssist call (requestHighlighting)
//*************************************
  var pollCaretPosition = function () {
    var caret = $el.caret();
    var value = $el.text();

    if (lastPolledCaretPosition !== caret || lastPolledValue !== value) {
      lastPolledCaretPosition = caret;
      lastPolledValue = value;
    } else if (value !== lastTriggeredValue) {
      // Trigger event if value changed
      lastTriggeredCaretPosition = caret;
      lastTriggeredValue = value;
      Module.get('query').trigger('delayedChange:done', {value: value, caret: caret});
      _doAssist.call(null, value, caret, true);
    } else if (caret !== lastTriggeredCaretPosition) {
      // trigger event if just caret position changed
      lastTriggeredCaretPosition = caret;
      lastTriggeredValue = value;
      Module.get('query').trigger('delayedCaretMove:done', {value: value, caret: caret});
      _doAssist.call(null, value, caret, true);
    }
  };
//*************************************
// init suggest handle
// @ToDo
// * decompose (event binding)
// * use constants for DOM entities
// * render styleRanges
//*************************************
  var _doAssist = function (query, caret, requestHighlighting) {
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


            $query = $(View.render('query', data));
            $queryContainer.html($query).show();
            $query.on('click', '.ring-query-el', function (ev) {
              var target = $(ev.currentTarget),
                suggestIndex = target.data('suggestIndex');
              $query.remove();
              _handleSuggest(data.suggestions[suggestIndex]);
            });
            _setContainerCoords();
          } else {
            $query.remove();
            $queryContainer.hide();
          }
        }

      });
    } else {
      _setContainerCoords(true);
    }
  };
//*************************************
// Position the suggestion for ring-query__container.
// @ToDo
// * detect && fix rare error "left isn't exist"
// * comment && refactor code
//*************************************
// init - set position for el "by default"
  var _setContainerCoords = function (init) {
    // get caret coords in abs value
    var coords = __getCoords(),
      top,
      left;
    if (!init && (coords.left - 98 > MIN_LEFT_PADDING)) {
      top = coords.top + 18;
      left = coords.left - 98;

      if (left + $queryContainer.width() > $global.width() - MIN_RIGHT_PADDING) {
        left = $global.width() - MIN_RIGHT_PADDING - $queryContainer.width();
      }
    } else {
      top = $el.offset().top + 21;
      left = $el.offset().left;
    }
    $queryContainer.css({
      top: parseInt(top, 10),
      left: left
    });
  };
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
// @ToDo
// * Module event trigger
//*************************************
  var _getSuggestion = function (query, caret, requestHighlighting) {
    var defer = $.Deferred(),
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
// @ToDo
// * trigger module events
//*************************************
  var _handleSuggest = function (suggest) {

    var text = $el.text(),
      str,
      prefix = text.substr(text.length - 1) === ' ' ? '' : suggest.prefix,
      subStr = prefix + suggest.option + suggest.suffix;
    if (suggest.matchingStart !== suggest.matchingEnd) {
      str = text.substr(0, suggest.completionStart) + subStr + text.substr(suggest.completionStart + subStr.length);
    } else {

      str = text + subStr;
    }
    $el.text(str).focus().caret(suggest.caret);
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