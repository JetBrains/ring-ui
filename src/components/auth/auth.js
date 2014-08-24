'use strict';

var jso = require('jso-browser');
var $ = require('jquery');
var AuthStorage = require('./auth__storage');

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
 *
 * @param {{
 *   serverUri: string,
 *   redirect_uri: string?,
 *   client_id: string?,
 *   scope: string[]?
 * }} config
 */
var Auth = function (config) {
  if (!config) {
    throw new Error('Config is required');
  }
  if (config.serverUri == null) {
    throw new Error('Property serverUri is required');
  }

  this.config = $.extend({}, Auth.DEFAULT_CONFIG, config);

  if (this.config.serverUri.length > 0 && this.config.serverUri.charAt(config.serverUri.length - 1) !== '/') {
    this.config.serverUri += '/';
  }

  if ($.inArray(Auth.DEFAULT_CONFIG.client_id, this.config.scope) === -1) {
    this.config.scope.push(Auth.DEFAULT_CONFIG.client_id);
  }

  this._storage = new AuthStorage({
    stateStoragePrefix: this.config.client_id + '-state-',
    tokensStoragePrefix: this.config.client_id + '-tokens-'
  });

  this.profileUrl = this.config.serverUri + 'users/me';
  this.logoutUrl = this.config.serverUri + Auth.API_PATH + '/cas/logout?gateway=true&url=' + encodeURIComponent(this.config.redirect_uri);
};

/**
 * @const {RegExp}
 */
Auth.ABSOLUTE_URL_PATTERN = /^[a-z]+:\/\//i;

/**
 * @const {{client_id: string, redirect_uri: string, scope: string[]}}
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
 * @const {string}
 */
Auth.PROVIDER = 'hub';

/**
 * @const {string}
 */
Auth.API_PATH = 'api/rest';

/**
 * @const {string}
 */
Auth.API_AUTH_PATH = Auth.API_PATH + '/oauth2/auth';

/**
 * @const {string}
 */
Auth.API_PROFILE_PATH = Auth.API_PATH + '/users/me';

/**
 * @const {number}
 */
Auth.REFRESH_BEFORE = 20 * 60 * 1000; // 20 min

/**
 * @return {Promise.<string>} absolute URL promise that is resolved to an URL
 *  that should be restored after return back from auth server. If no return happened
 */
Auth.prototype.init = function () {
  var jsoConfig = {};
  jsoConfig[Auth.PROVIDER] = $.extend({
    authorization: this.config.serverUri + Auth.API_AUTH_PATH
  }, this.config);

  var restoreLocationDeferred = $.Deferred();
  var self = this;

  jso.registerRedirectHandler(this._defaultRedirectHandler);
  jso.registerStorageHandler(this._storage);

  jso.configure(jsoConfig, null, function (restoreLocation, error) {
    if (error) {
      // This happens if auth server response parse failed
      restoreLocationDeferred.reject(error);
    } else {
      // Check if there is a valid token. May redirect to auth server
      self._interactiveEnsureToken().then(function (/*accessToken*/) {
        // Access token appears to be valid. We may resolve restoreLocation URL now
        restoreLocationDeferred.resolve(restoreLocation);
      }, function (error) {
        // There is no valid token. JSO is likely to redirect to auth server. Or auth server is not accessible
        restoreLocationDeferred.reject(error);
      });
    }
  });
  return restoreLocationDeferred.promise();
};

/**
 * Checks if there is a valid token in the storage.
 * If there is no token redirect to auth page.
 *
 * @private
 * @return {Promise.<string>}
 */
