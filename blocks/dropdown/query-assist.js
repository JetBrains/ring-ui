define(['jquery', 'global/global__views', 'global/global__modules', 'auth/auth', 'jquery-caret'], function ($, View, Module) {
  'use strict';

  var $el,
    $query,
    $queryContainer,
    url,
    $global = $(window),
    timeoutHandler,
    lastPolledCaretPosition,
    lastTriggeredCaretPosition,
    lastPolledValue,
    lastTriggeredValue;

  var init = function (config) {
    $el = $(config.el);
    url = config.url;

    $queryContainer = $(View.render('query-containter'));
    $queryContainer.css('top', $el.offset().top + 24);
    $queryContainer.css('left', $el.offset().left);
    $queryContainer.appendTo('body');

    $el.bind('focus', function () {
      _startListen();
    });

    $el.bind('blur', function () {
      _stopListen();
    });
    $global.on('click', function (ev) {
      var target = $(ev.target);
      if(!target.is($el) && !target.closest('.ring-query').length) {
        destroy();
      }
    });

    if($el.is(':focus')) {
      _stopListen();
    }

  };

  var destroy = function () {
    if($queryContainer) {
      $queryContainer.remove();
      $queryContainer = null;

      if($query) {
        $query.remove();
        $query = null;
      }
      Module.get('query').trigger('hide:done');
      return true;
    } else {
      Module.get('query').trigger('hide:fail');
      return false;
    }
  };
  var _doAssist = function (query, caret, requestHighlighting) {
    if(query && caret) {

      _getSuggestion.call(null, query, caret, requestHighlighting).then(function (data /* status, jqXHR*/) {
        if($query) {
          $query.remove();
        }

        if(data.query === $el.text()) {
          $query = $(View.render('query', data));
          _setContainerCoords();
          $queryContainer.html($query).show();
          if(data.suggestions) {
            $query.on('click', '.ring-query-el', function (ev) {
              var target = $(ev.currentTarget),
                suggestIndex = target.data('suggestIndex');
              _handleSuggest(data.suggestions[suggestIndex]);
            });
          } else {
            $query.remove();
            $queryContainer.hide();
          }
        }
        if(data.styleRanges) {
          //@ToDo render styleRanges
        }

      });
    }
  };

  var _setContainerCoords = function () {
    var coords = _getCoords();
    $queryContainer.css('top', coords.top + 24);
    $queryContainer.css('left', coords.left);
  };

  var _getCoords = function () {
    var sel = document.selection, range;
    var x = 0, y = 0;
    if(sel) {
      if(sel.type !== 'Control') {
        range = sel.createRange();
        range.collapse(true);
        x = range.boundingLeft;
        y = range.boundingTop;
      }
    } else if(window.getSelection) {
      sel = window.getSelection();
      if(sel.rangeCount) {
        range = sel.getRangeAt(0).cloneRange();
        if(range.getClientRects) {
          range.collapse(true);
          var rect = range.getClientRects()[0];
          x = rect.left;
          y = rect.top;
        }
      }
    }
    return { left: x, top: y };
  };

  var _getSuggestion = function (query, caret, requestHighlighting) {
    var defer = $.Deferred(),
      restUrl = url;
    if(url) {
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

  var _handleSuggest = function (suggest) {
    var text = $el.text(),
      str,
      prefix = text.substr(text.length - 1) === ' ' ? '' : suggest.prefix,
      subStr = prefix + suggest.option + suggest.suffix;

    if(suggest.matchingStart !== suggest.matchingEnd) {
      str = text.substr(0, suggest.completionStart) + subStr + text.substr(suggest.completionStart + subStr.length);
    } else {
      str = text + subStr;

    }
    $el.text(str).focus().caret(suggest.caret);
  };

  var pollCaretPosition = function () {
    var caret = $el.caret();
    var value = $el.text();

    if(lastPolledCaretPosition !== caret || lastPolledValue !== value) {
      lastPolledCaretPosition = caret;
      lastPolledValue = value;
    } else if(value !== lastTriggeredValue) {
      lastTriggeredCaretPosition = caret;
      lastTriggeredValue = value;
      Module.get('query').trigger('delayedChange:done', {value: value, caret: caret});
      _doAssist.call(null, value, caret, true);
    } else if(caret !== lastTriggeredCaretPosition) {
      lastTriggeredCaretPosition = caret;
      lastTriggeredValue = value;
      Module.get('query').trigger('delayedCaretMove:done', {value: value, caret: caret});
      _doAssist.call(null, value, caret, true);
    }
  };

  var _startListen = function () {
    lastTriggeredCaretPosition = undefined;
    lastPolledCaretPosition = undefined;
    timeoutHandler = setInterval(pollCaretPosition, 250);
  };
  var _stopListen = function () {
    if(timeoutHandler) {
      clearInterval(timeoutHandler);
    }
  };

  $global.resize(destroy);

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
});