/* eslint-disable camelcase */

import 'core-js/modules/es7.array.includes';

const AuthStorage = require('./auth__storage');
const AuthResponseParser = require('./auth__response-parser');
const AuthRequestBuilder = require('./auth__request-builder');
const urlUtils = require('../url-utils/url-utils');

function noop() {}

/**
 * @constructor
 * @name Auth
 *
 * @prop {object} config
 * @prop {string} config.serverUri
 * @prop {string} config.redirect_uri
 * @prop {string} config.client_id
 * @prop {boolean=true} config.redirect — use redirects instead of loading token in the background. TODO set to false after Hub 1.0 is released.
 * @prop {string[]} config.scope
 * @prop {string[]} config.optionalScopes
 * @prop {boolean} config.cleanHash - whether or not location.hash will be cleaned after authorization is completed.
 * Should be set to false in angular > 1.2.26 apps to prevent infinite redirect in Firefox
 * @prop {User?} user
 * @prop {string[]} config.userFields List of users fields to be returned by auth.requestUser (default list is used in Header.HeaderHelper)
 *
 * @param {{
 *   serverUri: string,
 *   redirect_uri: string?,
 *   request_credentials: string?,
 *   client_id: string?,
 *   scope: string[]?,
 *   optionalScopes: string[]?,
 *   cleanHash: boolean?,
 *   userFields: string[]?
 * }} config
 *
 * @example
   <example name="Auth">
     <file name="index.html">
       <div id="example">
     </div>
     </file>

     <file name="index.js" webpack="true">
       const Auth = require('ring-ui/components/auth/auth');

       const log = function(title) {
         return function(obj) {
           const titleElem = document.createElement('h3');
           const jsonElem = document.createElement('div');

           titleElem.innerHTML = title;
           jsonElem.innerHTML = JSON.stringify(obj);

           document.getElementById('example').appendChild(titleElem);
           document.getElementById('example').appendChild(jsonElem);
         };
       };

       const auth = new Auth({
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
function Auth(config) {
  if (!config) {
    throw new Error('Config is required');
  }

  if (config.serverUri == null) {
    throw new Error('Property serverUri is required');
  }

  config.userFields = config.userFields || [];

  this.config = Object.assign({}, Auth.DEFAULT_CONFIG, config);

  const serverUriLength = this.config.serverUri.length;
  if (serverUriLength > 0 && this.config.serverUri.charAt(serverUriLength - 1) !== '/') {
    this.config.serverUri += '/';
  }

  this.config.userParams = {
    fields: [...new Set(Auth.DEFAULT_CONFIG.userFields.concat(config.userFields))].join()
  };

  if (!this.config.scope.includes(Auth.DEFAULT_CONFIG.client_id)) {
    this.config.scope.push(Auth.DEFAULT_CONFIG.client_id);
  }

  this._storage = new AuthStorage({
    stateKeyPrefix: this.config.client_id + '-states-',
    tokenKey: this.config.client_id + '-token'
  });

  this._responseParser = new AuthResponseParser();

  this._requestBuilder = new AuthRequestBuilder({
    authorization: this.config.serverUri + Auth.API_PATH + Auth.API_AUTH_PATH,
    client_id: this.config.client_id,
    redirect: this.config.redirect,
    redirect_uri: this.config.redirect_uri,
    request_credentials: this.config.request_credentials,
    scopes: this.config.scope
  }, this._storage);

  this._initDeferred = {};
  this._initDeferred.promise = new Promise((resolve, reject) => {
    this._initDeferred.resolve = resolve;
    this._initDeferred.reject = reject;
  });
}


/**
 * @const {{client_id: string, redirect_uri: string, scope: string[], default_expires_in: number}}
 */
Auth.DEFAULT_CONFIG = {
  client_id: '0-0-0-0-0',
  redirect_uri: urlUtils.getAbsoluteBaseURL(),
  redirect: true,
  request_credentials: 'default',
  scope: [],
  userFields: ['guest', 'id', 'name', 'profile/avatar/url'],
  cleanHash: true,
  default_expires_in: 40 * 60 // 40 mins
};

/**
 * @const {string}
 */
Auth.API_PATH = 'api/rest/';

/**
 * @const {string}
 */
Auth.API_AUTH_PATH = 'oauth2/auth';

/**
 * @const {string}
 */
Auth.API_PROFILE_PATH = 'users/me';

/**
 * @const {number}
 */
Auth.REFRESH_BEFORE = 20 * 60; // 20 min in s

/**
 * @const {number} non-interactive auth timeout
 */
Auth.BACKGROUND_TIMEOUT = 20 * 1000; // 20 sec in ms

/**
 * @const {boolean} is CORS supported by the browser
 */
Auth.HAS_CORS = 'withCredentials' in new XMLHttpRequest();

