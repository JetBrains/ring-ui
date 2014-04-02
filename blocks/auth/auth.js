/* jshint camelcase:false */
define(['jquery', 'jso', 'global/global__modules', 'global/global__utils', 'auth/auth__storage'], function ($, jso, Module, utils, AuthStorage) {
  'use strict';

  var module = 'auth';

  /**
   * Default HUB params
   */
  var API_PATH = 'api/rest';
  var API_AUTH_PATH = API_PATH + '/oauth2/auth';
  var PROFILE_PATH = 'users/me';
  var API_PROFILE_PATH = API_PATH + '/' + PROFILE_PATH;

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

  var TOKEN_ACCESS_FIELD = 'access_token';
  var TOKEN_EXPIRE_FIELD = 'expires';

  var absoluteUrlRE = /^[a-z]+:\/\//i;
  var endsWithSlashOrEmptyRE = /^(.+\/)?$/;

  var INVALID_TOKEN_ERR = 'invalid_grant';
  var INVALID_REQUEST_ERR = 'invalid_request';

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

  /**
   * Register custom storage
   */
  jso.registerStorageHandler(new AuthStorage({
    stateStoragePrefix: 'hub-state-',
    tokensStoragePrefix: 'hub-tokens-'
  }));

  /**
   * Authorized ajax call
   *
   * @param {string} url
   * @param {Function} callback
   * @returns {$.Deferred}
   */
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

    cacheTime[url] = $.now();
    cacheData[url] = dfd;

    // Refresh invalid token
    if (utils.isDeferred(dfd)) {
      dfd.fail(function(response) {
        var errorCode;
        try {
          errorCode = (response.responseJSON || $.parseJSON(response.responseText)).error;
        } catch(e) {}

        if(errorCode === INVALID_TOKEN_ERR || errorCode === INVALID_REQUEST_ERR) {
          jso.wipe();
          getToken();
        }
      });
    }

    return dfd;
  };

  /**
   * Authorized and cached ajax call
   *
   * @param {string} url
   * @returns {$.Deferred}
   */
  var get = function (url) {
    if ($.now() - cacheTime[url] < CACHE_PERIOD) {
      return cacheData[url];
    } else {
      return ajax(url);
    }
  };

  /**
   * Token getter
   * @param {boolean} denyIA
   * @param {boolean} withProps
   * @returns {string|Object}
   */
  var getToken = function (denyIA, withProps) {
    var token = jso.getToken(provider);

    if (token === null) {
      var ensure = {};

      if (!denyIA && jsoConfig[provider]) {
        ensure[provider] = jsoConfig[provider].scope;
        jso.ensure(ensure);
      }
      return false;
    } else {
      return withProps ? token : token[TOKEN_ACCESS_FIELD];
    }
  };

  /**
   * Init auth module
   * @param {Object} config
   * @returns {$.Deferred}
   */
  var init = function (config) {
    var dfd = $.Deferred();
    serverUrl = typeof config === 'string' ? config : config.serverUri;

    if (typeof serverUrl !== 'string') {
      utils.log('Server URI is not defined!');
      return dfd.reject();
    }

    if (!serverUrl.match(endsWithSlashOrEmptyRE)) {
      serverUrl += '/';
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
        // Validate token
        get(API_PROFILE_PATH).done(function() {
          dfd.resolve(done);
        });
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

  /**
   *  Refreshing token
   */
  var POLL_INTERVAL = 30; // 30 ms
  var POLL_TIME = 60 * 1000; // 1 min

  var REFRESH_BEFORE = 20 * 60 * 1000; // 20 min
  var REFRESH_RETRY_INTERVAL = 2 * 60 * 1000; // 4 min

  var $iframe;
  var refreshDefer;

  var refreshTime = function (token) {
    return token[TOKEN_EXPIRE_FIELD] ? token[TOKEN_EXPIRE_FIELD] * 1000 - REFRESH_BEFORE : $.now() - 5000; // 5 seconds ago
  };

  var toBeRefreshed = function (token) {
    if (!token) {
      return true;
    }

    return $.now() >= refreshTime(token);
  };

  var defaultUrlHandler = function (url) {
    window.location = url;
  };

  var refreshUrlHandler = function (url) {
    $iframe.attr('src', url + '&rnd=' + Math.random());
  };

  var setRefresh = function () {
    setTimeout(refresh.bind(null, true), refreshTime(getToken(true, true)) - $.now());
  };

  var refresh = function (force) {
    var token = getToken(true, true);
    var tokenAccess = token[TOKEN_ACCESS_FIELD];

    if (!force && refreshDefer && refreshDefer.state === 'pending') {
      return refreshDefer;
    }

    refreshDefer = $.Deferred();

    if (!force && !toBeRefreshed(token)) {
      return refreshDefer.resolve(tokenAccess);
    }

    $iframe = $('<iframe style="display: none;"></iframe>').appendTo('body');

    var poll = function (time) {
      time = time || 0;
      var checkToken = getToken(true);

      if (tokenAccess === checkToken && time < POLL_TIME) {
        return setTimeout(poll.bind(null, time + POLL_INTERVAL), POLL_INTERVAL);
      }

      if (tokenAccess !== checkToken) {
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

  /**
   * Register module
   */
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