Auth.prototype._interactiveEnsureToken = function () {
  var tokenDeferred = $.Deferred();

  var ensureConfig = {};
  ensureConfig[Auth.PROVIDER] = this.config.scope;

  if (jso.ensureTokens(ensureConfig)) {
    var accessToken = jso.getToken(Auth.PROVIDER).access_token;
    var self = this;

    this.getSecure(Auth.API_PROFILE_PATH, accessToken).then(function (user) {
      self.user = user;
      tokenDeferred.resolve(accessToken);
    }, function (errorResponse) {
      var errorCode;
      try {
        errorCode = (errorResponse.responseJSON || $.parseJSON(errorResponse.responseText)).error;
      } catch (e) {
      }

      if (errorResponse.status === 401 || errorCode === 'invalid_grant' || errorCode === 'invalid_request') {
        // Token expired
        jso.wipe();
        // This must redirect
        jso.ensureTokens(ensureConfig);
        tokenDeferred.reject({ authRedirect: true });
      } else {
        tokenDeferred.reject(errorResponse);
      }
    });
  } else {
    // This happens when jso.ensureTokens() redirects to auth page
    tokenDeferred.reject({ authRedirect: true });
  }

  return tokenDeferred.promise();
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
 * @private
 */
Auth.prototype._defaultRedirectHandler = function (url) {
  window.location = url;
};

/**
 * Creates function that redirects given $iframe to the parameter url
 * @param $iframe
 * @return {function(string)}
 * @private
 */
Auth.prototype._createFrameRedirectHandler = function ($iframe) {
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
  if (this._refreshDefer && this._refreshDefer.state() === 'pending') {
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

  var self = this;

  var REFRESH_POLL_INTERVAL = 30;
  var REFRESH_POLL_MAX_ATTEMPTS = 2000;
  var pollAttempt = 0;
  var poll = function () {
    pollAttempt++;
    var newToken = jso.getToken(Auth.PROVIDER);
    var newAccessToken = newToken && newToken.access_token;

    if (_isTokenRefreshed(newAccessToken)) {
      self._refreshDefer.resolve(newAccessToken);
    } else if (pollAttempt < REFRESH_POLL_MAX_ATTEMPTS) {
      setTimeout(poll, REFRESH_POLL_INTERVAL);
    } else {
      $iframe.remove();
      self._refreshDefer.reject('Failed to refresh token after ' + pollAttempt / 1000 * REFRESH_POLL_INTERVAL + ' secs');
    }
  };

  jso.registerRedirectHandler(this._createFrameRedirectHandler($iframe));

  poll();

  jso.authRequest(Auth.PROVIDER, this.config.scope);

  return this._refreshDefer.promise();
};

/**
 * Get token from local storage or request it if required.
 * Can redirect to login page.
 * @return {Promise.<string>}
 */
Auth.prototype.requestToken = function () {
  var self = this;
  return this._nonInteractiveEnsureToken().fail(function () {
    jso.registerRedirectHandler(self._defaultRedirectHandler);
    jso.authRequest(Auth.PROVIDER, self.config.scope);
  });
};

/**
 * Makes GET request to the given URL with the given access token.
 * @param {string} relativeURI a URI relative to config.serverUri to make the GET request to
 * @param {string} accessToken access token to use in request
 * @param {object?} params query parameters
 * @return {Promise} promise from $.ajax() request
 */
Auth.prototype.getSecure = function (relativeURI, accessToken, params) {
  return $.ajax({
    url: this.config.serverUri + relativeURI,
    data: params,
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    dataType: 'json'
  });
};


/**
 * @return {Promise.<object>}
 */
Auth.prototype.requestUser = function () {
  if (this.user) {
    return $.Deferred().resolve(this.user).promise();
  }

  var self = this;
  return this.requestToken().then(function (accessToken) {
    return self.getSecure(Auth.API_PROFILE_PATH, accessToken).then(function (user) {
      self.user = user;
      return user;
    });
  });
};

/**
 * Wipe accessToken and redirect to auth page with required authorization
 */
Auth.prototype.logout = function () {
  jso.wipe();
  jso.authRequest(Auth.PROVIDER, this.config.scope, null, {
    request_credentials: 'required'
  });
};

module.exports = Auth;