/**
 * @return {Promise.<string>} absolute URL promise that is resolved to a URL
 * that should be restored after returning back from auth server.
 */
Auth.prototype.init = function () {
  this._storage.onTokenChange(token => {
    if (token === null) {
      this.logout();
    }
  });

  function sendRedirect(error) {
    return this._requestBuilder.prepareAuthRequest().
      then(authRequest => {
        this._redirectCurrentPage(authRequest.url);
        return Promise.reject(error);
      });
  }

  return this._checkForAuthResponse()
    .catch(error => {
      if (error.stateId) {
        return this._storage.getState(error.stateId)
          .catch(() => Promise.reject(error))
          .then(state => {
            if (state && state.nonRedirect) {
              state.error = error;
              this._storage.saveState(error.stateId, state);
              return new Promise(noop);
            }

            return Promise.reject(error);
          });
      }

      return Promise.reject(error);
    }).
    then(state => {
      // Return endless promise in background to avoid service start
      if (state && state.nonRedirect) {
        return new Promise(noop);
      }

      // Check if there is a valid token
      return this.validateToken().
        then((/*accessToken*/) => {
          // Access token appears to be valid.
          // We may resolve restoreLocation URL now
          this._initDeferred.resolve(state && state.restoreLocation);
          return state && state.restoreLocation;
        }, error => {
          // TODO Remove after "redirect: false" is default, i.e. after Hub 1.0 everywhere
          const shouldRedirect = this.config.redirect && this.config.redirect !== 'background-unsafe';

          // Redirect flow
          if (error.authRedirect && shouldRedirect) {
            return this::sendRedirect(error);
          }

          // Background flow
          if (error.authRedirect && !shouldRedirect) {
            return this._loadTokenInBackground().
              then(this.validateToken.bind(this)).
              then(() => {
                this._initDeferred.resolve();
              }).
              catch(this::sendRedirect); // Fallback to redirect flow
          }

          this._initDeferred.reject(error);
          return Promise.reject(error);
        });
    });
};

/**
 * Check token validity against all conditions.
 * @returns {Promise.<string>}
 */
Auth.prototype.validateToken = function () {
  return this._getValidatedToken([
    Auth._validateExistence,
    Auth._validateExpiration,
    this._validateScopes.bind(this),
    this._validateAgainstUser.bind(this)]);
};

/**
 * Get token from local storage or request it if necessary.
 * Can redirect to login page.
 * @return {Promise.<string>}
 */
Auth.prototype.requestToken = function () {
  return this._initDeferred.promise.then(() => {
    return this._getValidatedToken([Auth._validateExistence, Auth._validateExpiration, this._validateScopes.bind(this)])
      .catch(() => this.forceTokenUpdate());
  });
};

/**
 * Get new token in background or redirect to login page.
 * @return {Promise.<string>}
 */
Auth.prototype.forceTokenUpdate = function () {
  return this._loadTokenInBackground()
    .then(accessToken => {
      return this.getApi(Auth.API_PROFILE_PATH, accessToken, this.config.userParams)
        .then(user => {
          if (user && this.user && this.user.id !== user.id) {
            // Reload page if user has been changed after background refresh
            this._redirectCurrentPage(window.location.href);
          }

          return accessToken;
        });
    })
    .catch(e => {
      return this._requestBuilder.prepareAuthRequest()
        .then(authRequest => {
          this._redirectCurrentPage(authRequest.url);
          return Auth._authRequiredReject(e.message);
        });
    });
};

/**
 * Makes GET request to the given URL with the given access token.
 *
 * @param {string} absoluteUrl an absolute URI to request with given token
 * @param {string} accessToken access token to use in request
 * @param {object?} params query parameters
 * @return {Promise} promise from fetch request
 */
Auth.prototype.getSecure = function (absoluteUrl, accessToken, params) {
  const url = AuthRequestBuilder.encodeURL(absoluteUrl, params);

  return fetch(url, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      Accept: 'application/json'
    }
  }).
    then(function (response) {
      // Simulate $.ajax behavior
      // @see https://github.com/github/fetch#success-and-error-handlers
      if (response && response.status >= 200 && response.status < 300) {
        return response.json();
      } else {
        // Strange case case found in the wild
        // @see https://youtrack.jetbrains.com/issue/JT-31942
        response = response || {
          status: 0,
          statusText: 'Network request failed'
        };

        const error = new Error('' + response.status + ' ' + response.statusText);
        error.response = response;
        error.status = response.status;
        return Promise.reject(error);
      }
    });
};

/**
 * Makes GET request to the relative API URL. For example, to fetch all services call:
 *  getApi('services', token, params)
 *
 * @param {string} relativeURI a URI relative to config.serverUri REST endpoint to make the GET request to
 * @param {string} accessToken access token to use in request
 * @param {object?} params query parameters
 * @return {Promise} promise from fetch request
 */
