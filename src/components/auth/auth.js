'use strict';

var $ = require('jquery');
var when = require('when');
var AuthStorage = require('./auth__storage');

/**
 * @constructor
 *
 * @prop {object} config
 * @prop {string} config.serverUri
 * @prop {string} config.redirect_uri
 * @prop {string} config.client_id
 * @prop {string[]} config.scope
 * @prop {string[]} config.optionalScopes
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

  if (!this.config.authorization) {
    this.config.authorization = this.config.serverUri + Auth.API_AUTH_PATH;
  }

  if ($.inArray(Auth.DEFAULT_CONFIG.client_id, this.config.scope) === -1) {
    this.config.scope.push(Auth.DEFAULT_CONFIG.client_id);
  }

  this._stateStoragePrefix = this.config.client_id + '-state-';
  this._tokensStoragePrefix = this.config.client_id + '-tokens-';

  this._storage = new AuthStorage({
    stateStoragePrefix: this._stateStoragePrefix,
    tokensStoragePrefix: this._tokensStoragePrefix
  });

  this.profileUrl = this.config.serverUri + 'users/me';
  this.logoutUrl = this.config.serverUri + Auth.API_PATH + '/cas/logout?gateway=true&url=' + encodeURIComponent(this.config.redirect_uri);
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
Auth.REFRESH_BEFORE = 20 * 60; // 20 min

/**
 * @return {Promise.<string>} absolute URL promise that is resolved to an URL
 *  that should be restored after return back from auth server. If no return happened
 */
Auth.prototype.init = function () {
  this._redirectHandler = this._defaultRedirectHandler;

  var self = this;
  return this._checkForAuthResponse().
    then(function (restoreLocation) {
      // Check if there is a valid token. May redirect to auth server
      return self._interactiveEnsureToken().
        then(function (/*accessToken*/) {
          // Access token appears to be valid.
          // We may resolve restoreLocation URL now
          return restoreLocation;
        });
    });
};

/**
 * Parses the queryString into the object.
 * <code>
 *   Auth._parseQueryString("access_token=2YotnFZFEjr1zCsicMWpAA&state=xyz&token_type=example&expires_in=3600");
 *   // is {access_token: "2YotnFZFEjr1zCsicMWpAA", state: "xyz", token_type: "example", expires_in: "3600"}
 * </code>
 * @param queryString query parameter string to parse
 * @return {{
 *   access_token: string?,
 *   state: string?,
 *   token_type: string?,
 *   expires_in: string?,
 *   scope: string?,
 *   error: string?
 * }} object with query parameters map
 * @private
 */
Auth._parseQueryString = function (queryString) {
  var queryParameterPairRE = /([^&;=]+)=?([^&;]*)/g;
  var decode = function (s) {
    return decodeURIComponent(s.replace(/\+/g, ' '));
  };

  var urlParams = {};
  var matchedQueryPair;
  while ((matchedQueryPair = queryParameterPairRE.exec(queryString)) != null) {
    urlParams[decode(matchedQueryPair[1])] = decode(matchedQueryPair[2]);
  }
  return urlParams;
};

/**
 * Returns epoch, seconds since 1970.
 * Used for calculation of expire times.
 * @return {number} epoch, seconds since 1970
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
 */
Auth.prototype._checkForAuthResponse = function () {
  var hash = window.location.toString().replace(/^[^#]*/, ''); // Because of stupid Firefox bug — https://bugzilla.mozilla.org/show_bug.cgi?id=483304
  if (hash.length < 2) {
    return when.resolve();
  }

  var authResponse = Auth._parseQueryString(hash.substring(1));

  // Check for errors
  if (authResponse.error) {
    window.location.hash = '';
    return when.reject('Error in auth request: ' + authResponse.error);
  }

  // If there is no token in the hash
  if (!authResponse.access_token) {
    return when.resolve();
  } else {
    window.location.hash = '';
  }

  var self = this;
  var statePromise = authResponse.state ? this._storage.getState(authResponse.state) : when.resolve({});
  return statePromise.then(function (state) {
    var config = self.config;

    /**
     * If state was not provided, and default provider contains a scope parameter
     * we assume this is the one requested...
     */
    if (authResponse.scope) {
      authResponse.scopes = authResponse.scope.split(' ');
    } else if (state.scopes) {
      authResponse.scopes = state.scopes;
    } else if (config.scope) {
      state.scopes = config.scope;
    }

    var expiresIn = authResponse.expires_in ? parseInt(authResponse.expires_in, 10) : config.default_expires_in;
    authResponse.expires = Auth._epoch() + expiresIn;

    return self._storage.saveToken(authResponse).
      then(function () {
        if (state.restoreHash) {
          window.location.hash = state.restoreHash;
        }

        return state.restoreLocation;
      });
  });
};

Auth._contains = function (arr, el) {
  if (!arr) {
    return false;
  }
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === el) {
      return true;
    }
  }
  return false;
};

/**
 * @return {string} random string used for state
 */
Auth._uuid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};


/**
 * Promises access token if it is valid. If it is invalid the promise rejects.
 * @return {Promise}
 * @private
 */
