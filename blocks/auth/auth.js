/* jshint camelcase:false */
define(['jquery', 'jso', 'global/global__modules', 'global/global__utils'], function ($, jso, Module, utils) {
  'use strict';

  var module = 'auth';

  var defaultRedirectUri = (function () {
    var bases = $('base');
    var myBaseUrl;

    if (bases.length > 0) {
      myBaseUrl = bases[0].href;
    } else {
      myBaseUrl = window.location.protocol + '//' + window.location.host;
    }

    return myBaseUrl;
  }());

  var defaultId = '0-0-0-0-0';
  var defaultPath = '/api/rest/oauth2/auth';
  var absoluteUrlRE = /^[a-z]+:\/\//i;

  var serverUrl;
  var provider = 'hub';
  var jsoConfig = {};
  var defaultConfig = {
    scope: [defaultId],
    redirect_uri: defaultRedirectUri,
    client_id: defaultId
  };

  var CACHE_PERIOD = 30000;
  var cacheData = {};
  var cacheTime = {};

  var ajax = function (url, callback) {
    url = absoluteUrlRE.test(url) ? url : serverUrl + url;

    var cache = function (data) {
      cacheData[url] = data;
      cacheTime[url] = utils.now();
    };

    var dfd = $.oajax({url: url,
      jso_provider: provider,
      //TODO: use string scopes instead of ids
      jso_scopes: jsoConfig[provider].scope,
      jso_allowia: true,
      dataType: 'json',
      success: callback
     });

    if (utils.isDeferred(dfd)) {
      dfd.done(cache);
    }

    return dfd;
  };

  var get = function (url) {
    if (utils.now() - cacheTime[url] < CACHE_PERIOD) {
      return $.Deferred().resolve(cacheData[url]);
    } else {
      return ajax(url);
    }
  };

  var getToken = function (denyIA) {
    var token = jso.getToken(provider);

    if (token === null) {
      var ensure = {};
      ensure[provider] = jsoConfig[provider].scope;

      if (!denyIA) {
        jso.ensure(ensure);
      }
      return false;
    } else {
      return token;
    }
  };

  var init = function (config) {
    var dfd = $.Deferred();
    serverUrl = typeof config === 'string' ? config : config.serverUri;

    if (!serverUrl) {
      utils.log('Server URI is not defined!');
    } else {
      serverUrl = serverUrl.replace(/\/+$/, '');
    }

    jsoConfig[provider] = {authorization: serverUrl + defaultPath};

    var cfg = $.extend(jsoConfig[provider], defaultConfig);

    cfg.serverUrl = serverUrl;

    // TODO Check config props types
    if (config.clientId) {
      cfg.client_id = config.clientId;
    }

    if (config.redirectUri) {
      cfg.redirect_uri = config.redirectUri;
    }

    if (config.scope) {
      cfg.scope = config.scope;
    }

    if ($.inArray(defaultId, cfg.scope) === -1) {
      cfg.scope.push(defaultId);
    }

    // Configure jso
    jso.configure(jsoConfig, null, function (done, err) {
      if (err) {
        dfd.reject(err);

        // Authorize, if needed or resolve dfd
      } else if (getToken(config.denyIA)) {
        dfd.resolve(done);
      }
    });

    dfd.done(function () {
      Module.get(module).set({config: jsoConfig[provider]});
    });

    if (config.refresh) {
      dfd.done(setRefresh);
    }

    return dfd;
  };


  var POLL_INTERVAL = 30; // 30 ms
  var POLL_TIME = 60 * 1000; // 1 min

  var REFRESH_BEFORE = 20 * 60 * 1000; // 20 min
  var REFRESH_RETRY_INTERVAL = 2 * 60 * 1000; // 4 min

  var $iframe;
  var refreshDefer;

  var refreshTime = function (token) {
    return typeof token === 'string' ? token.split('.')[0] - REFRESH_BEFORE : utils.now() - 5000; // 5 seconds ago
  };

  var toBeRefreshed = function (token) {
    if (!token) {
      return true;
    }

    return utils.now() >= refreshTime(token);
  };

  var defaultUrlHandler = function (url) {
    window.location = url;
  };

  var refreshUrlHandler = function (url) {
    $iframe.attr('src', url + '&rnd=' + Math.random());
  };

  var setRefresh = function () {
    setTimeout(refresh.bind(null, true), refreshTime(getToken()) - utils.now());
  };

  var refresh = function (force) {
    var token = getToken(true);

    if (!force && refreshDefer && refreshDefer.state === 'pending') {
      return refreshDefer;
    }

    refreshDefer = $.Deferred();

    if (!force && !toBeRefreshed(token)) {
      return refreshDefer.resolve(token);
    }

    $iframe = $('<iframe style="display: none;"></iframe>').appendTo('body');

    var poll = function (time) {
      time = time || 0;
      var checkToken = getToken(true);

      if (token === checkToken && time < POLL_TIME) {
        return setTimeout(poll.bind(null, time + POLL_INTERVAL), POLL_INTERVAL);
      }

      if (token !== checkToken) {
        refreshDefer.resolve(checkToken);
      } else {
        refreshDefer.reject();
      }

      jso.setRedirect(defaultUrlHandler);
      $iframe.remove();
    };

    jso.setRedirect(refreshUrlHandler);

    poll();

    jso.authRequest(provider, jsoConfig[provider].scope);

    return refreshDefer
      .fail(function () {
        setTimeout(refresh.bind(null, true), REFRESH_RETRY_INTERVAL);
      })
      .done(setRefresh);
  };

  Module.add(module, {
    init: init,
    ajax: ajax,
    get: get,
    refresh: refresh,
    getToken: {
      method: getToken,
      override: true
    }
  });

  Module.get(module).on('logout', jso.wipe.bind(jso));
});