Auth.prototype.getApi = function (relativeURI, accessToken, params) {
  return this.getSecure(this.config.serverUri + Auth.API_PATH + relativeURI, accessToken, params);
};

/**
 * @return {Promise.<object>}
 */
Auth.prototype.requestUser = function () {
  if (this.user) {
    return Promise.resolve(this.user);
  }

  return this.requestToken().
    then(accessToken => {
      if (this.user) {
        return this.user;
      }

      return this.getApi(Auth.API_PROFILE_PATH, accessToken, this.config.userParams).
        then(user => {
          this.user = user;
          return user;
        });
    });
};

/**
 * Wipe accessToken and redirect to auth page with required authorization
 */
Auth.prototype.logout = function (requestParams) {
  return this._storage.wipeToken().
    then(() => {
      return this._requestBuilder.prepareAuthRequest(Object.assign({request_credentials: 'required'}, requestParams));
    }).
    then(authRequest => {
      this._redirectCurrentPage(authRequest.url);
    });
};

/**
 * Returns epoch - seconds since 1970.
 * Used for calculation of expire times.
 * @return {number} epoch, seconds since 1970
 * @private
 */
Auth._epoch = function () {
  return Math.round(new Date().getTime() / 1000.0);
};

/**
 * Check if the hash contains an access token.
 * If it does, extract the state, compare with
 * config, and store the auth response for later use.
 *
 * @return {Promise} promise that is resolved to restoreLocation URL, or rejected
 * @private
 */
Auth.prototype._checkForAuthResponse = function () {
  return new Promise(resolve => {
    // getAuthResponseURL may throw an exception. Wrap it with promise to handle it gently.
    const response = this._responseParser.getAuthResponseFromURL();

    if (response && this.config.cleanHash) {
      this.setHash('');
    }
    resolve(response);
  }).then(
    /**
     * @param {AuthResponse} authResponse
     */
    authResponse => {
      if (!authResponse) {
        return undefined;
      }

      const statePromise = authResponse.state ? this._storage.getState(authResponse.state) : Promise.resolve({});
      return statePromise.then(
        /**
         * @param {StoredState=} state
         * @return {Promise.<string>}
         */
        state => {
          state = state || {};
          const config = this.config;

          /**
           * @type {string[]}
           */
          let scopes;
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
          let expiresIn;
          if (authResponse.expires_in) {
            expiresIn = parseInt(authResponse.expires_in, 10);
          } else {
            expiresIn = config.default_expires_in;
          }
          const expries = Auth._epoch() + expiresIn;

          return this._storage.saveToken({
            access_token: authResponse.access_token,
            scopes: scopes,
            expires: expries
          }).then(() => {
            return state;
          });
        });
    });
};

/**
 * Error class for auth token validation
 *
 * @param {string} message Error message
 * @param {Error=} cause Error that caused this error
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
  const error = new Auth.TokenValidationError(message, cause);
  return Promise.reject(error);
};

/**
 * Check if there is a token
 * @param {StoredToken} storedToken
 * @return {Promise.<StoredToken>}
 * @private
 */
Auth._validateExistence = function (storedToken) {
  if (!storedToken || !storedToken.access_token) {
    return Auth._authRequiredReject('Token not found');
  } else {
    return Promise.resolve(storedToken);
  }
};

/**
 * Check expiration
 * @param {StoredToken} storedToken
 * @return {Promise.<StoredToken>}
 * @private
 */
Auth._validateExpiration = function (storedToken) {
  const now = Auth._epoch();
  if (storedToken.expires && storedToken.expires < (now + Auth.REFRESH_BEFORE)) {
    return Auth._authRequiredReject('Token expired');
  } else {
    return Promise.resolve(storedToken);
  }
};

/**
 * Check scopes
 * @param {StoredToken} storedToken
 * @return {Promise.<StoredToken>}
 * @private
 */
Auth.prototype._validateScopes = function (storedToken) {
  for (let i = 0; i < this.config.scope.length; i++) {
    const scope = this.config.scope[i];
    const isRequired = !this.config.optionalScopes || !this.config.optionalScopes.includes(scope);
    if (isRequired && !storedToken.scopes.includes(scope)) {
      return Auth._authRequiredReject('Token doesn\'t match required scopes');
    }
  }
  return Promise.resolve(storedToken);
};

/**
 * Check if scope check is possible
 * @return {boolean}
 * @private
 */
Auth.prototype._canValidateAgainstUser = function () {
  const clientOrigin = urlUtils.getOrigin(this.config.redirect_uri);
  const serverOrigin = urlUtils.getOrigin(this.config.serverUri);

  return clientOrigin === serverOrigin || Auth.HAS_CORS;
};