Auth.prototype._checkToken = function () {
  var now = this._epoch();
  var self = this;
  return this._storage.getToken().
    then(function (authResponse) {
      // Check if there is the token
      if (!authResponse || !authResponse.access_token) {
        return when.reject('Token not found');
      }

      // Check expiration
      if (authResponse.expires && authResponse.expires < (now + Auth.REFRESH_BEFORE)) {
        return when.reject('Token expired');
      }

      // Check scopes
      for (var i = 0; i < self.config.scope.length; i++) {
        var scope = self.config.scope[i];
        var isRequired = !Auth._contains(self.config.optionalScopes, scope);
        if (isRequired && !Auth._contains(authResponse.scopes, scope)) {
          return when.reject('Token doesn\'t match required scopes');
        }
      }

      return authResponse.access_token;
    });
};

/*
 * Takes an URL as input and a params object.
 * Each property in the params is added to the url as query string parameters
 */
Auth._encodeURL = function (url, params) {
  var res = url;
  var k, i = 0;
  var firstSeparator = (url.indexOf('?') === -1) ? '?' : '&';
  for (k in params) {
    if (params.hasOwnProperty(k)) {
      res += (i++ === 0 ? firstSeparator : '&') + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }
  }
  return res;
};


Auth.prototype._authRedirect = function (extraParams) {
  var state = Auth._uuid();
  var request = $.extend({
    response_type: 'token',
    state: state,
    redirect_uri: this.config.redirect_uri,
    client_id: this.config.client_id,
    scope: this.config.scope.join(' ')
  }, extraParams || {});

  var authurl = Auth._encodeURL(this.config.authorization, request);

  // We'd like to cache the hash for not loosing Application state.
  // With the implciit grant flow, the hash will be replaced with the access
  // token when we return after authorization.
  if (window.location.hash) {
    request.restoreHash = window.location.hash;
  }
  request.restoreLocation = window.location.href;
  request.scopes = this.config.scope;

  var self = this;
  return this._storage.saveState(state, request).
    then(function () {
      return self._storage.wipeToken().
        then(function () {
          return self._redirectHandler(authurl);
        });
    });
};


/**
 * Checks if there is a valid token in the storage.
 * If there is no token redirect to auth page.
 *
 * @private
 * @return {Promise.<string>}
 */
Auth.prototype._interactiveEnsureToken = function () {
  var self = this;
  return this._checkToken().
    then(function (accessToken) {
      return self.getSecure(Auth.API_PROFILE_PATH, accessToken).
        then(function (user) {
          self.user = user;
          return accessToken;
        }, function (errorResponse) {
          var errorCode;
          try {
            errorCode = (errorResponse.responseJSON || JSON.parse(errorResponse.responseText)).error;
          } catch (e) {
          }

          if (errorResponse.status === 401 || errorCode === 'invalid_grant' || errorCode === 'invalid_request') {
            // Token expired
            return when.reject({ reason: errorCode, authRedirect: true });
          } else {
            return when.reject(errorResponse);
          }
        });
    }, function (e) {
      return when.reject({ reason: e, authRedirect: true });
    }).
    otherwise(function (e) {
      if (e.authRedirect) {
        return self._authRedirect().
          then(function () {
            return when.reject(e);
          });
      }
      return when.reject(e);
    });
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
  var self = this;
  return this._checkToken().
    otherwise(function () {
      if (self._refreshDefer) {
        return self._refreshDefer.promise;
      }

      self._refreshDefer = when.defer();
      self._refreshDefer.ensure(function () {
        self._refreshDefer = null;
      });

      var $iframe = $('<iframe style="display: none;"></iframe>').appendTo('body');

      var REFRESH_POLL_INTERVAL = 30;
      var REFRESH_POLL_MAX_ATTEMPTS = 2000;
      var pollAttempt = 0;
      var poll = function () {
        pollAttempt++;
        self._storage.getToken().
          then(function (authResponse) {
            var newAccessToken = authResponse && authResponse.access_token;

            if (newAccessToken) {
              self._refreshDefer.resolve(newAccessToken);
            } else if (pollAttempt < REFRESH_POLL_MAX_ATTEMPTS) {
              setTimeout(poll, REFRESH_POLL_INTERVAL);
            } else {
              $iframe.remove();
              self._refreshDefer.reject('Failed to refresh token after ' + pollAttempt / 1000 * REFRESH_POLL_INTERVAL + ' secs');
            }
          });
      };

      self._redirectHandler = self._createFrameRedirectHandler($iframe);
      return self._authRedirect().
        then(function () {
          poll();
          return self._refreshDefer.promise;
        });
    });
};

/**
 * Get token from local storage or request it if required.
 * Can redirect to login page.
 * @return {Promise.<string>}
 */
Auth.prototype.requestToken = function () {
  var self = this;
  return this._nonInteractiveEnsureToken().
    otherwise(function () {
      self._redirectHandler = self._defaultRedirectHandler;
      return self._authRedirect();
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
  return this._authRedirect({request_credentials: 'required'});
};

module.exports = Auth;