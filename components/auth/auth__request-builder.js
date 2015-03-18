/* eslint-disable google-camelcase/google-camelcase */
var $ = require('jquery');

/**
 * @param {{
 *   authorization: string,
 *   redirect_uri: string?,
 *   request_credentials: string?,
 *   client_id: string?,
 *   scopes: string[]
 * }} config
 * @param {AuthStorage} storage
 * @constructor
 */
var AuthRequestBuilder = function (config, storage) {
  this.config = config;
  this.storage = storage;
};

/**
 * Save the state and build auth server redirect URL.
 *
 * @param {object=} extraParams additional query parameters for auth request
 * @return {Promise.<string>} promise that is resolved to authURL
 */
AuthRequestBuilder.prototype.prepareAuthRequest = function (extraParams) {
  var state = AuthRequestBuilder._uuid();
  var scopes = this.config.scopes.map(function (scope) {
    return encodeURIComponent(scope);
  });

  var request = $.extend({
    response_type: 'token',
    state: state,
    redirect_uri: this.config.redirect_uri,
    request_credentials: this.config.request_credentials,
    client_id: this.config.client_id,
    scope: scopes.join(' ')
  }, extraParams || {});

  var authURL = AuthRequestBuilder.encodeURL(this.config.authorization, request);

  return this._saveState(state, {
    restoreLocation: window.location.href,
    scopes: this.config.scopes
  }).then(function () {
    return authURL;
  });
};

/**
 * @param {string} id
 * @param {StoredState} storedState
 * @return {Promise}
 * @private
 */
AuthRequestBuilder.prototype._saveState = function (id, storedState) {
  return this.storage.saveState(id, storedState);
};

/**
 * @return {string} random string used for state
 */
AuthRequestBuilder._uuid = function () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};


/*
 * Takes an URL as input and a params object.
 * Each property in the params is added to the url as query string parameters
 */
AuthRequestBuilder.encodeURL = function (url, params) {
  var res = url;
  var k;
  var i = 0;
  var firstSeparator = (url.indexOf('?') === -1) ? '?' : '&';
  for (k in params) {
    if (params.hasOwnProperty(k)) {
      res += (i++ === 0 ? firstSeparator : '&') + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }
  }
  return res;
};

module.exports = AuthRequestBuilder;
