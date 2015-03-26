/* eslint-disable google-camelcase/google-camelcase */
var whatWgFetch = require('whatwg-fetch').fetch;
var when = require('when');
var contains = require('mout/array/contains');
var mixIn = require('mout/object/mixIn');

var AuthStorage = require('./auth__storage');
var AuthResponseParser = require('./auth__response-parser');
var AuthRequestBuilder = require('./auth__request-builder');
var urlUtils = require('url-utils/url-utils');


/**
 * @constructor
 *
 * @prop {object} config
 * @prop {string} config.serverUri
 * @prop {string} config.redirect_uri
 * @prop {string} config.client_id
 * @prop {boolean=false} config.redirect — use redirects instead of background token load
 * @prop {string[]} config.scope
 * @prop {string[]} config.optionalScopes
 * @prop {boolean} config.cleanHash - describes whether or not the location.hash has to be cleaned after authorization finish.
 * It should be set to false in angular > 1.2.26 apps to prevent infinite redirect in Firefox
 * @prop {User?} user
 *
 * @param {{
 *   serverUri: string,
 *   redirect_uri: string?,
 *   request_credentials: string?,
 *   client_id: string?,
 *   scope: string[]?,
 *   optionalScopes: string[]?,
 *   cleanHash: boolean?
 * }} config
 *
 * @example
   <example name="Auth">
     <file name="index.html">
       <div id="example">
     </div>
     </file>

     <file name="index.js" webpack="true">
       var Auth = require('auth/auth');

       var log = function(title) {
         return function(obj) {
           var div = document.createElement('div');
           div.innerHTML = '<h3>' + title + '</h3>' + JSON.stringify(obj);
           document.getElementById('example').appendChild(div);
         };
       };

       var auth = new Auth({
         serverUri: '***REMOVED***/',
         request_credentials: 'skip',
         redirect_uri: window.location.href.split('#')[0]
       });

       auth.init().
         then(log('location to restore')).
         then(function() {
           return auth.requestToken();
         }).
         then(log('token')).
         then(function(token) {
           return auth.requestUser();
         }).
         then(log('user profile data')).
         catch(log('error'));
     </file>
   </example>
 */
