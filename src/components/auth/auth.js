'use strict';

var $ = require('jquery');
var when = require('when');
var AuthStorage = require('./auth__storage');
var AuthResponseParser = require('./auth__response-parser');
var AuthRequestBuilder = require('./auth__request-builder');

/**
 * @constructor
 *
 * @prop {object} config
 * @prop {string} config.serverUri
 * @prop {string} config.redirect_uri
 * @prop {string} config.client_id
 * @prop {string[]} config.scope
 * @prop {string[]} config.optionalScopes
 * @prop {User?} user
 *
 * @param {{
 *   serverUri: string,
 *   redirect_uri: string?,
 *   client_id: string?,
 *   scope: string[]?,
 *   optionalScopes: string[]?
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
    stateKeyPrefix: this.config.client_id + '-states-',
    tokenKey: this.config.client_id + '-token',
    onTokenRemove: this.logout.bind(this)
  });

  this._reponseParser = new AuthResponseParser();

  this._requestBuilder = new AuthRequestBuilder({
    authorization: this.config.serverUri + Auth.API_AUTH_PATH,
    client_id: this.config.client_id,
    redirect_uri: this.config.redirect_uri,
    scopes: this.config.scope
  }, this._storage);

  this._initDeferred = when.defer();
};

/**
 * @const {RegExp}
 */
Auth.ABSOLUTE_URL_PATTERN = /^[a-z]+:\/\//i;

/**
 * @const {{client_id: string, redirect_uri: string, scope: string[], default_expires_in: number}}
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
  scope: [],
  default_expires_in: 40 * 60 // 40 mins
};

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
Auth.REFRESH_BEFORE = 20 * 60; // 20 min

/**
 * @const {number} noninteractive auth poll period
 */
Auth.REFRESH_POLL_INTERVAL = 30; // 30 ms

/**
 * @const {number} max attempts to check token noninteractively
 */
Auth.REFRESH_POLL_MAX_ATTEMPTS = 2000;

/**
 * @return {Promise.<string>} absolute URL promise that is resolved to an URL
 *  that should be restored after return back from auth server. If no return happened
 */
Auth.prototype.init = function () {
  var self = this;
  return this._checkForAuthResponse().
    then(function (restoreLocation) {
      // Check if there is a valid token
      return self._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, self._validateScopes.bind(self), self._validateAgainstUser.bind(self)]).
        then(function (/*accessToken*/) {
          // Access token appears to be valid.
          // We may resolve restoreLocation URL now
          self._initDeferred.resolve(restoreLocation);
          return restoreLocation;
        }, function (e) {
          if (e.authRedirect) {
            return self._requestBuilder.prepareAuthRequest().
              then(function (authURL) {
                self._redirectCurrentPage(authURL);
                return when.reject(e);
              });
          }
          self._initDeferred.reject(e);
          return when.reject(e);
        });
    });
};

/**
 * Get token from local storage or request it if it is required.
 * Can redirect to login page.
 * @return {Promise.<string>}
 */
Auth.prototype.requestToken = function () {
  var self = this;
  return this._initDeferred.promise.then(function () {
    return self._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, self._validateScopes.bind(self)]).
      otherwise(function () {
        return self._loadTokenInBackground();
      }).
      otherwise(function (e) {
        return self._requestBuilder.prepareAuthRequest().
          then(function (authURL) {
            self._redirectCurrentPage(authURL);
            return Auth._authRequiredReject(e.message);
          });
      });
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
  return when($.ajax({
    url: this.config.serverUri + relativeURI,
    data: params,
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    dataType: 'json'
  }));
};

/**
 * @return {Promise.<object>}
 */
Auth.prototype.requestUser = function () {
  if (this.user) {
    return when.resolve(this.user);
  }

  var self = this;
  return this.requestToken().
    then(function (accessToken) {
      return self.getSecure(Auth.API_PROFILE_PATH, accessToken);
    }).
    then(function (user) {
      self.user = user;
      return user;
    });
};

/**
 * Wipe accessToken and redirect to auth page with required authorization
 */
