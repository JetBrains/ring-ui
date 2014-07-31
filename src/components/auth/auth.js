'use strict';

var jso = require('jso');
var $ = require('jquery');

/**
 * @class
 *
 * @prop {object} config
 * @prop {string} config.serverUri
 * @prop {string} config.redirect_uri
 * @prop {string} config.client_id
 * @prop {string[]} config.scope
 * @prop {string} profileUrl
 * @prop {string} logoutUrl
 * @prop {User?} user
 * @prop {bool} _isTokenInited
 *
 * @param {{
 *   serverUri: string,
 *   redirect_uri: string?,
 *   client_id: string?,
 *   scope: string[]?
 * }} config
 */
var Auth = function (config) {
  if (config.serverUri) {
    throw Error('Property serverUri is required');
  }

  this.config = $.extend({}, Auth.DEFAULT_CONFIG, config);
  this._isTokenInited = false;

  if (this.config.serverUri.length === 0 || this.config.serverUri.charAt(config.serverUri.length - 1) !== '/') {
    this.config.serverUri += '/';
  }

  if ($.inArray(Auth.DEFAULT_CONFIG.client_id, this.config.scope) === -1) {
    this.config.scope.push(Auth.DEFAULT_CONFIG.client_id);
  }

  var jsoConfig = {};
  jsoConfig[Auth.PROVIDER] = $.extend({
    authorization: this.config.serverUri + Auth.API_AUTH_PATH
  }, this.config);

  this.profileUrl = this.config.serverUri + 'users/me';
  this.logoutUrl = this.config.serverUri + Auth.API_PATH + '/cas/logout?gateway=true&url=' + encodeURIComponent(this.config.redirect_uri);

  jso.configure(jsoConfig);
};

/**
 * @const
 * @type {RegExp}
 */
Auth.ABSOLUTE_URL_PATTERN = /^[a-z]+:\/\//i;

/**
 * @const
 * @type {{client_id: string, redirect_uri: string, scope: string[]}}
 */
Auth.DEFAULT_CONFIG = {
  client_id: '0-0-0-0-0',
  redirect_uri: (function () {
    var baseUrl = $('base').prop('href'); // unlike attr prop returns correct value *with* leading slash
    var host = window.location.protocol + '//' + window.location.host;

    var uri;
    if (baseUrl) {
      uri = Auth.ABSOLUTE_URL_PATTERN.test(baseUrl) ? baseUrl : host + baseUrl;
    } else {
      uri = host;
    }

    return uri;
  }()),
  scope: []
};

/**
 * @const
 * @type {string}
 */
Auth.PROVIDER = 'hub';

/**
 * @const
 * @type {string}
 */
Auth.API_PATH = 'api/rest';

/**
 * @const
 * @type {string}
 */
Auth.API_AUTH_PATH = Auth.API_PATH + '/oauth2/auth';

/**
 * @const
 * @type {string}
 */
Auth.API_PROFILE_PATH = Auth.API_PATH + '/users/me';

/**
 * @const
 * @type {number}
 */
Auth.REFRESH_BEFORE = 20 * 60 * 1000; // 20 min


/**
 * Checks if there is a valid token in the storage.
 * If there is no token redirect to auth page.
 *
 * @private
 * @return {Promise.<string>}
 */
Auth.prototype._interactiveEnsureToken = function () {
  var tokenDeffered = $.Deferred();

  var ensureConfig = {};
  ensureConfig[Auth.PROVIDER] = [];
  if (jso.ensure(ensureConfig)) {
    var accessToken = jso.getToken(Auth.PROVIDER).access_token;

    // Validate token
    this.getUser().done(function () {
      tokenDeffered.resolve(accessToken);
    });
  } else {
    // This is unexpected as jso.ensure() redirect to auth page when it is false
    tokenDeffered.reject();
  }

  return tokenDeffered.promise();
};

/**
 *
 * @param {object?} token
 * @return {boolean}
 * @private
 */
var _hasToBeRefreshed = function (token) {
  if (!token) {
    return true;
  }

  if (!token.expires) {
    return true;
  }

  var refreshTime = token.expires * 1000 - Auth.REFRESH_BEFORE;
  return $.now() >= refreshTime;
};