var Auth = function (config) {
  if (!config) {
    throw new Error('Config is required');
  }
  if (config.serverUri == null) {
    throw new Error('Property serverUri is required');
  }

  this.config = mixIn({}, Auth.DEFAULT_CONFIG, config);

  if (this.config.serverUri.length > 0 && this.config.serverUri.charAt(config.serverUri.length - 1) !== '/') {
    this.config.serverUri += '/';
  }

  if (!contains(this.config.scope, Auth.DEFAULT_CONFIG.client_id)) {
    this.config.scope.push(Auth.DEFAULT_CONFIG.client_id);
  }

  this._storage = new AuthStorage({
    stateKeyPrefix: this.config.client_id + '-states-',
    tokenKey: this.config.client_id + '-token'
  });

  var self = this;
  this._storage.onTokenChange(function(token) {
    if (token === null) {
      self.logout();
    }
  });

  this._responseParser = new AuthResponseParser();

  this._requestBuilder = new AuthRequestBuilder({
    authorization: this.config.serverUri + Auth.API_AUTH_PATH,
    client_id: this.config.client_id,
    redirect: this.config.redirect,
    redirect_uri: this.config.redirect_uri,
    request_credentials: this.config.request_credentials,
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
    var baseUrl = urlUtils.getBaseURI();
    var host = window.location.protocol + '//' + window.location.host;

    var uri;
    if (baseUrl) {
      uri = Auth.ABSOLUTE_URL_PATTERN.test(baseUrl) ? baseUrl : host + baseUrl;
    } else {
      uri = host;
    }

    return uri;
  }()),
  redirect: false,
  request_credentials: 'default',
  scope: [],
  cleanHash: true,
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
Auth.REFRESH_BEFORE = 20 * 60; // 20 min in s

/**
 * @const {number} noninteractive auth timeout
 */
Auth.REFRESH_TIMEOUT = 60 * 1000; // 1 min in ms

/**
 * @const {boolean} is CORS available in browser
 */
Auth.HAS_CORS = 'withCredentials' in new XMLHttpRequest();

/**
 * @return {Promise.<string>} absolute URL promise that is resolved to an URL
 *  that should be restored after return back from auth server. If no return happened
 */
Auth.prototype.init = function () {
  var self = this;

  function validateToken() {
    return self._getValidatedToken([
      Auth._validateExistence,
      Auth._validateExpiration,
      self._validateScopes.bind(self),
      self._validateAgainstUser.bind(self)]);
  }

  function sendRedirect(error) {
    return self._requestBuilder.prepareAuthRequest().
      then(function (authURL) {
        self._redirectCurrentPage(authURL);
        return when.reject(error);
      });
  }

  return this._checkForAuthResponse().
    then(function (state) {
      // Return endless promise in background to avoid service start
      if (state && state.nonRedirect) {
        return when.defer().promise;
      }

      // Check if there is a valid token
      return validateToken().
        then(function (/*accessToken*/) {
          // Access token appears to be valid.
          // We may resolve restoreLocation URL now
          self._initDeferred.resolve(state && state.restoreLocation);
          return state && state.restoreLocation;
        }, function (error) {
          // Redirect flow
          if (error.authRedirect && self.config.redirect) {
            return sendRedirect(error);
          }

          // Background flow
          if (error.authRedirect && !self.config.redirect) {
            return self._loadTokenInBackground().
              then(validateToken).
              then(function () {
                self._initDeferred.resolve();
              }).
              catch(sendRedirect); // Fallback to redirect flow
          }

          self._initDeferred.reject(error);
          return when.reject(error);
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
 * @return {Promise} promise from fetch request
 */
Auth.prototype.getSecure = function (relativeURI, accessToken, params) {
  var url = AuthRequestBuilder.encodeURL(this.config.serverUri + relativeURI, params);

  return whatWgFetch(url, {
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Accept': 'application/json'
    }
  }).
    then(function (response) {
      return response.json();
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
  var self = this;

  return this._storage.wipeToken().
    then(function () {
      return self._requestBuilder.prepareAuthRequest({request_credentials: 'required'});
    }).
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
    var response = self._responseParser.getAuthResponseFromURL();

    if (response && self.config.cleanHash) {
      self.setHash('');
    }
    resolve(response);
  }).then(
    /**
     * @param {AuthResponse} authResponse
     */
    function (authResponse) {
      if (!authResponse) {
        return undefined;
      }

      var statePromise = authResponse.state ? self._storage.getState(authResponse.state) : when.resolve({});
      return statePromise.then(
        /**
         * @param {StoredState=} state
         * @return {Promise.<string>}
         */
        function (state) {
          state = state || {};
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
            return state;
          });
        });
    });
};

/**
 * Error class for auth token validation
 *
 * @param {string} message error message
 * @param {Error=} cause error that caused this error
 * @constructor
 */
Auth.TokenValidationError = function (message, cause) {
  this.stack = Error.prototype.stack;
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
    var isRequired = !contains(this.config.optionalScopes, scope);
    if (isRequired && !contains(storedToken.scopes, scope)) {
      return Auth._authRequiredReject('Token doesn\'t match required scopes');
    }
  }
  return when.resolve(storedToken);
};

/**
 * Check if scope check is possible
 * @return {boolean}
 * @private
 */
Auth.prototype._canValidateAgainstUser = function () {
  var clientOrigin = urlUtils.getOrigin(this.config.redirect_uri);
  var serverOrigin = urlUtils.getOrigin(this.config.serverUri);

  return clientOrigin === serverOrigin || Auth.HAS_CORS;
};

/**
 * Check scopes
 * @param {StoredToken} storedToken
 * @return {Promise.<StoredToken>}
 * @private
 */
Auth.prototype._validateAgainstUser = function (storedToken) {
  var self = this;

  if (!this._canValidateAgainstUser()) {
    return when(storedToken);
  }

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
 * Token Validator function
 * @typedef {(function(StoredToken): Promise<StoredToken>)} TokenValidator
 */

/**
 * Gets stored token and applies provided validators
 * @param {TokenValidator[]} validators an array of validation
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
  window.location = urlUtils.fixUrl(url);
};

/**
 * Redirects the given iframe to the given url
 * @param {HTMLIFrameElement} iframe
 * @param {string} url
 * @private
 */
Auth.prototype._redirectFrame = function (iframe, url) {
  iframe.src = url + '&rnd=' + Math.random();
};

/**
 * Creates hidden iframe
 * @return {HTMLIFrameElement}
 * @private
 */
Auth.prototype._createHiddenFrame = function () {
  var iframe = document.createElement('iframe');

  iframe.style.border = iframe.style.width = iframe.style.height = '0px';
  iframe.style.visibility = 'hidden';
  iframe.style.position = 'absolute';
  iframe.style.left = '-10000px';
  window.document.body.appendChild(iframe);

  return iframe;
};

/**
 * Refreshes access token in iFrame.
 *
 * @return {Promise.<string>} promise that is resolved to access token when it is loaded in a background iframe. The
 * promise is rejected if no token was got after {@link Auth.REFRESH_TIMEOUT} ms.
 */
Auth.prototype._loadTokenInBackground = function () {
  if (this._backgroundDefer) {
    return this._backgroundDefer.promise;
  }

  var self = this;
  this._backgroundDefer = when.defer();
  this._backgroundDefer.promise.ensure(function () {
    self._backgroundDefer = null;
  });

  var iframe = this._createHiddenFrame();

  return this._requestBuilder.prepareAuthRequest(null, {nonRedirect: true}).
    then(function (authURL) {
      var removeListener = self._storage.onTokenChange(function(token) {
        if (token !== null) {
          window.document.body.removeChild(iframe);
          removeListener();
          self._backgroundDefer.resolve(token.access_token);
        }
      });

      self._redirectFrame(iframe, authURL);

      // TODO removeListener
      return self._backgroundDefer.promise.
        timeout(Auth.REFRESH_TIMEOUT);
    });
};
/**
 * Sets location hash
 * @param {string} hash
 */
Auth.prototype.setHash = function(hash) {
  if (history.replaceState) {
    // NB! History.replaceState is used here, because Firefox saves
    // a record in history.
    // NB! URL to redirect is formed maually because baseURI could be messed
    // up and in this case it's not obvious where redirect will lead.
    var cleanedUrl = [
      window.location.pathname,
      window.location.search
    ].join('');

    history.replaceState(undefined, undefined, cleanedUrl + '#' + hash);
  } else {
    window.location.hash = hash;
  }
};

/**
 * @const
 * @type {string}
 */
var GUEST_ID = 'guest';

// todo(igor.alexeenko): Static would look better.
/**
 * @param {Object} response
 * @return {boolean}
 */
Auth.prototype.isGuest = function(response) {
  return response.login === GUEST_ID || response.name === GUEST_ID;
};

module.exports = Auth;
