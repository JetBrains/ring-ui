define(['jquery', 'handlebars', 'font-icon/font-icon'], function($, Handlebars) {
  'use strict';

  var $body;
  var data;
  var html;
  var cb;
  var processors = [];

  var $global = $(window);
  var SELECTOR_PREFIX = '.ring-';
  var template = 'full-header'; // Default template

  var init = function(initData, dontWaitDom, initCb) {
    if (typeof initCb === 'function') {
      cb = initCb;
    }

    data = initData || data;

    if (!dontWaitDom) {
      $(initHtml);
    } else {
      bodyReady(initHtml);
    }
  };

  var bodyReady = function bodyReady(cb) {
    $body = $('body');

    if ($body[0]) {
      cb();
    } else {
      setTimeout(function() {
        bodyReady(cb);
      }, 10);
    }
  };

  var addProcessor = function(processor) {
    if (typeof processor === 'function') {
      processors.push(processor);
    }
  };

  var render = function(template, data) {
    return Handlebars.partials[template](data);
  };

  var initHtml = function() {
    while (processors[0]) {
      data = processors.shift()(data);
    }

    updateHtml();
  };

  var updateHtml = function(clean) {
    if (!data) {
      return false;
    }

    if (!$body) {
      $body = $('body');
    }

    html = render(template, data);
    if (html) {
      if (clean) {
        clean();
      }

      if ($body[0].firstChild) {
        $body.prepend(html);
      } else {
        $body.append(html);
      }

      $global.trigger('ring:header:updated');

      if (cb) {
        cb();
      }

      return true;
    } else {
      return false;
    }

  };

  var update = function(path, value) {
    var part;
    var newData = {};
    var pathParts = path.split('.');

    while ((part = pathParts.pop())) {
      if (isNaN(Number(part))) {
        newData = {};
      } else {
        newData = [];
      }
      newData[part] = value;
      value = newData;
    }

    $.extend(true, data, newData);

    return updateHtml(function() {
      $(SELECTOR_PREFIX + template).remove();
    });
  };

  return {
    init: init,
    update: update,
    render: render,
    addProcessor: addProcessor
  };

});