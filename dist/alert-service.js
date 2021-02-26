import { c as _createClass, k as _toConsumableArray, e as _objectWithoutProperties, f as _extends, i as _objectSpread2, b as _classCallCheck, d as _defineProperty } from './_rollupPluginBabelHelpers-ab14fb00.js';
import React from 'react';
import { render } from 'react-dom';
import { g as getUID } from './get-uid-bf3ab014.js';
import Alert, { Container as Alerts, ANIMATION_TIME } from './alert.js';
import 'classnames';
import 'prop-types';
import '@jetbrains/icons/exception';
import '@jetbrains/icons/checkmark';
import '@jetbrains/icons/warning';
import '@jetbrains/icons/close';
import './icon.js';
import 'util-deprecate';
import 'style-inject';
import './memoize-ad2c954c.js';
import './loader-inline.js';
import './theme-9a053da9.js';
import './data-tests-1a367745.js';
import 'conic-gradient';
import './dom-0ae85140.js';

/**
 * @name Alert Service
 */

var AlertService = /*#__PURE__*/function () {
  function AlertService() {
    _classCallCheck(this, AlertService);

    _defineProperty(this, "defaultTimeout", 0);

    _defineProperty(this, "showingAlerts", []);

    _defineProperty(this, "containerElement", document.createElement('div'));
  }

  _createClass(AlertService, [{
    key: "_getShowingAlerts",
    value: function _getShowingAlerts() {
      return _toConsumableArray(this.showingAlerts);
    }
  }, {
    key: "renderAlertContainer",
    value: function renderAlertContainer(alerts) {
      if (alerts.length === 0) {
        return /*#__PURE__*/React.createElement("span", null);
      }

      return /*#__PURE__*/React.createElement(Alerts, null, alerts.map(function (alert) {
        var message = alert.message,
            key = alert.key,
            rest = _objectWithoutProperties(alert, ["message", "key"]);

        return /*#__PURE__*/React.createElement(Alert, _extends({
          key: key
        }, rest), message);
      }));
    }
    /**
     * Renders alert container into virtual node to skip maintaining container
     */

  }, {
    key: "renderAlerts",
    value: function renderAlerts() {
      render(this.renderAlertContainer(this.showingAlerts), this.containerElement);
    }
  }, {
    key: "findSameAlert",
    value: function findSameAlert(message, type) {
      return this.showingAlerts.filter(function (it) {
        return it.type === type && it.message === message;
      })[0];
    }
  }, {
    key: "startAlertClosing",
    value: function startAlertClosing(alert) {
      alert.isClosing = true;
      this.renderAlerts();
    }
  }, {
    key: "remove",
    value: function remove(key) {
      var alertToClose = this.showingAlerts.filter(function (alert) {
        return alert.key === key;
      })[0];

      if (!alertToClose) {
        return;
      }

      this.startAlertClosing(alertToClose);
    }
  }, {
    key: "removeWithoutAnimation",
    value: function removeWithoutAnimation(key) {
      this.showingAlerts = this.showingAlerts.filter(function (alert) {
        return alert.key !== key;
      });
      this.renderAlerts();
    }
  }, {
    key: "stopShakingWhenAnimationDone",
    value: function stopShakingWhenAnimationDone(shakingAlert) {
      var _this = this;

      setTimeout(function () {
        shakingAlert.showWithAnimation = false;
        shakingAlert.isShaking = false;

        _this.renderAlerts();
      }, ANIMATION_TIME);
    }
  }, {
    key: "addAlert",
    value: function addAlert(message, type) {
      var _this2 = this;

      var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : this.defaultTimeout;
      var restOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      var sameAlert = this.findSameAlert(message, type);

      if (sameAlert) {
        sameAlert.isShaking = true;
        this.renderAlerts();
        this.stopShakingWhenAnimationDone(sameAlert);
        return sameAlert.key;
      }

      var alert = _objectSpread2({
        key: getUID('alert-service-'),
        message: message,
        type: type,
        timeout: timeout,
        isClosing: false,
        onCloseRequest: function onCloseRequest() {
          return _this2.startAlertClosing(alert);
        },
        onClose: function onClose() {
          return _this2.removeWithoutAnimation(alert.key);
        }
      }, restOptions);

      this.showingAlerts = [alert].concat(_toConsumableArray(this.showingAlerts));
      this.renderAlerts();
      return alert.key;
    }
  }, {
    key: "setDefaultTimeout",
    value: function setDefaultTimeout(timeout) {
      this.defaultTimeout = timeout;
    }
  }, {
    key: "error",
    value: function error(message, timeout) {
      return this.addAlert(message, Alert.Type.ERROR, timeout);
    }
  }, {
    key: "message",
    value: function message(_message, timeout) {
      return this.addAlert(_message, Alert.Type.MESSAGE, timeout);
    }
  }, {
    key: "warning",
    value: function warning(message, timeout) {
      return this.addAlert(message, Alert.Type.WARNING, timeout);
    }
  }, {
    key: "successMessage",
    value: function successMessage(message, timeout) {
      return this.addAlert(message, Alert.Type.SUCCESS, timeout);
    }
  }, {
    key: "loadingMessage",
    value: function loadingMessage(message, timeout) {
      return this.addAlert(message, Alert.Type.LOADING, timeout);
    }
  }]);

  return AlertService;
}();

var alertService = new AlertService();

export default alertService;
