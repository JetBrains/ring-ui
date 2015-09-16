/* global angular: false */
import 'babel/polyfill';
import 'dom4';
import shortcuts from 'shortcuts/shortcuts';

import 'dialog/dialog.scss';

const css = window.getComputedStyle;

let dialogMixin = {
  /**
   * Shows dialog.
   * @param config Object with following fields: <ul>
   *   <li>title — [required String] title of the dialog</li>
   *   <li>content — [required String] path to an angularJS template that will be rendered as a body of the dialog</li>
   *   <li>data — [optional Object, default {}] an object that is copied to the scope of the dialog content under the name 'data'</li>
   *   <li>buttons — [required Array] collection of objects representing buttons in the footer of the dialog.
   *   Following fields are available for every button: <ul>
   *     <li>label — [required String] a text on a button</li>
   *     <li>default — [optional Boolean, default false] if true then button is highlighted as default and acts on Enter key press</li>
   *     <li>close — [optional Boolean, default true] if true then click on the button closes the dialog unless action of the button returned false</li>
   *     <li>action — [optional function(data, button, errorCallback(errorMessage))] is executed on button click. If returns false then window shouldn't be closed</li>
   *     <li>Also any field may be added to the button and later read in action function</li>
   *   </ul></li>
   * </ul>
   *
   */
  show: function (config) {
    let dialogScope = this.dialogScope;

    if (!dialogScope) {
      if (this.fallbackDialog) {
        return this.fallbackDialog.show(config);
      } else {
        this.$log.error('No dialog directive is found');
        return this.$q.reject();
      }
    }

    if (dialogScope.active) {
      this.reset();
    }

    // Clear dialog errors
    dialogScope.error = null;
    if (dialogScope.dialogForm) {
      dialogScope.dialogForm.$setPristine();
    }

    if (config) {
      dialogScope.title = config.title;
      dialogScope.buttons = config.buttons;
      dialogScope.data = config.data || {};
      dialogScope.wideDialog = config.wideDialog;
      dialogScope.content = config.content;
      dialogScope.description = config.description && config.description.split('\n') || [];
    }

    dialogScope.currentShortcutsScope = shortcuts.getScope();
    dialogScope.DIALOG_NAMESPACE = this.DIALOG_NAMESPACE;
    shortcuts.setScope(this.DIALOG_NAMESPACE);

    dialogScope.active = true;
    dialogScope.promise = this.$q.defer();

    return dialogScope.promise.promise;
  },

  /**
   * Hides dialog
   */
  hide: function () {
    let dialogScope = this.dialogScope;

    if (!dialogScope) {
      if (this.fallbackDialog) {
        return this.fallbackDialog.hide();
      }
    } else {
      dialogScope.active = false;
      dialogScope.content = '';

      delete dialogScope.DIALOG_NAMESPACE;

      if (shortcuts.getScope().pop() === this.DIALOG_NAMESPACE) {
        shortcuts.setScope(dialogScope.currentShortcutsScope);
      }
    }
  },

  done: function () {
    this.dialogScope.promise.resolve();
    this.hide();
  },

  reset: function () {
    this.dialogScope.promise.reject();
    this.hide();
  },

  register: function (scope) {
    this.dialogScope = scope;

    scope.$watch('active', () => {
      if (scope.active) {
        shortcuts.bindMap({
          esc: () => {
            scope.reset();
            scope.$apply();
          },
          enter: this.applyDefaultHandler(false),
          'mod+enter': this.applyDefaultHandler(true)
        }, { scope: scope.DIALOG_NAMESPACE });
      }
    });
  },

  unregister: function () {
    delete this.dialogScope;
  },

  applyDefaultHandler: function (isTextAreaShortcut) {
    let scope = this.dialogScope;

    return event => {
      if (event.target.matches('textarea') !== isTextAreaShortcut || event.target.matches('button')) {
        return;
      }

      event.stopPropagation();
      event.preventDefault();

      if (scope.dialogForm.$valid) {
        scope.buttons.every(button => {
          if (button['default']) {
            scope.action(button);
            scope.$apply();
            return false;
          }
        });
      }
    };
  }
};

let module = angular.module('Ring.dialog', []);