/**
 * Redirects current page to the given URL
 * @param url
 */
Auth.prototype.defaultRedirectHandler = function (url) {
  window.location = url;
};

/**
 * Creates function that redirects given $iframe to the parameter url
 * @param $iframe
 * @return {function(string)}
 */
Auth.prototype.createFrameRedirectHandler = function ($iframe) {
  return function (url) {
    $iframe.attr('src', url + '&rnd=' + Math.random());
  };
};

/**
 * Refreshes access token in iFrame.
 * @return {Promise.<string>}
 * @private
 */
Auth.prototype._nonInteractiveEnsureToken = function () {
  if (this._refreshDefer && this._refreshDefer.state === 'pending') {
    return this._refreshDefer.promise();
  }
  this._refreshDefer = $.Deferred();

  var oldToken = jso.getToken(Auth.PROVIDER);
  var oldAccessToken = oldToken && oldToken.access_token;

  if (!_hasToBeRefreshed(oldToken)) {
    this._refreshDefer.resolve(oldAccessToken);
    return this._refreshDefer.promise();
  }

  var $iframe = $('<iframe style="display: none;"></iframe>').appendTo('body');

  var _isTokenRefreshed = function (newAccessToken) {
    return newAccessToken && newAccessToken !== oldAccessToken;
  };

  var _this = this;

  var REFRESH_POLL_INTERVAL = 30;
  var REFRESH_POLL_MAX_ATTEMPTS = 2000;
  var pollAttempt = 0;
  var poll = function () {
    pollAttempt++;
    var newToken = jso.getToken(Auth.PROVIDER);
    var newAccessToken = newToken && newToken.access_token;

    if (_isTokenRefreshed(newAccessToken)) {
      _this._refreshDefer.resolve(newAccessToken);
    } else if (pollAttempt < REFRESH_POLL_MAX_ATTEMPTS) {
      setTimeout(poll, REFRESH_POLL_INTERVAL);
    } else {
      $iframe.remove();
      _this._refreshDefer.reject('Failed to refresh token after ' + pollAttempt / 1000 * REFRESH_POLL_INTERVAL + ' secs');
    }
  };

  jso.setRedirect(this.createFrameRedirectHandler($iframe));

  poll();

  jso.authRequest(Auth.PROVIDER, this.config.scope);

  return this._refreshDefer.promise();
};

/**
 * Get token from local storage or request it if required.
 * Optionally can redirect to login page.
 * @return {Promise.<string>}
 */
Auth.prototype.requestToken = function () {
  var _this = this;
  if (!this._isTokenInited) {
    return this._interactiveEnsureToken().then(function (accessToken) {
      _this._isTokenInited = true;
      return accessToken;
    });
  } else {
    return this._nonInteractiveEnsureToken().fail(function () {
      jso.setRedirect(_this.defaultRedirectHandler);
      jso.authRequest(Auth.PROVIDER, _this.config.scope);
    });
  }
};

/**
 * @return {Promise.<User>}
 */
Auth.prototype.getUser = function () {
  if (this.user) {
    return $.Deferred().resolve(this.user).promise();
  }

  var deferred;
  var absAPIProfileURL = this.config.serverUri + Auth.API_PROFILE_PATH;
  try {
    deferred = $.oajax({
      url: absAPIProfileURL,
      jso_provider: Auth.PROVIDER,
      jso_allowia: true,
      dataType: 'json'
    });
    if (!deferred) {
      deferred = $.Deferred().reject();
    }
  } catch (e) {
    deferred = $.Deferred().reject(e);
  }


  var _this = this;
  deferred.then(function (user) {
    _this.user = user;
    return user;
  }, function (errorResponse) {
    var errorCode;
    try {
      errorCode = (errorResponse.responseJSON || $.parseJSON(errorResponse.responseText)).error;
    } catch (e) {
    }

    if (errorCode === 'invalid_grant' || errorCode === 'invalid_request') {
      jso.wipe();
      var ensureConfig = {};
      ensureConfig[Auth.PROVIDER] = [];
      jso.ensure(ensureConfig);
    }
  });

  return deferred.promise();
};

module.exports = Auth;
