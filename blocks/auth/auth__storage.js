define(['global/global__modules', 'storage/storage'], function (Module) {
  'use strict';

  var storage = Module.get('storage');

  /**
   * Custom storage for jso
   */
  var AuthStorage = function (params) {
    this.stateStoragePrefix = params.stateStoragePrefix;
    this.tokensStoragePrefix = params.tokensStoragePrefix;
  };

  AuthStorage.prototype.saveState = function (id, state, secondTry) {
    var self = this;

    storage('set', this.stateStoragePrefix + id, state)
      .fail(function () {
        if (!secondTry && self.cleanStates()) {
          self.saveState(id, state, true);
        }
      });
  };

  AuthStorage.prototype.cleanStates = function () {
    var self = this;
    var cleaned = false;

    storage('each', function (item) {
      if (item.indexOf(self.stateStoragePrefix) === 0) {
        storage('remove', item);
        cleaned = true;
      }
    }).fail(function () {
      cleaned = null;
    });

    return cleaned;
  };

  AuthStorage.prototype.getState = function (id) {
    var state;
    var self = this;

    storage('get', this.stateStoragePrefix + id).done(function (result) {
      state = result;
      self.cleanStates();
    });

    return state;
  };

  AuthStorage.prototype.saveTokens = function (provider, tokens) {
    storage('set', this.tokensStoragePrefix + provider, tokens);
  };

  AuthStorage.prototype.getTokens = function (provider) {
    var tokens = [];

    storage('get', this.tokensStoragePrefix + provider).done(function (result) {
      tokens = result;
    });

    return tokens;
  };

  AuthStorage.prototype.wipeTokens = function (provider) {
    storage('remove', this.tokensStoragePrefix + provider);
  };

  return AuthStorage;
});