Auth.prototype.logout = function () {
  var self = this;
  return this._requestBuilder.prepareAuthRequest({request_credentials: 'required'}).
    then(function (authURL) {
      self._redirectCurrentPage(authURL);
    });
};

/**
 * Returns epoch, seconds since 1970.
 * Used for calculation of expire times.
 * @return {number} epoch, seconds since 1970
 * @private
 */
Auth._epoch = function () {
  return Math.round(new Date().getTime() / 1000.0);
};

/**
 * Check if the hash contains an access token.
 * And if it does, extract the state, compare with
 * config, and store the auth response for later use.
 *
 * @return {Promise} promise that is resolved to restoreLocation URL, or rejected
 * @private
 */
Auth.prototype._checkForAuthResponse = function () {
  var self = this;
  return when.promise(function (resolve) {
    // getAuthResponseURL may throw an exception. Wrap it with promise to handle it gently.
    resolve(self._reponseParser.getAuthResponseFromURL());
  }).then(
    /**
     * @param {AuthResponse} authResponse
     */
      function (authResponse) {
      if (!authResponse) {
        return;
      }

      var statePromise = authResponse.state ? self._storage.getState(authResponse.state) : when.resolve({});
      return statePromise.then(
        /**
         * @param {StoredState} state
         * @return {Promise.<string>}
         */
          function (state) {
          var config = self.config;

          /**
           * @type {string[]}
           */
          var scopes;
          if (authResponse.scope) {
            scopes = authResponse.scope.split(' ');
          } else if (state.scopes) {
            scopes = state.scopes;
          } else if (config.scope) {
            scopes = config.scope;
          } else {
            scopes = [];
          }

          /**
           * @type {number}
           */
          var expiresIn;
          if (authResponse.expires_in) {
            expiresIn = parseInt(authResponse.expires_in, 10);
          } else {
            expiresIn = config.default_expires_in;
          }
          var expries = Auth._epoch() + expiresIn;

          return self._storage.saveToken({
            access_token: authResponse.access_token,
            scopes: scopes,
            expires: expries
          }).then(function () {
            return state.restoreLocation;
          });
        });
    });
};

/**
 * Checks if the element el is in the array arr
 * @return {boolean}
 * @private
 */
Auth._contains = function (arr, el) {
  return arr && arr.indexOf(el) >= 0;
};

/**
 * Error class for auth token validation
 *
 * @param {string} message error message
 * @param {Error=} cause error that caused this error
 * @constructor
 */
Auth.TokenValidationError = function (message, cause) {
  this.stack = Error().stack;
  this.message = message;
  this.cause = cause;
  this.authRedirect = true;
};

Auth.TokenValidationError.prototype = Object.create(Error.prototype);
Auth.TokenValidationError.prototype.name = 'TokenValidationError';

/**
 * @param {string} message
 * @param {cause=} cause
 * @return {Promise} rejected promise with {authRedirect: true}
 * @private
 */
Auth._authRequiredReject = function (message, cause) {
  var error = new Auth.TokenValidationError(message, cause);
  return when.reject(error);
};

/**
 * Check if there is the token
 * @param {StoredToken} storedToken
 * @return {Promise.<StoredToken>}
 * @private
 */
Auth._validateExistence = function (storedToken) {
  if (!storedToken || !storedToken.access_token) {
    return Auth._authRequiredReject('Token not found');
  } else {
    return when.resolve(storedToken);
  }
};

/**
 * Check expiration
 * @param {StoredToken} storedToken
 * @return {Promise.<StoredToken>}
 * @private
 */
Auth._validateExpiration = function (storedToken) {
  var now = Auth._epoch();
  if (storedToken.expires && storedToken.expires < (now + Auth.REFRESH_BEFORE)) {
    return Auth._authRequiredReject('Token expired');
  } else {
    return when.resolve(storedToken);
  }
};

/**
 * Check scopes
 * @param {StoredToken} storedToken
 * @return {Promise.<StoredToken>}
 * @private
 */