/**
 * Check by error code if token should be refreshed
 * @param {string} error
 * @return {boolean}
 */
Auth.shouldRefreshToken = function (error) {
  return error === 'invalid_grant' ||
    error === 'invalid_request' ||
    error === 'invalid_token';
};

/**
 * Check scopes
 * @param {StoredToken} storedToken
 * @return {Promise.<StoredToken>}
 * @private
 */
Auth.prototype._validateAgainstUser = function (storedToken) {
  if (!this._canValidateAgainstUser()) {
    return Promise.resolve(storedToken);
  }

  return this.getApi(Auth.API_PROFILE_PATH, storedToken.access_token, this.config.userParams)
    .then(user => {
      this.user = user;
      return storedToken;
    }, errorResponse => {
      return errorResponse.response.json()
        // Skip JSON parsing errors
        .catch(() => ({}))
        .then(response => {
          if (errorResponse.status === 401 || Auth.shouldRefreshToken(response.error)) {
            // Token expired
            return Auth._authRequiredReject(response.error || errorResponse.message);
          }

          // Request unexpectedly failed
          return Promise.reject(errorResponse);
        });
    });
};

/**
 * Token Validator function
 * @typedef {(function(StoredToken): Promise<StoredToken>)} TokenValidator
 */

/**
 * Gets stored token and applies provided validators
 * @param {TokenValidator[]} validators An array of validation
 * functions to check the stored token against.
 * @return {Promise.<string>} promise that is resolved to access token if the stored token is valid. If it is
 * invalid then the promise is rejected. If invalid token should be re-requested then rejection object will
 * have {authRedirect: true}.
 * @private
 */
Auth.prototype._getValidatedToken = function (validators) {
  let tokenPromise = this._storage.getToken();

  for (let i = 0; i < validators.length; i++) {
    tokenPromise = tokenPromise.then(validators[i]);
  }

  return tokenPromise.then(storedToken => storedToken.access_token);
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
 * Redirects the given iframe to the given URL
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
  const iframe = document.createElement('iframe');

  iframe.style.border = iframe.style.width = iframe.style.height = '0px';
  iframe.style.visibility = 'hidden';
  iframe.style.position = 'absolute';
  iframe.style.left = '-10000px';
  window.document.body.appendChild(iframe);

  return iframe;
};

/**
 * Refreshes access token in iframe.
 *
 * @return {Promise.<string>} promise that is resolved to access token when it is loaded in a background iframe. The
 * promise is rejected if no token was received after {@link Auth.BACKGROUND_TIMEOUT} ms.
 */
Auth.prototype._loadTokenInBackground = function () {
  if (this._backgroundPromise) {
    return this._backgroundPromise;
  }

  const resetPromise = () => {
    this._backgroundPromise = null;
  };

  this._backgroundPromise = new Promise((resolve, reject) => {
    const iframe = this._createHiddenFrame();

    // TODO Remove after "redirect: false" is default, i.e. after Hub 1.0 everywhere
    const backgroundMode = this.config.redirect ? 'skip' : 'silent';

    this._requestBuilder.prepareAuthRequest({request_credentials: backgroundMode}, {nonRedirect: true}).
    then(authRequest => {
      let cleanRunned;

      function cleanUp() {
        if (cleanRunned) {
          return;
        }
        cleanRunned = true;
        /* eslint-disable no-use-before-define */
        clearTimeout(timeout);
        removeStateListener();
        removeTokenListener();
        /* eslint-enable no-use-before-define */
        window.document.body.removeChild(iframe);
      }

      const timeout = setTimeout(() => {
        reject(new Error('Auth Timeout'));
        cleanUp();
      }, Auth.BACKGROUND_TIMEOUT);

      const removeTokenListener = this._storage.onTokenChange(function (token) {
        if (token !== null) {
          cleanUp();
          resolve(token.access_token);
        }
      });

      const removeStateListener = this._storage.onStateChange(authRequest.stateId, function (state) {
        if (state && state.error) {
          cleanUp();
          reject(new AuthResponseParser.AuthError(state));
        }
      });

      this._redirectFrame(iframe, authRequest.url);
    });
  });

  this._backgroundPromise.
  then(resetPromise).
  catch(resetPromise);

  return this._backgroundPromise;
};
/**
 * Sets location hash
 * @param {string} hash
 */
Auth.prototype.setHash = function (hash) {
  if (history.replaceState) {
    // NB! History.replaceState is used here, because Firefox saves
    // a record in history.
    // NB! URL to redirect is formed manually because baseURI could be messed up
    // in which case it's not obvious where redirect will lead.
    const cleanedUrl = [
      window.location.pathname,
      window.location.search
    ].join('');

    history.replaceState(undefined, undefined, cleanedUrl + '#' + hash);
  } else {
    window.location.hash = hash;
  }
};

module.exports = Auth;