function rgDialog($timeout) {
  return {
    restrict: 'AE',
    scope: {
      inSidebar: '@?',
      active: '=?'
    },
    replace: true,
    template: require('./dialog-ng.html'),
    controller: ['$scope', 'dialog', 'dialogInSidebar', function ($scope, popupDialog, sidebarDialog) {
      let dialog = $scope.inSidebar ? sidebarDialog : popupDialog;

      $scope.$on('$routeChangeSuccess', ::dialog.hide);
      $scope.$on('$routeUpdate', ::dialog.hide);

      $scope.done = () => {
        $scope.resetPosition();
        dialog.done();
      };

      $scope.reset = () => {
        $scope.resetPosition();
        dialog.reset();
      }

      $scope.action = button => {
        let dontClose = false;

        if (button.action) {
          dontClose = button.action($scope.data, button, errorMessage => {
            $scope.error = errorMessage;
          }, $scope.dialogForm) === false;
        }

        if (!dontClose && (button.close !== false)) {
          $scope.reset();
        }
      };

      this.setTitle = title => $scope.title = title;

      dialog.register($scope);

      $scope.$on('$destroy', () => {
        dialog.unregister();
      });
    }],
    link: function (scope, iElement) {
      let node = iElement[0];
      let dialogContainer = node.query('.ring-dialog__container');
      let dialogTitle = node.query('.ring-dialog__header__title');
      let pageHeight = null;
      let pageWidth = null;

      function setPosition(top, left) {
        pageHeight = window.innerHeight;
        pageWidth = window.innerWidth;

        if (top === undefined) {
          top = parseInt(css(dialogContainer).top, 10);
        }
        if (left === undefined) {
          left = parseInt(css(dialogContainer).left, 10);
        }

        let clearance = 10;
        let maxTop = pageHeight - dialogContainer.clientHeight - clearance;
        let maxLeft = pageWidth - dialogContainer.clientWidth - clearance;
        if (top > maxTop) {
          top = maxTop;
        }
        if (top < clearance) {
          top = clearance;
        }
        if (left > maxLeft) {
          left = maxLeft;
        }
        if (left < clearance) {
          left = clearance;
        }

        Object.assign(dialogContainer.style, {
          top: top + 'px',
          left: left + 'px',
          margin: '0'
        });
      }

      let titlePos = {};
      let offsetContainer = {};

      function onMousedown(e) {
        titlePos = {
          top: e.clientY,
          left: e.clientX
        };

        offsetContainer = dialogContainer.getBoundingClientRect();

        // Duct tape for all Ring 1.0 dropdown components inside
        node.dispatchEvent(new CustomEvent('ring.popup-close'));

        document.addEventListener('mousemove', onMousemove);
        document.addEventListener('mouseup', onMouseup);
        window.addEventListener('resize', setPosition);
      }

      // Focus first input
      function focusFirst() {
        let controls = node.queryAll('input,select,textarea,*[contentEditable=true]').filter(node => css(node).display !== 'none');
        if (controls.length) {
          controls[0].focus();
        }
      }

      function onMousemove(e) {
        e.preventDefault();
        let top = offsetContainer.top - titlePos.top + e.clientY;
        let left = offsetContainer.left - titlePos.left + e.clientX;
        setPosition(top, left);
      }

      function onMouseup() {
        titlePos = {};
        offsetContainer = {};
        document.removeEventListener('mousemove', onMousemove);
        document.removeEventListener('mouseup', onMouseup);
        window.removeEventListener('resize', setPosition);
      }

      function onFocusin(e) {
        if (!node.contains(e.target) && e.target.classList.contains('ring-popup')) {
          e.preventDefault();
          focusFirst();
        }
      }

      scope.resetPosition = () => dialogContainer.removeAttribute('style');

      dialogTitle.addEventListener('mousedown', onMousedown);
      document.addEventListener('focusin', onFocusin);
      scope.$on('$includeContentLoaded', () => $timeout(focusFirst));

      scope.$on('$destroy', () => {
        dialogTitle.removeEventListener('mousedown', onMousedown);
        document.removeEventListener('mousemove', onMousemove);
        document.removeEventListener('mouseup', onMouseup);
        document.removeEventListener('focusin', onFocusin);
        window.removeEventListener('resize', setPosition);
      });
    }
  };
}

function rgDialogTitle() {
  return {
    require: '^rgDialog',
    link: function (scope, iElement, iAttrs, dialogCtrl) {
      dialogCtrl.setTitle(iAttrs.rgDialogTitle);
    }
  };
}

function dialog($log, $q) {
  return {
    DIALOG_NAMESPACE: 'ring-dialog',
    $log: $log,
    $q: $q
  };
}

function dialogInSidebar($log, $q, dialog) {
  return {
    fallbackDialog: dialog,
    DIALOG_NAMESPACE: 'ring-dialog-in-sidebar',
    $log: $log,
    $q: $q
  };
}

module.directive('rgDialog', rgDialog);
module.directive('rgDialogTitle', rgDialogTitle);
module.service('dialog', dialog);
module.service('dialogInSidebar', dialogInSidebar);

module.config($provide => {
  $provide.decorator('dialog', $delegate => {
    return angular.extend($delegate, dialogMixin);
  });
});

module.config($provide => {
  $provide.decorator('dialogInSidebar', $delegate => {
    return angular.extend($delegate, dialogMixin);
  });
});

export default module.name;
