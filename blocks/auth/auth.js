/* jshint camelcase:false */
define(['jquery', 'jso', 'global/global__modules', 'global/global__utils', 'auth/auth__storage'], function ($, jso, Module, utils, AuthStorage) {
  'use strict';

  var module = 'auth';
  var absoluteUrlRE = /^[a-z]+:\/\//i;
  var endsWithSlashOrEmptyRE = /^(.+\/)?$/;

  /**
   * Default HUB params
   */
  var API_PATH = 'api/rest';
  var API_AUTH_PATH = API_PATH + '/oauth2/auth';
  var PROFILE_PATH = 'users/me';
  var API_PROFILE_PATH = API_PATH + '/' + PROFILE_PATH;

  var DEFAULT_ID = '0-0-0-0-0';
  var DEFAULT_REDIRECT_URI = (function () {
    var baseUrl = $('base').prop('href'); // unlike attr prop returns correct value *with* leading slash
    var host = window.location.protocol + '//' + window.location.host;
    var defaultRedirectURI;

    if (baseUrl) {
      defaultRedirectURI = absoluteUrlRE.test(baseUrl) ? baseUrl : host + baseUrl;
    } else {
      defaultRedirectURI = host;
    }

    return defaultRedirectURI;
  }());

  var TOKEN_ACCESS_FIELD = 'access_token';
  var TOKEN_EXPIRE_FIELD = 'expires';

  var INVALID_TOKEN_ERR = 'invalid_grant';
  var INVALID_REQUEST_ERR = 'invalid_request';

  var initFuture = $.Deferred();
  var initStarted = false;

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
    var dfd;
    var absoluteUrl = absoluteUrlRE.test(url) ? url : serverUrl + url;

    try {
      dfd = $.oajax({url: absoluteUrl,
        jso_provider: provider,
        //TODO: use string scopes instead of ids
        jso_scopes: jsoConfig[provider].scope,
        jso_allowia: !jsoConfig[provider].denyIA,
        dataType: 'json',
        success: callback
       });
    } catch(e) {
      return $.Deferred().reject(e);
    }

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
          ensure();
        }
      });
    } else {
      dfd = $.Deferred().reject();
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
   * Ensure tokens
   * @returns {*}
   */
  var ensure = function(denyIA) {
    // Don't send auth request when it's denied or init didn't start
    if (denyIA || !initStarted) {
      return false;
    }

    var ensure = {};

    if (jsoConfig[provider]) {
      ensure[provider] = jsoConfig[provider].scope;
      return jso.ensure(ensure);
    }

    return false;
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
      return ensure(denyIA);
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
    initStarted = true;

    serverUrl = typeof config === 'string' ? config : config.serverUri;

    if (typeof serverUrl !== 'string') {
      return initFuture.reject();
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

    if (config.denyIA) {
      cfg.denyIA = config.denyIA;
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
        initFuture.reject(err);

      } else {
        // If there is token accomplish auth
        // Otherwise auth request will be sent
        if (getToken(config.denyIA)) {
          if (done) {
            initFuture.resolve(done);
          } else {
            // Validate token if it's from storage
            get(API_PROFILE_PATH).done(function() {
              initFuture.resolve();
            });
          }
        }
      }
    });

    initFuture.done(function () {
      var config = $.extend({}, jsoConfig[provider], {
        apiPath: API_PATH,
        apiProfilePath: API_PROFILE_PATH,
        profilePath: cfg.serverUrl + PROFILE_PATH,
        logoutPath: cfg.serverUrl + API_PATH + '/cas/logout?gateway=true&url=' + encodeURIComponent(cfg.redirect_uri)
      });

      Module.get(module).set({config: config});
    });

    if (config.refresh) {
      initFuture.done(setRefresh);
    }

    return initFuture;
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

    if (!force && refreshDefer && refreshDefer.state() === 'pending') {
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

      if (checkToken && tokenAccess === checkToken && time < POLL_TIME) {
        return setTimeout(poll.bind(null, time + POLL_INTERVAL), POLL_INTERVAL);
      }

      if (checkToken && tokenAccess !== checkToken) {
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
        return initFuture.then(function() {
          return get(API_PROFILE_PATH);
        });
      },
      override: true
    }
  });

  Module.get(module).on('logout', jso.wipe.bind(jso));
});