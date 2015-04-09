/* eslint-disable google-camelcase/google-camelcase */
var mixIn = require('mout/object/mixIn');
var guid = require('mout/random/guid');

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
 * @param {object=} extraState additional state parameters to save
 * @return {Promise.<string>} promise that is resolved to authURL
 */
AuthRequestBuilder.prototype.prepareAuthRequest = function (extraParams, extraState) {
  var stateId = AuthRequestBuilder._uuid();
  var scopes = this.config.scopes.map(function (scope) {
    return encodeURIComponent(scope);
  });

  var request = mixIn({
    response_type: 'token',
    state: stateId,
    redirect_uri: this.config.redirect_uri,
    request_credentials: this.config.request_credentials,
    client_id: this.config.client_id,
    scope: scopes.join(' ')
  }, extraParams || {});

  var authURL = AuthRequestBuilder.encodeURL(this.config.authorization, request);

  var state = mixIn({
    restoreLocation: window.location.href,
    scopes: this.config.scopes
  }, extraState || {});

  return this._saveState(stateId, state).then(function () {
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
AuthRequestBuilder._uuid = guid;

/*
 * Takes a URL as input and a params object.
 * Each property in the params is added to the URL as query string parameters
 */
AuthRequestBuilder.encodeURL = function (url, params) {
  var res = url;
  var k;
  var i = 0;
  var firstSeparator = (url.indexOf('?') === -1) ? '?' : '&';
  for (k in params) {
    if (params.hasOwnProperty(k) && params[k] != null) {
      res += (i++ === 0 ? firstSeparator : '&') + encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }
  }
  return res;
};

module.exports = AuthRequestBuilder;
