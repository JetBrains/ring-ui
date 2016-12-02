import {
  showError,
  showMessage,
  showSuccessMessage,
  showWarning,
  showLoadingMessage
} from '../alert-service/alert-service';

/**
 * @name Alert Ng
 * @category Angular Components
 * @description Provides an Angular wrapper for **Alerts**.
 */

/* global angular: false */
const angularModule = angular.module('Ring.alert', []);

function alert() {
  let defaultTTL = 0; // no ttl, never closed by timeout

  function setDefaultTTL(ttl) {
    defaultTTL = parseInt(ttl, 10);
  }

  function error(text, ttl = defaultTTL) {
    return showError(text, ttl);
  }

  function warning(text, ttl = defaultTTL) {
    return showWarning(text, ttl);
  }

  function message(text, ttl = defaultTTL) {
    return showMessage(text, ttl);
  }

  function success(text, ttl = defaultTTL) {
    return showSuccessMessage(text, ttl);
  }

  function loading(text, ttl = defaultTTL) {
    return showLoadingMessage(text, ttl);
  }

  this.setDefaultTTL = setDefaultTTL;

  /*@ngInject*/
  this.$get = () => ({
    error,
    warning,
    message,
    success,
    loading
  });
}

angularModule.provider('alert', alert);

export default angularModule.name;