Auth.prototype._validateScopes = function (storedToken) {
  for (var i = 0; i < this.config.scope.length; i++) {
    var scope = this.config.scope[i];
    var isRequired = !Auth._contains(this.config.optionalScopes, scope);
    if (isRequired && !Auth._contains(storedToken.scopes, scope)) {
      return Auth._authRequiredReject('Token doesn\'t match required scopes');
    }
  }
  return when.resolve(storedToken);
};

/**
 * Check scopes
 * @param {StoredToken} storedToken
 * @return {Promise.<StoredToken>}
 * @private
 */
Auth.prototype._validateAgainstUser = function (storedToken) {
  var self = this;
  return this.getSecure(Auth.API_PROFILE_PATH, storedToken.access_token).
    then(function (user) {
      self.user = user;
      return storedToken;
    }, function (errorResponse) {
      var errorCode;
      try {
        errorCode = (errorResponse.responseJSON || JSON.parse(errorResponse.responseText)).error;
      } catch (e) {
      }

      if (errorResponse.status === 401 || errorCode === 'invalid_grant' || errorCode === 'invalid_request') {
        // Token expired
        return Auth._authRequiredReject(errorCode);
      } else {
        // Request unexpectedly failed
        return when.reject(errorResponse);
      }
    });
};

/**
 * Gets stored token and applied given validators
 * @param {(function(StoredToken): Promise<StoredToken>)[]} validators an array of validation
 * functions to check the stored token against.
 * @return {Promise.<string>} promise that is resolved to access token if the stored token is valid. If it is
 * invalid then the promise is rejected. If invalid token should be re-requested then rejection object will
 * have {authRedirect: true}.
 * @private
 */
Auth.prototype._getValidatedToken = function (validators) {
  var tokenPromise = this._storage.getToken();
  for (var i = 0; i < validators.length; i++) {
    tokenPromise = tokenPromise.then(validators[i]);
  }
  return tokenPromise.then(function (storedToken) {
    return storedToken.access_token;
  });
};

/**
 * Redirects current page to the given URL
 * @param {string} url
 * @private
 */
Auth.prototype._redirectCurrentPage = function (url) {
  window.location = url;
};

/**
 * Redirects the given $iframe to the given url
 * @param {jQuery} $iframe
 * @param {string} url
 * @private
 */
Auth.prototype._redirectFrame = function ($iframe, url) {
  $iframe.attr('src', url + '&rnd=' + Math.random());
};

/**
 * Refreshes access token in iFrame.
 *
 * @return {Promise.<string>} promise that is resolved to access token when it is loaded in a background iframe. The
 * promise is rejected if no token was got after {@link Auth.REFRESH_POLL_MAX_ATTEMPTS} attempts.
 */
Auth.prototype._loadTokenInBackground = function () {
  if (this._refreshDefer) {
    return this._refreshDefer.promise;
  }

  this._refreshDefer = when.defer();
  this._refreshDefer.promise.ensure(function () {
    self._refreshDefer = null;
  });

  var $iframe = $('<iframe style="display: none;"></iframe>').appendTo('body');

  var self = this;
  var pollAttempt = 0;
  var poll = function () {
    pollAttempt++;
    self._storage.getToken().
      done(function (storedToken) {
        var newAccessToken = storedToken && storedToken.access_token;

        if (newAccessToken) {
          $iframe.remove();
          self._refreshDefer.resolve(newAccessToken);
        } else if (pollAttempt < Auth.REFRESH_POLL_MAX_ATTEMPTS) {
          setTimeout(poll, Auth.REFRESH_POLL_INTERVAL);
        } else {
          $iframe.remove();
          self._refreshDefer.reject(new Error('Failed to refresh token after ' + pollAttempt / 1000 * Auth.REFRESH_POLL_INTERVAL + ' secs'));
        }
      });
  };

  return this._requestBuilder.prepareAuthRequest().
    then(function (authURL) {
      self._redirectFrame($iframe, authURL);
      poll();
      return self._refreshDefer.promise;
    });
};

module.exports = Auth;