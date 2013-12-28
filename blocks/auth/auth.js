/* jshint camelcase:false */
define(['jquery', 'jso', 'global/global__modules', 'global/global__utils'], function ($, jso, Module, utils) {
  'use strict';

  var module = 'auth';

  var API_PATH = 'api/rest';
  var API_AUTH_PATH = API_PATH + '/oauth2/auth';
  var PROFILE_PATH = '/users/me';
  var API_PROFILE_PATH = API_PATH + PROFILE_PATH;

  var DEFAULT_ID = '0-0-0-0-0';
  var DEFAULT_REDIRECT_URI = (function () {
    var bases = $('base');
    var myBaseUrl;

    if (bases.length > 0) {
      myBaseUrl = bases[0].href;
    } else {
      myBaseUrl = window.location.protocol + '//' + window.location.host;
    }

    return myBaseUrl;
  }());

  var absoluteUrlRE = /^[a-z]+:\/\//i;

  var INVALID_TOKEN_ERR = 'invalid_grant';
  var INVALID_SCOPE_ERR = 'invalid_scope';

  var serverUrl;
  var provider = 'hub';
  var jsoConfig = {};
  var defaultConfig = {
    scope: [DEFAULT_ID],
    redirect_uri: DEFAULT_REDIRECT_URI,
    client_id: DEFAULT_ID
  };

  var CACHE_PERIOD = 30000;
  var cacheData = {};
  var cacheTime = {};

  var ajax = function (url, callback) {
    var absoluteUrl = absoluteUrlRE.test(url) ? url : serverUrl + url;

    var dfd = $.oajax({url: absoluteUrl,
      jso_provider: provider,
      //TODO: use string scopes instead of ids
      jso_scopes: jsoConfig[provider].scope,
      jso_allowia: true,
      dataType: 'json',
      success: callback
     });

    cacheTime[url] = utils.now();
    cacheData[url] = dfd;

    // Refresh invalid token
    if (utils.isDeferred(dfd)) {
      dfd.fail(function(err) {
        var errorCode = err && err.responseJSON && err.responseJSON.error;

        if(errorCode === INVALID_TOKEN_ERR || errorCode === INVALID_SCOPE_ERR) {
          jso.wipe();
          getToken();
        }
      });
    }

    return dfd;
  };

  var get = function (url) {
    if (utils.now() - cacheTime[url] < CACHE_PERIOD) {
      return cacheData[url];
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
    }

    jsoConfig[provider] = {authorization: serverUrl + API_AUTH_PATH};

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

    if ($.inArray(DEFAULT_ID, cfg.scope) === -1) {
      cfg.scope.push(DEFAULT_ID);
    }

    // Configure jso
    jso.configure(jsoConfig, null, function (done, err) {
      if (err) {
        dfd.reject(err);

        // Authorize, if needed or resolve dfd
      } else if (getToken(config.denyIA)) {
        dfd.resolve(done);

        // Validate token
        get(API_PROFILE_PATH);
      }
    });

    dfd.done(function () {
      var config = $.extend({}, jsoConfig[provider], {
        apiPath: API_PATH,
        apiProfilePath: API_PROFILE_PATH,
        profilePath: cfg.serverUrl + PROFILE_PATH,
        logoutPath: cfg.serverUrl + API_PATH + '/cas/logout?gateway=true&url=' + encodeURIComponent(cfg.redirect_uri)
      });

      Module.get(module).set({config: config});
    });

    if (config.refresh) {
      dfd.done(setRefresh);
    }

    return dfd;
  };

  // Refreshing token
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
    },
    getUser: {
      method: function () {
        return get(API_PROFILE_PATH);
      },
      override: true
    }
  });

  Module.get(module).on('logout', jso.wipe.bind(jso));
});